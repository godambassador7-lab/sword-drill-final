/**
 * Achievement System - Core Logic
 * This module contains sensitive game mechanics for achievement unlocking.
 * Keep this in a private submodule to prevent cloning.
 */

import ACHIEVEMENT_NAME_BANK from '../../data/sword_drill_achievements/achievements.json';
import ACHIEVEMENT_CONDITIONS from '../../data/sword_drill_achievements/achievement_conditions.json';

// Achievement tier configuration
export const ACHIEVEMENT_TIERS = {
  Beginner: { display: 'Beginner', icon: '🌱', tagline: '', reqBase: 1, reqStep: 1 },
  Intermediate: { display: 'Intermediate', icon: '🌿', tagline: '', reqBase: 50, reqStep: 2 },
  Advanced: { display: 'Advanced', icon: '🔥', tagline: '', reqBase: 100, reqStep: 4 },
  Elite: { display: 'Elite', icon: '💎', tagline: '', reqBase: 150, reqStep: 8 }
};

// Parse achievement entry from JSON
const parseAchievementEntry = (raw, fallbackName) => {
  if (!raw) return { name: fallbackName, icon: '⭐' };
  const match = raw.match(/^(.*\S)\s+(\S+)$/u);
  if (match) {
    return { name: match[1], icon: match[2] };
  }
  return { name: raw, icon: '⭐' };
};

// Build ACHIEVEMENTS from achievement_conditions.json
export const ACHIEVEMENTS = Object.fromEntries(
  Object.entries(ACHIEVEMENT_CONDITIONS).map(([tier, achievements]) => {
    return [
      tier,
      Object.entries(achievements).map(([id, condition]) => {
        const { name, icon } = parseAchievementEntry(condition.name, condition.name);
        return {
          id: id,
          name: name,
          icon: icon,
          type: condition.type,
          value: condition.value,
          unlocked: false
        };
      })
    ];
  })
);

/**
 * Check for newly unlocked achievements based on user progress
 * @param {Object} userData - User's current progress data
 * @returns {Array} Array of newly unlocked achievement IDs
 */
export const checkForNewAchievements = (userData) => {
  const currentAchievements = Array.isArray(userData.achievements) ? userData.achievements : [];
  const newlyUnlocked = [];

  // Flatten all achievements into a single array
  const allAchievements = [];
  Object.entries(ACHIEVEMENTS).forEach(([tier, achievements]) => {
    achievements.forEach(achievement => {
      allAchievements.push(achievement);
    });
  });

  // Check each achievement
  allAchievements.forEach(achievement => {
    // Skip if already unlocked
    if (currentAchievements.includes(achievement.id)) {
      return;
    }

    // Check if conditions are met
    let shouldUnlock = false;
    switch (achievement.type) {
      case 'quiz_count':
        shouldUnlock = userData.quizzesCompleted >= achievement.value;
        break;
      case 'streak':
        shouldUnlock = userData.currentStreak >= achievement.value;
        break;
      case 'verse_mastered':
        shouldUnlock = userData.versesMemorized >= achievement.value;
        break;
      case 'points':
        shouldUnlock = userData.totalPoints >= achievement.value;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push(achievement.id);
    }
  });

  return newlyUnlocked;
};

export default {
  ACHIEVEMENT_TIERS,
  ACHIEVEMENTS,
  checkForNewAchievements
};
