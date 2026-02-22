/**
 * Game Economy - Private Core Module
 *
 * Contains all pricing, reward tables, chest loot, power-up effects,
 * and economic balance that should be hidden from players.
 *
 * SECURITY: Keep in private submodule to prevent farming exploits
 */

// ============================================================================
// POWER-UP DEFINITIONS
// ============================================================================

export const POWER_UPS = {
  DOUBLE_POINTS: {
    cost: 50,
    duration: 600000, // 10 minutes
    multiplier: 2,
    name: 'Double Points',
    icon: '⚡',
    description: '2x points for 10 minutes',
    category: 'boost'
  },
  STREAK_FREEZE: {
    cost: 75,
    duration: 86400000, // 24 hours
    name: 'Streak Freeze',
    icon: '🧊',
    description: 'Protect your streak for 24 hours',
    category: 'protection'
  },
  STREAK_REDEMPTION: {
    cost: 2000,
    name: 'Streak Redemption',
    icon: '💪',
    description: 'Restore your lost streak (24hr window)',
    category: 'special',
    timeWindow: 86400000 // Must use within 24 hours of losing streak
  },
  EXTRA_TIME: {
    cost: 25,
    duration: 600000, // 10 minutes
    extraTime: 60, // +60 seconds
    name: 'Extra Time',
    icon: '⏰',
    description: '+60 seconds for 10 minutes',
    category: 'boost'
  },
  POINT_SHIELD: {
    cost: 100,
    duration: 1800000, // 30 minutes
    name: 'Point Shield',
    icon: '🛡️',
    description: 'No point loss for 30 minutes',
    category: 'protection'
  },
  QUIZ_ATTEMPTS_5: {
    cost: 100,
    quizAttempts: 5,
    name: '+5 Quiz Attempts',
    icon: '📝',
    description: 'Add 5 attempts to a quiz type',
    category: 'resource'
  },
  QUIZ_ATTEMPTS_10: {
    cost: 180,
    quizAttempts: 10,
    name: '+10 Quiz Attempts',
    icon: '📚',
    description: 'Add 10 attempts to a quiz type',
    category: 'resource'
  }
};

// ============================================================================
// DAILY CHEST REWARDS
// ============================================================================

export const DAILY_CHESTS = [
  {
    id: 'daily-chest-1',
    title: 'Morning Blessing',
    subtitle: 'Earn Manna with each quiz today!',
    timeRestriction: {
      startHour: 3,  // 3:00 AM
      endHour: 15    // 3:00 PM (exclusive)
    },
    rewards: [
      {
        type: 'manna-activation',
        description: 'Earn 1 Manna per quiz completed today'
      }
    ]
  },
  {
    id: 'daily-chest-2',
    title: 'Evening Grace',
    subtitle: '5 free Keys + 1 hour protection',
    timeRestriction: {
      startHour: 15, // 3:00 PM
      endHour: 3     // 3:00 AM (wraps around)
    },
    rewards: [
      { type: 'keys', amount: 5 },
      {
        type: 'protection',
        duration: 3600000,
        description: '1 hour protection from quiz penalties'
      }
    ]
  }
];

// ============================================================================
// STREAK CHEST TIERS
// ============================================================================

