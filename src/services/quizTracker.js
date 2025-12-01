/**
 * Quiz Tracker Service
 *
 * Centralized service for tracking quiz activity with detailed information
 * for the activity calendar and statistics
 */

/**
 * Record a quiz attempt in the streak data
 * @param {Object} quizInfo - Information about the quiz
 * @param {string} quizInfo.verseReference - Reference for the verse/content quizzed (optional)
 * @param {string} quizInfo.type - Type of quiz (e.g., 'verse-scramble', 'greek-vocab', 'trivia')
 * @param {boolean} quizInfo.correct - Whether the quiz was answered correctly
 * @param {number} quizInfo.points - Points earned/lost
 */
export const recordQuizAttempt = (quizInfo) => {
  try {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');

    // Create detailed quiz entry
    const quizEntry = {
      verseReference: quizInfo.verseReference || 'N/A',
      type: quizInfo.type,
      correct: quizInfo.correct,
      points: quizInfo.points || 0,
      timestamp: today.toISOString()
    };

    // Initialize or update day's data
    if (!streakData[dateString]) {
      streakData[dateString] = {
        marked: quizInfo.correct, // Only mark as completed if correct
        quizCount: 1,
        quizzes: [quizEntry],
        timestamp: today.toISOString()
      };
    } else {
      // Update existing day
      streakData[dateString].quizCount = (streakData[dateString].quizCount || 0) + 1;
      if (quizInfo.correct) {
        streakData[dateString].marked = true; // Mark as complete on first correct answer
      }
      // Add quiz to the day's quiz array
      if (!streakData[dateString].quizzes) {
        streakData[dateString].quizzes = [];
      }
      streakData[dateString].quizzes.push(quizEntry);
    }

    // Save to localStorage
    localStorage.setItem('streakData', JSON.stringify(streakData));

    return true;
  } catch (error) {
    console.error('Error recording quiz attempt:', error);
    return false;
  }
};

/**
 * Get quiz statistics for a specific date
 * @param {Date} date - The date to get statistics for
 * @returns {Object|null} Quiz statistics for the date
 */
export const getQuizStatsForDate = (date) => {
  try {
    const dateString = date.toISOString().split('T')[0];
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
    return streakData[dateString] || null;
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    return null;
  }
};

/**
 * Get quiz statistics for a date range
 * @param {Date} startDate - Start of the range
 * @param {Date} endDate - End of the range
 * @returns {Array} Array of quiz statistics for each day in the range
 */
export const getQuizStatsForRange = (startDate, endDate) => {
  try {
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
    const stats = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (streakData[dateString]) {
        stats.push({
          date: new Date(currentDate),
          ...streakData[dateString]
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return stats;
  } catch (error) {
    console.error('Error getting quiz stats for range:', error);
    return [];
  }
};

/**
 * Get overall quiz statistics
 * @returns {Object} Overall statistics
 */
export const getOverallQuizStats = () => {
  try {
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
    const dates = Object.keys(streakData);

    let totalQuizzes = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalPoints = 0;
    const quizTypeStats = {};

    dates.forEach(dateString => {
      const dayData = streakData[dateString];
      if (dayData.quizzes) {
        dayData.quizzes.forEach(quiz => {
          totalQuizzes++;
          if (quiz.correct) {
            totalCorrect++;
          } else {
            totalIncorrect++;
          }
          totalPoints += quiz.points || 0;

          // Track by type
          if (!quizTypeStats[quiz.type]) {
            quizTypeStats[quiz.type] = {
              total: 0,
              correct: 0,
              incorrect: 0,
              points: 0
            };
          }
          quizTypeStats[quiz.type].total++;
          if (quiz.correct) {
            quizTypeStats[quiz.type].correct++;
          } else {
            quizTypeStats[quiz.type].incorrect++;
          }
          quizTypeStats[quiz.type].points += quiz.points || 0;
        });
      }
    });

    return {
      totalQuizzes,
      totalCorrect,
      totalIncorrect,
      totalPoints,
      accuracy: totalQuizzes > 0 ? Math.round((totalCorrect / totalQuizzes) * 100) : 0,
      quizTypeStats,
      activeDays: dates.length
    };
  } catch (error) {
    console.error('Error getting overall quiz stats:', error);
    return {
      totalQuizzes: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      totalPoints: 0,
      accuracy: 0,
      quizTypeStats: {},
      activeDays: 0
    };
  }
};
