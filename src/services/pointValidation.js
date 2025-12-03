/**
 * Point Validation Service
 * Server-side validation to prevent point economy exploits
 * - Validates quiz submissions with server timestamps
 * - Prevents duplicate submissions
 * - Enforces daily caps and rate limits
 * - Recomputes points/streaks from trusted events
 */

// Daily limits to prevent farming
const DAILY_LIMITS = {
  MAX_QUIZZES_PER_DAY: 50,
  MAX_POINTS_PER_DAY: 2000,
  MAX_SAME_QUIZ_TYPE_PER_DAY: 10,
  MAX_STREAK_BONUS_PER_DAY: 200,
  VERSE_OF_DAY_COOLDOWN: 86400000, // 24 hours
  MIN_TIME_BETWEEN_QUIZZES: 3000, // 3 seconds (prevent spam)
};

// Diminishing returns for repeated quiz types
const DIMINISHING_RETURNS = {
  THRESHOLD: 5, // After 5 quizzes of same type
  REDUCTION_FACTOR: 0.75, // Each additional quiz worth 75% of previous
  MIN_MULTIPLIER: 0.25 // Minimum 25% of original points
};

/**
 * Generate a unique quiz signature to prevent duplicates
 */
export function generateQuizSignature(quizData) {
  const { type, reference, answer, timestamp } = quizData;
  // Create signature from quiz type, reference, and date (not exact timestamp)
  const date = new Date(timestamp).toDateString();
  return `${type}:${reference}:${date}`;
}

/**
 * Check if quiz submission is valid (not duplicate, not spam)
 */
export function validateQuizSubmission(quizData, quizHistory = []) {
  const now = Date.now();
  const errors = [];

  // 1. Check timestamp validity (can't be in future, can't be too old)
  if (!quizData.timestamp || quizData.timestamp > now + 60000) {
    errors.push('Invalid timestamp: Future timestamp not allowed');
  }

  const ageMs = now - quizData.timestamp;
  if (ageMs > 86400000) { // 24 hours
    errors.push('Quiz submission too old (max 24 hours)');
  }

  // 2. Check for duplicate submissions
  const signature = generateQuizSignature(quizData);
  const duplicateCount = quizHistory.filter(q =>
    generateQuizSignature(q) === signature
  ).length;

  if (duplicateCount > 0) {
    errors.push(`Duplicate quiz detected: ${signature}`);
  }

  // 3. Check rate limiting (minimum time between quizzes)
  const recentQuizzes = quizHistory.filter(q =>
    now - q.timestamp < DAILY_LIMITS.MIN_TIME_BETWEEN_QUIZZES
  );

  if (recentQuizzes.length > 0) {
    errors.push('Rate limit exceeded: Too many quizzes submitted too quickly');
  }

  // 4. Check daily quiz count
  const today = new Date().toDateString();
  const todayQuizzes = quizHistory.filter(q =>
    new Date(q.timestamp).toDateString() === today
  );

  if (todayQuizzes.length >= DAILY_LIMITS.MAX_QUIZZES_PER_DAY) {
    errors.push(`Daily quiz limit reached (${DAILY_LIMITS.MAX_QUIZZES_PER_DAY})`);
  }

  // 5. Check same quiz type daily limit
  const todaySameType = todayQuizzes.filter(q => q.type === quizData.type);
  if (todaySameType.length >= DAILY_LIMITS.MAX_SAME_QUIZ_TYPE_PER_DAY) {
    errors.push(`Daily limit for ${quizData.type} reached (${DAILY_LIMITS.MAX_SAME_QUIZ_TYPE_PER_DAY})`);
  }

  return {
    valid: errors.length === 0,
    errors,
    signature
  };
}

/**
 * Calculate diminishing returns multiplier for repeated quiz types
 */
export function calculateDiminishingReturns(quizType, quizHistory = []) {
  const today = new Date().toDateString();
  const todaySameType = quizHistory.filter(q =>
    q.type === quizType &&
    new Date(q.timestamp).toDateString() === today
  );

  const count = todaySameType.length;

  if (count < DIMINISHING_RETURNS.THRESHOLD) {
    return 1.0; // Full points
  }

  // Each additional quiz: multiply by reduction factor
  const excessQuizzes = count - DIMINISHING_RETURNS.THRESHOLD;
  let multiplier = Math.pow(DIMINISHING_RETURNS.REDUCTION_FACTOR, excessQuizzes);

  // Enforce minimum
  multiplier = Math.max(multiplier, DIMINISHING_RETURNS.MIN_MULTIPLIER);

  return multiplier;
}

/**
 * Validate and calculate actual points earned (server-side)
 * Never trust client-sent point totals
 */
export function calculateValidatedPoints(quizData, basePoints, quizHistory = []) {
  const validation = validateQuizSubmission(quizData, quizHistory);

  if (!validation.valid) {
    return {
      points: 0,
      errors: validation.errors,
      denied: true
    };
  }

  // SECURITY: Cap base points to prevent inflated values from client
  const MAX_BASE_POINTS = 100;
  const cappedBasePoints = Math.min(basePoints, MAX_BASE_POINTS);

  if (cappedBasePoints < basePoints) {
    console.warn(`[pointValidation] Client sent ${basePoints} base points, capped to ${cappedBasePoints}`);
  }

  // Apply diminishing returns
  const diminishingMultiplier = calculateDiminishingReturns(quizData.type, quizHistory);

  // Calculate final points
  let finalPoints = Math.floor(cappedBasePoints * diminishingMultiplier);

  // Check daily point cap
  const today = new Date().toDateString();
  const todayPoints = quizHistory
    .filter(q => new Date(q.timestamp).toDateString() === today)
    .reduce((sum, q) => sum + (q.points || 0), 0);

  if (todayPoints + finalPoints > DAILY_LIMITS.MAX_POINTS_PER_DAY) {
    const remaining = Math.max(0, DAILY_LIMITS.MAX_POINTS_PER_DAY - todayPoints);
    finalPoints = remaining;
  }

  return {
    points: finalPoints,
    diminishingMultiplier,
    todayPoints,
    signature: validation.signature,
    denied: false
  };
}

