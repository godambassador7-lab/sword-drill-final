import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import {
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  signQuizEvent,
  validateVerseOfDayRead
} from './pointValidation';

export const getUserData = async (userId) => {
  try {
    console.log('[dbService] getUserData called for userId:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    const progressDoc = await getDoc(doc(db, 'userProgress', userId));

    const progressData = progressDoc.data();
    console.log('[dbService] Retrieved progress data from Firebase:', progressData);
    console.log('[dbService] Achievements in retrieved data:', progressData?.achievements);

    return {
      success: true,
      user: userDoc.data(),
      progress: progressData
    };
  } catch (error) {
    console.error('[dbService] getUserData FAILED:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProgress = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'userProgress', userId), data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addQuizResult = async (userId, quizData) => {
  try {
    console.log('[dbService] addQuizResult called with userId:', userId);
    console.log('[dbService] quizData.achievements:', quizData.achievements);

    // SECURITY: Get existing quiz history for validation
    const userDoc = await getDoc(doc(db, 'userProgress', userId));
    const existingData = userDoc.data() || {};
    const existingQuizHistory = existingData.quizHistory || [];

    // SERVER-SIDE VALIDATION: Validate quiz submission
    const validation = validateQuizSubmission(
      {
        type: quizData.type,
        reference: quizData.verseReference,
        answer: quizData.answer,
        timestamp: quizData.timestamp
      },
      existingQuizHistory
    );

    if (!validation.valid) {
      console.warn('[dbService] Quiz validation FAILED:', validation.errors);
      return {
        success: false,
        error: validation.errors.join('; '),
        validationErrors: validation.errors
      };
    }

    // SERVER-SIDE VALIDATION: Calculate validated points (don't trust client)
    const pointsValidation = calculateValidatedPoints(
      {
        type: quizData.type,
        reference: quizData.verseReference,
        timestamp: quizData.timestamp
      },
      quizData.points, // base points from client
      existingQuizHistory
    );

    if (pointsValidation.denied) {
      console.warn('[dbService] Points calculation denied:', pointsValidation.errors);
      return {
        success: false,
        error: pointsValidation.errors.join('; ')
      };
    }

    // Use validated points, not client-sent points
    const validatedPoints = pointsValidation.points;

    console.log('[dbService] Points validation:', {
      clientSent: quizData.points,
      validated: validatedPoints,
      diminishingMultiplier: pointsValidation.diminishingMultiplier
    });

    // Sign the quiz event with server timestamp
    const signedEvent = signQuizEvent({
      verseId: quizData.verseId,
      verseReference: quizData.verseReference,
      type: quizData.type,
      correct: quizData.correct,
      timestamp: quizData.timestamp,
      points: validatedPoints // Use validated points
    });

    // RECOMPUTE totals from history (don't trust client)
    const updatedHistory = [...existingQuizHistory, signedEvent];
    const recomputedStreak = recomputeStreakFromHistory(updatedHistory);
    const recomputedTotalPoints = recomputeTotalPoints(updatedHistory);

    const updateData = {
      quizHistory: arrayUnion(signedEvent),
      quizzesCompleted: updatedHistory.length,
      totalPoints: recomputedTotalPoints, // Use recomputed total
      currentStreak: recomputedStreak.currentStreak, // Use recomputed streak
      longestStreak: Math.max(
        recomputedStreak.longestStreak,
        existingData.longestStreak || 0
      ),
      streakData: recomputedStreak.streakData, // Use recomputed streak data
      lastActiveDate: serverTimestamp(),
      lastValidatedAt: serverTimestamp() // Track when last validated
    };

    // Include achievements if present (trust client for achievements)
    if (quizData.achievements !== undefined) {
      updateData.achievements = quizData.achievements;
      console.log('[dbService] Adding achievements to updateData:', quizData.achievements);
    } else {
      console.log('[dbService] WARNING: quizData.achievements is undefined!');
    }

    // Include other progress fields if present (these are OK to trust)
    if (quizData.versesMemorized !== undefined) {
      updateData.versesMemorized = quizData.versesMemorized;
    }
    if (quizData.verseProgress !== undefined) {
      updateData.verseProgress = quizData.verseProgress;
    }
    if (quizData.unlockables !== undefined) {
      updateData.unlockables = quizData.unlockables;
    }
    if (quizData.newlyUnlockedAchievements !== undefined) {
      updateData.newlyUnlockedAchievements = quizData.newlyUnlockedAchievements;
    }
    if (quizData.achievementClickHistory !== undefined) {
      updateData.achievementClickHistory = quizData.achievementClickHistory;
    }
    if (quizData.studyPlanProgress !== undefined) {
      updateData.studyPlanProgress = quizData.studyPlanProgress;
    }
    if (quizData.currentLevel !== undefined) {
      updateData.currentLevel = quizData.currentLevel;
    }

    console.log('[dbService] Final updateData being sent to Firebase:', updateData);
    await updateDoc(doc(db, 'userProgress', userId), updateData);
    console.log('[dbService] Firebase update successful');

    // Return validated/recomputed values to client
    return {
      success: true,
      validatedData: {
        totalPoints: recomputedTotalPoints,
        currentStreak: recomputedStreak.currentStreak,
        longestStreak: updateData.longestStreak,
        streakData: recomputedStreak.streakData,
        pointsAwarded: validatedPoints,
        diminishingMultiplier: pointsValidation.diminishingMultiplier,
        quizzesCompleted: updatedHistory.length,
        currentLevel: updateData.currentLevel // Include level if provided
      }
    };
  } catch (error) {
    console.error('[dbService] Firebase update FAILED:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Secure unlockable purchase with server-side validation
 * Supports dual currency (points + talents)
 */
export const purchaseUnlockable = async (userId, unlockableId, pointsCost, talentsCost = 0) => {
  try {
    console.log('[dbService] purchaseUnlockable:', { userId, unlockableId, pointsCost, talentsCost });

    // Get existing data from DB (this IS the server-side truth)
    const userDoc = await getDoc(doc(db, 'userProgress', userId));
    const existingData = userDoc.data() || {};
    const dbPoints = existingData.totalPoints || 0;
    const dbTalents = existingData.talents || 0;

    // Validate: user has enough points and talents in the DB
    if (pointsCost > dbPoints) {
      console.warn('[dbService] Purchase validation FAILED: insufficient points', { need: pointsCost, have: dbPoints });
      return {
        success: false,
        error: `Insufficient points: need ${pointsCost}, have ${dbPoints}`
      };
    }

    if (talentsCost > dbTalents) {
      console.warn('[dbService] Purchase validation FAILED: insufficient talents', { need: talentsCost, have: dbTalents });
      return {
        success: false,
        error: `Insufficient talents: need ${talentsCost}, have ${dbTalents}`
      };
    }

    const remainingPoints = dbPoints - pointsCost;
    const remainingTalents = dbTalents - talentsCost;

    // Update unlockables and deduct currency
    const updatedUnlockables = {
      ...(existingData.unlockables || {}),
      [unlockableId]: true
    };

    // Track purchase in history for transaction tracking
    const purchaseRecord = {
      unlockableId: unlockableId,
      pointsCost,
      talentsCost,
      timestamp: Date.now(),
      pointsAfter: remainingPoints,
      talentsAfter: remainingTalents
    };

    const updateData = {
      unlockables: updatedUnlockables,
      totalPoints: remainingPoints,
      lastPurchaseTimestamp: serverTimestamp(),
      purchaseHistory: arrayUnion(purchaseRecord)
    };

    // Only update talents field if talents were used
    if (talentsCost > 0) {
      updateData.talents = remainingTalents;
    }

    await updateDoc(doc(db, 'userProgress', userId), updateData);

    return {
      success: true,
      validatedData: {
        unlockables: updatedUnlockables,
        totalPoints: remainingPoints,
        talents: remainingTalents
      }
    };
  } catch (error) {
    console.error('[dbService] Purchase FAILED:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Validate and record verse-of-day read
 * Prevents repeated claims
 */
export const recordVerseOfDayRead = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'userProgress', userId));
    const existingData = userDoc.data() || {};
    const lastRead = existingData.lastVerseOfDayRead || 0;

    // Validate cooldown
    const validation = validateVerseOfDayRead(lastRead);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        cooldownRemaining: validation.cooldownRemaining
      };
    }

    // Record timestamp
    await updateDoc(doc(db, 'userProgress', userId), {
      lastVerseOfDayRead: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('[dbService] Verse-of-day record FAILED:', error);
    return { success: false, error: error.message };
  }
};
