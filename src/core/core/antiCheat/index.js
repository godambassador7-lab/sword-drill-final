/**
 * Anti-Cheat & Point Validation - Private Core Module
 *
 * This module contains all rate-limiting, validation, and anti-exploit logic
 * that should NEVER be exposed in the public client code.
 *
 * SECURITY: Keep in private submodule to prevent tampering
 */

// ============================================================================
// RATE LIMITS & CAPS
// ============================================================================

export const RATE_LIMITS = {
  // Daily limits to prevent farming
  MAX_QUIZZES_PER_DAY: 50,
  MAX_POINTS_PER_DAY: 2000,
  MAX_SAME_QUIZ_TYPE_PER_DAY: 10,
  MAX_STREAK_BONUS_PER_DAY: 200,
  VERSE_OF_DAY_COOLDOWN: 86400000, // 24 hours
  MIN_TIME_BETWEEN_QUIZZES: 3000, // 3 seconds (prevent spam)

  // Caps to prevent inflation
  MAX_BASE_POINTS_PER_QUIZ: 100,
  MAX_POINTS_PER_QUIZ: 250, // After all multipliers
};

// ============================================================================
// DIMINISHING RETURNS
// ============================================================================

export const DIMINISHING_RETURNS = {
  THRESHOLD: 5, // After 5 quizzes of same type
  REDUCTION_FACTOR: 0.75, // Each additional quiz worth 75% of previous
  MIN_MULTIPLIER: 0.25, // Minimum 25% of original points
};

// ============================================================================
// QUIZ SIGNATURE GENERATION
// ============================================================================

/**
 * Generate a unique quiz signature to prevent duplicates
 * Uses quiz type, reference, and date (not exact timestamp)
 */
export function generateQuizSignature(quizData) {
  const { type, reference, timestamp } = quizData;
  const date = new Date(timestamp).toDateString();
  return `${type}:${reference}:${date}`;
}

// ============================================================================
// QUIZ SUBMISSION VALIDATION
// ============================================================================

/**
 * Server-side validation to prevent point economy exploits
 * Returns validation result with errors if any
 */
export function validateQuizSubmission(quizData, quizHistory = []) {
  const now = Date.now();
  const errors = [];

  // 1. Timestamp validity
  if (!quizData.timestamp || quizData.timestamp > now + 60000) {
    errors.push('Invalid timestamp: Future timestamp not allowed');
  }

  const ageMs = now - quizData.timestamp;
  if (ageMs > 86400000) { // 24 hours
    errors.push('Quiz submission too old (max 24 hours)');
  }

  // 2. Duplicate detection
  const signature = generateQuizSignature(quizData);
  const duplicateCount = quizHistory.filter(q =>
    generateQuizSignature(q) === signature
  ).length;

  if (duplicateCount > 0) {
    errors.push(`Duplicate quiz detected: ${signature}`);
  }

  // 3. Rate limiting
  const recentQuizzes = quizHistory.filter(q =>
    now - q.timestamp < RATE_LIMITS.MIN_TIME_BETWEEN_QUIZZES
  );

  if (recentQuizzes.length > 0) {
    errors.push('Rate limit exceeded: Too many quizzes submitted too quickly');
  }

  // 4. Daily quiz count
  const today = new Date().toDateString();
  const todayQuizzes = quizHistory.filter(q =>
    new Date(q.timestamp).toDateString() === today
  );

  if (todayQuizzes.length >= RATE_LIMITS.MAX_QUIZZES_PER_DAY) {
    errors.push(`Daily quiz limit reached (${RATE_LIMITS.MAX_QUIZZES_PER_DAY})`);
  }

  // 5. Same quiz type daily limit
  const todaySameType = todayQuizzes.filter(q => q.type === quizData.type);
  if (todaySameType.length >= RATE_LIMITS.MAX_SAME_QUIZ_TYPE_PER_DAY) {
    errors.push(`Daily limit for ${quizData.type} reached (${RATE_LIMITS.MAX_SAME_QUIZ_TYPE_PER_DAY})`);
  }

  return {
    valid: errors.length === 0,
    errors,
    signature
  };
}

// ============================================================================
// DIMINISHING RETURNS CALCULATION
// ============================================================================