/**
 * Recompute streak from quiz history (don't trust client)
 * Validates calendar day continuity with server timestamps
 */
export function recomputeStreakFromHistory(quizHistory = []) {
  if (!quizHistory || quizHistory.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakData: {}
    };
  }

  // Get unique dates with correct quizzes
  const correctQuizDates = quizHistory
    .filter(q => q.correct && q.timestamp)
    .map(q => new Date(q.timestamp).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index) // unique
    .sort((a, b) => new Date(a) - new Date(b));

  if (correctQuizDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakData: {}
    };
  }

  // Build streak data
  const streakData = {};
  correctQuizDates.forEach(dateStr => {
    streakData[dateStr] = true;
  });

  // Calculate current streak (must be consecutive ending today)
  const today = new Date().toDateString();
  let currentStreak = 0;
  let checkDate = new Date();

  // Count backwards from today
  while (true) {
    const dateStr = checkDate.toDateString();
    if (streakData[dateStr]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Allow 1 day gap if user has streak freeze
      // (This would be passed as a parameter in production)
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  correctQuizDates.forEach(dateStr => {
    const currentDate = new Date(dateStr);

    if (prevDate) {
      const dayDiff = Math.floor((currentDate - prevDate) / 86400000);

      if (dayDiff === 1) {
        // Consecutive day
        tempStreak++;
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }

    prevDate = currentDate;
  });

  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    streakData
  };
}

/**
 * Recompute total points from quiz history
 * Never trust client-sent totals
 * Only counts validated quizzes with reasonable point values
 */
export function recomputeTotalPoints(quizHistory = []) {
  const MAX_POINTS_PER_QUIZ = 100; // Cap individual quiz points to prevent inflation

  let totalPoints = 0;
  let cappedCount = 0;

  quizHistory
    .filter(q => q.correct && q.points)
    .forEach(q => {
      // Cap individual quiz points to prevent old inflated values
      const originalPoints = q.points;
      const cappedPoints = Math.min(originalPoints, MAX_POINTS_PER_QUIZ);

      if (cappedPoints < originalPoints) {
        cappedCount++;
        console.log(`[pointValidation] Capped quiz from ${originalPoints} to ${cappedPoints} points`);
      }

      totalPoints += cappedPoints;
    });

  if (cappedCount > 0) {
    console.log(`[pointValidation] Total: ${cappedCount} quizzes had inflated points and were capped`);
  }

  return totalPoints;
}

/**
 * Validate verse-of-day reading (prevent repeated claims)
 */
export function validateVerseOfDayRead(lastReadTimestamp, currentTimestamp = Date.now()) {
  if (!lastReadTimestamp) {
    return { valid: true, cooldownRemaining: 0 };
  }

  const timeSinceRead = currentTimestamp - lastReadTimestamp;

  if (timeSinceRead < DAILY_LIMITS.VERSE_OF_DAY_COOLDOWN) {
    return {
      valid: false,
      cooldownRemaining: DAILY_LIMITS.VERSE_OF_DAY_COOLDOWN - timeSinceRead,
      error: 'Verse of day already claimed today'
    };
  }

  return { valid: true, cooldownRemaining: 0 };
}

/**
 * Validate unlockable purchase
 * Check if user has legitimate points
 */
export function validateUnlockablePurchase(cost, trustedTotalPoints, quizHistory = []) {
  // Recompute points from history to prevent tampering
  const recomputedPoints = recomputeTotalPoints(quizHistory);

  if (recomputedPoints < cost) {
    return {
      valid: false,
      error: `Insufficient points: need ${cost}, have ${recomputedPoints} (verified)`,
      recomputedPoints
    };
  }

  // Check if trusted total matches recomputed (detect tampering)
  if (Math.abs(trustedTotalPoints - recomputedPoints) > 100) {
    return {
      valid: false,
      error: 'Point total mismatch detected - please refresh',
      recomputedPoints,
      suspectedTampering: true
    };
  }

  return {
    valid: true,
    recomputedPoints,
    remainingPoints: recomputedPoints - cost
  };
}

/**
 * Create signed quiz event (for server verification)
 */
export function signQuizEvent(quizData, serverTimestamp = Date.now()) {
  // In production, use HMAC or JWT signing
  // For now, include server timestamp and checksum
  const checksum = hashQuizData({
    ...quizData,
    serverTimestamp
  });

  return {
    ...quizData,
    serverTimestamp,
    checksum,
    signed: true
  };
}

/**
 * Simple hash function for quiz data (in production, use crypto)
 */
function hashQuizData(data) {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

export default {
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  validateVerseOfDayRead,
  validateUnlockablePurchase,
  signQuizEvent,
  calculateDiminishingReturns,
  generateQuizSignature,
  DAILY_LIMITS,
  DIMINISHING_RETURNS
};