export const STREAK_CHESTS = [
  {
    id: 'daily-3',
    title: '3-Day Streak Chest',
    requirement: 3,
    type: 'daily',
    icon: '🎁',
    color: 'from-blue-500 to-cyan-500',
    rewards: [
      { type: 'points', amount: 50 },
      { type: 'powerup', item: 'EXTRA_TIME', quantity: 1 }
    ]
  },
  {
    id: 'daily-7',
    title: '7-Day Streak Chest',
    requirement: 7,
    type: 'daily',
    icon: '🎉',
    color: 'from-purple-500 to-pink-500',
    rewards: [
      { type: 'points', amount: 100 },
      { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 1 }
    ]
  },
  {
    id: 'daily-14',
    title: '14-Day Streak Chest',
    requirement: 14,
    type: 'daily',
    icon: '💎',
    color: 'from-amber-500 to-orange-500',
    rewards: [
      { type: 'points', amount: 200 },
      { type: 'powerup', item: 'STREAK_FREEZE', quantity: 1 }
    ]
  },
  {
    id: 'daily-30',
    title: '30-Day Streak Chest',
    requirement: 30,
    type: 'daily',
    icon: '👑',
    color: 'from-yellow-400 to-amber-500',
    rewards: [
      { type: 'points', amount: 500 },
      { type: 'powerup', item: 'POINT_SHIELD', quantity: 1 },
      { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 2 }
    ]
  },
  {
    id: 'daily-50',
    title: '50-Day Streak Chest',
    requirement: 50,
    type: 'daily',
    icon: '🏆',
    color: 'from-red-500 to-pink-500',
    rewards: [
      { type: 'points', amount: 1000 },
      { type: 'powerup', item: 'STREAK_FREEZE', quantity: 2 },
      { type: 'powerup', item: 'POINT_SHIELD', quantity: 1 }
    ]
  },
  {
    id: 'daily-100',
    title: '100-Day Streak Chest',
    requirement: 100,
    type: 'daily',
    icon: '🌟',
    color: 'from-purple-600 to-indigo-600',
    rewards: [
      { type: 'points', amount: 2500 },
      { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 5 },
      { type: 'powerup', item: 'STREAK_FREEZE', quantity: 3 },
      { type: 'powerup', item: 'POINT_SHIELD', quantity: 2 }
    ]
  }
];

// ============================================================================
// UNLOCKABLE COSTS
// ============================================================================

export const UNLOCKABLE_COSTS = {
  // Premium texts
  apocrypha: 500,
  lxx: 750,
  sinaiticus: 1000,
  masoretic: 1500,

  // Special collections
  wordsOfJesus: 300,
  eliChallenge: 600,

  // Features
  customTheme: 250,
  skipDifficulty: 150,
  darkMode: 100
};

// ============================================================================
// MANNA COSTS (Daily-only currency)
// ============================================================================

export const MANNA_COSTS = {
  hint: 2,
  retry: 3,
  skipQuestion: 5,
  revealAnswer: 8,
  extraTime: 4,
  doublePointsQuiz: 10 // For single quiz only
};

// ============================================================================
// KEY COSTS & DROP RATES
// ============================================================================

export const KEY_ECONOMY = {
  // Keys earned per action
  earnRates: {
    quizComplete: 1,
    perfectQuiz: 3,
    dailyMissionComplete: 2,
    achievementUnlock: 5
  },

  // Chest costs (keys needed to open)
  chestCosts: {
    bronze: 5,
    silver: 15,
    gold: 30,
    diamond: 50
  },

  // Chest drop tables (what's inside)
  chestDrops: {
    bronze: {
      points: { min: 25, max: 75, weight: 70 },
      manna: { min: 5, max: 15, weight: 20 },
      powerup: { items: ['EXTRA_TIME'], weight: 10 }
    },
    silver: {
      points: { min: 100, max: 200, weight: 50 },
      manna: { min: 20, max: 40, weight: 30 },
      powerup: { items: ['DOUBLE_POINTS', 'EXTRA_TIME'], weight: 20 }
    },
    gold: {
      points: { min: 300, max: 500, weight: 40 },
      manna: { min: 50, max: 100, weight: 20 },
      powerup: { items: ['DOUBLE_POINTS', 'POINT_SHIELD', 'STREAK_FREEZE'], weight: 40 }
    },
    diamond: {
      points: { min: 750, max: 1500, weight: 30 },
      manna: { min: 100, max: 200, weight: 20 },
      powerup: { items: ['STREAK_FREEZE', 'POINT_SHIELD', 'DOUBLE_POINTS'], weight: 30 },
      unlockable: { items: ['apocrypha', 'wordsOfJesus'], weight: 20 }
    }
  }
};

