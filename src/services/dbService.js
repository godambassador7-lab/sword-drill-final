import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

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

    // Separate quiz history entry from user progress fields
    const quizHistoryEntry = {
      verseId: quizData.verseId,
      verseReference: quizData.verseReference,
      type: quizData.type,
      correct: quizData.correct,
      timestamp: quizData.timestamp,
      points: quizData.points
    };

    const updateData = {
      quizHistory: arrayUnion(quizHistoryEntry),
      quizzesCompleted: quizData.quizzesCompleted,
      totalPoints: quizData.totalPoints,
      lastActiveDate: new Date()
    };

    // Persist current streak if provided
    if (quizData.currentStreak !== undefined) {
      updateData.currentStreak = quizData.currentStreak;
    }

    // Include achievements if present
    if (quizData.achievements !== undefined) {
      updateData.achievements = quizData.achievements;
      console.log('[dbService] Adding achievements to updateData:', quizData.achievements);
    } else {
      console.log('[dbService] WARNING: quizData.achievements is undefined!');
    }

    // Include other progress fields if present
    if (quizData.versesMemorized !== undefined) {
      updateData.versesMemorized = quizData.versesMemorized;
    }
    if (quizData.verseProgress !== undefined) {
      updateData.verseProgress = quizData.verseProgress;
    }
    if (quizData.currentStreak !== undefined) {
      updateData.currentStreak = quizData.currentStreak;
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

    console.log('[dbService] Final updateData being sent to Firebase:', updateData);
    await updateDoc(doc(db, 'userProgress', userId), updateData);
    console.log('[dbService] Firebase update successful');
    return { success: true };
  } catch (error) {
    console.error('[dbService] Firebase update FAILED:', error);
    return { success: false, error: error.message };
  }
};
