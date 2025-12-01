// User Stats provider: provides access to user's quiz and streak statistics.

import { getOverallQuizStats } from '../../quizTracker';
import { getCurrentStreak } from '../../StreakManager';

/**
 * Retrieves a summary of the user's overall statistics.
 * This function is designed to be called without arguments,
 * as it retrieves data for the current user from localStorage or a similar source.
 *
 * @param {string} [userId] - Optional userId, though the underlying services may use their own session management.
 * @returns {Promise<object>} A promise that resolves to an object containing the user's statistics.
 */
export async function getOverallStats(userId) {
  try {
    // Both services might use localStorage or require a userId for server-side fetching.
    // We pass the userId if provided, assuming the services can use it.
    const quizStats = await getOverallQuizStats();
    const streakInfo = await getCurrentStreak(userId);

    return {
      totalQuizzes: quizStats.totalQuizzes,
      totalCorrect: quizStats.totalCorrect,
      totalIncorrect: quizStats.totalIncorrect,
      accuracy: quizStats.accuracy,
      quizTypeStats: quizStats.quizTypeStats,
      currentStreak: streakInfo.streak,
      totalXP: streakInfo.totalXP,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalQuizzes: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      accuracy: 0,
      quizTypeStats: {},
      currentStreak: 0,
      totalXP: 0,
      error: 'Could not retrieve user statistics.',
    };
  }
}

export default {
  getOverallStats,
};