// ============================================================================
// STREAK & XP FORMULAS
// ============================================================================

export const STREAK_REWARDS = {
  // XP rewards by day
  baseXP: 10,
  growthFactor: 2, // XP grows by streak * factor

  // Streak grace period
  gracePeriodHours: 24,

  // Streak protection (from power-ups)
  freezeDuration: 86400000, // 24 hours

  // Streak redemption window
  redemptionWindow: 86400000, // Must redeem within 24 hours

  // Streak milestones (bonus rewards)
  milestones: {
    3: { bonus: 50, title: '3-Day Warrior' },
    7: { bonus: 150, title: 'Week Champion' },
    14: { bonus: 400, title: 'Fortnight Master' },
    30: { bonus: 1000, title: 'Monthly Devotee' },
    50: { bonus: 2000, title: 'Dedication Expert' },
    100: { bonus: 5000, title: 'Century Scholar' },
    365: { bonus: 25000, title: 'Yearly Faithful' }
  }
};

/**
 * Calculate XP reward for streak day
 */
export function calculateStreakXP(streakDay) {
  return STREAK_REWARDS.baseXP + (streakDay * STREAK_REWARDS.growthFactor);
}

/**
 * Get streak milestone rewards for current streak
 */
export function getStreakMilestoneRewards(currentStreak, previousStreak = 0) {
  const rewards = [];

  Object.entries(STREAK_REWARDS.milestones).forEach(([day, reward]) => {
    const dayNum = parseInt(day);
    if (currentStreak >= dayNum && previousStreak < dayNum) {
      rewards.push({
        day: dayNum,
        ...reward
      });
    }
  });

  return rewards;
}

// ============================================================================
// CHEST LOOT GENERATION
// ============================================================================

/**
 * Roll loot from a chest based on drop table
 * Uses weighted random selection
 */
export function rollChestLoot(chestType) {
  const dropTable = KEY_ECONOMY.chestDrops[chestType];
  if (!dropTable) {
    return { error: 'Invalid chest type' };
  }

  // Calculate total weight
  const totalWeight = Object.values(dropTable).reduce((sum, entry) => sum + entry.weight, 0);

  // Roll random number
  const roll = Math.random() * totalWeight;

  let currentWeight = 0;
  for (const [rewardType, config] of Object.entries(dropTable)) {
    currentWeight += config.weight;

    if (roll <= currentWeight) {
      // This reward type was selected
      if (rewardType === 'points' || rewardType === 'manna') {
        const amount = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
        return { type: rewardType, amount };
      } else if (rewardType === 'powerup') {
        const item = config.items[Math.floor(Math.random() * config.items.length)];
        return { type: 'powerup', item };
      } else if (rewardType === 'unlockable') {
        const item = config.items[Math.floor(Math.random() * config.items.length)];
        return { type: 'unlockable', item };
      }
    }
  }

  // Fallback (shouldn't reach here)
  return { type: 'points', amount: 10 };
}

// ============================================================================
// PURCHASE COST CALCULATION
// ============================================================================

/**
 * Get cost for a purchase (handles dynamic pricing if needed)
 */
export function getPurchaseCost(itemType, itemId) {
  if (itemType === 'powerup') {
    return POWER_UPS[itemId]?.cost || 0;
  } else if (itemType === 'unlockable') {
    return UNLOCKABLE_COSTS[itemId] || 0;
  } else if (itemType === 'manna') {
    return MANNA_COSTS[itemId] || 0;
  }

  return 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  POWER_UPS,
  DAILY_CHESTS,
  STREAK_CHESTS,
  UNLOCKABLE_COSTS,
  MANNA_COSTS,
  KEY_ECONOMY,
  STREAK_REWARDS,
  calculateStreakXP,
  getStreakMilestoneRewards,
  rollChestLoot,
  getPurchaseCost
};