/**
 * Calculate diminishing returns multiplier for repeated quiz types
 * Prevents farming the same quiz type all day
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

// ============================================================================
// VALIDATED POINT CALCULATION
// ============================================================================

/**
 * Server-side point calculation - NEVER trust client-sent totals
 * Applies all caps, diminishing returns, and daily limits
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

  // Cap base points to prevent inflated values from client
  const cappedBasePoints = Math.min(basePoints, RATE_LIMITS.MAX_BASE_POINTS_PER_QUIZ);

  if (cappedBasePoints < basePoints) {
    console.warn(`[antiCheat] Client sent ${basePoints} base points, capped to ${cappedBasePoints}`);
  }

  // Apply diminishing returns
  const diminishingMultiplier = calculateDiminishingReturns(quizData.type, quizHistory);

  // Calculate final points
  let finalPoints = Math.floor(cappedBasePoints * diminishingMultiplier);

  // Cap final points after all multipliers
  finalPoints = Math.min(finalPoints, RATE_LIMITS.MAX_POINTS_PER_QUIZ);

  // Check daily point cap
  const today = new Date().toDateString();
  const todayPoints = quizHistory
    .filter(q => new Date(q.timestamp).toDateString() === today)
    .reduce((sum, q) => sum + (q.points || 0), 0);

  if (todayPoints + finalPoints > RATE_LIMITS.MAX_POINTS_PER_DAY) {
    const remaining = Math.max(0, RATE_LIMITS.MAX_POINTS_PER_DAY - todayPoints);
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

// ============================================================================
// STREAK RECOMPUTATION
// ============================================================================

/**
 * Recompute streak from quiz history - don't trust client
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

  // Calculate current streak
  const today = new Date().toDateString();
  let currentStreak = 0;
  let checkDate = new Date();

  const hasQuizToday = streakData[today];

  // If no quiz today, start from yesterday (grace period)
  if (!hasQuizToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards from today/yesterday
  while (true) {
    const dateStr = checkDate.toDateString();
    if (streakData[dateStr]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
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
        tempStreak++;
      } else {
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

// ============================================================================
// TOTAL POINTS RECOMPUTATION
// ============================================================================

/**
 * Recompute total points from quiz history
 * Never trust client-sent totals
 */
export function recomputeTotalPoints(quizHistory = []) {
  let totalPoints = 0;
  let cappedCount = 0;

  quizHistory.forEach(q => {
    if (q.correct && q.points) {
      // Correct answer: add points (capped to prevent inflated values)
      const cappedPoints = Math.min(q.points, RATE_LIMITS.MAX_POINTS_PER_QUIZ);

      if (cappedPoints < q.points) {
        cappedCount++;
        console.log(`[antiCheat] Capped quiz from ${q.points} to ${cappedPoints} points`);
      }

      totalPoints += cappedPoints;
    } else if (!q.correct && q.points < 0) {
      // Wrong answer: apply penalty (points is already negative)
      totalPoints += q.points;
    }
  });

  if (cappedCount > 0) {
    console.log(`[antiCheat] Total: ${cappedCount} quizzes had inflated points and were capped`);
  }

  // Never go below 0
  return Math.max(0, totalPoints);
}

// ============================================================================
// COOLDOWN VALIDATION
// ============================================================================

/**
 * Validate verse-of-day reading (prevent repeated claims)
 */
export function validateCooldown(lastActionTimestamp, cooldownMs, currentTimestamp = Date.now()) {
  if (!lastActionTimestamp) {
    return { valid: true, cooldownRemaining: 0 };
  }

  const timeSinceAction = currentTimestamp - lastActionTimestamp;

  if (timeSinceAction < cooldownMs) {
    return {
      valid: false,
      cooldownRemaining: cooldownMs - timeSinceAction,
      error: 'Cooldown not expired'
    };
  }

  return { valid: true, cooldownRemaining: 0 };
}

// ============================================================================
// PURCHASE VALIDATION
// ============================================================================

/**
 * Validate unlockable/powerup purchase
 * Check if user has legitimate points
 */
export function validatePurchase(cost, trustedTotalPoints, quizHistory = []) {
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

// ============================================================================
// SIMPLE HASH FUNCTION (Replace with crypto.subtle in production)
// ============================================================================

function simpleHash(data) {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// ============================================================================
// EVENT SIGNING (For future HMAC/JWT implementation)
// ============================================================================

/**
 * Sign quiz event with checksum
 * TODO: Replace with proper HMAC-SHA256 or JWT signing
 */
export function signEvent(eventData, serverTimestamp = Date.now()) {
  const checksum = simpleHash({
    ...eventData,
    serverTimestamp
  });

  return {
    ...eventData,
    serverTimestamp,
    checksum,
    signed: true
  };
}

/**
 * Verify signed event
 * TODO: Replace with proper HMAC verification
 */
export function verifySignedEvent(signedEvent) {
  const { checksum, serverTimestamp, signed, ...eventData } = signedEvent;

  if (!signed || !checksum || !serverTimestamp) {
    return { valid: false, error: 'Event not signed' };
  }

  const expectedChecksum = simpleHash({ ...eventData, serverTimestamp });

  if (checksum !== expectedChecksum) {
    return { valid: false, error: 'Invalid signature' };
  }

  return { valid: true };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  RATE_LIMITS,
  DIMINISHING_RETURNS,
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  validateCooldown,
  validatePurchase,
  signEvent,
  verifySignedEvent,
  generateQuizSignature,
  calculateDiminishingReturns
};
