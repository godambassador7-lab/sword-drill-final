/**
 * useUserActivityData Hook
 *
 * React hook for managing user quiz activity data for the calendar dashboard
 */

import { useState, useEffect, useMemo } from 'react';

const localDateKey = (date) => {
  if (!date) return '';
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
};

/**
 * Hook to get user activity data for calendar display
 * @param {string} userId - User ID
 * @param {number} year - Year to fetch data for
 * @param {number} month - Month to fetch data for (0-11)
 * @param {Array} quizHistory - User's quiz history array from userData
 * @returns {Object} Activity data and statistics
 */
export function useUserActivityData(userId, year = null, month = null, quizHistory = []) {
  const [activityData, setActivityData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = year ?? new Date().getFullYear();
  const currentMonth = month ?? new Date().getMonth();

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchActivityData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Calculate date range for the month
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        // Use local quiz history instead of Firestore query
        const dayActivity = {};

        (quizHistory || []).forEach((quiz) => {
          // Get the date from timestamp
          const timestamp = quiz.timestamp || quiz.ts || 0;
          const dateRaw = new Date(timestamp);
          if (isNaN(dateRaw)) return;
          const date = new Date(dateRaw.getFullYear(), dateRaw.getMonth(), dateRaw.getDate()); // midnight local

          // Check if this quiz is within the month range
          if (date >= startDate && date <= endDate) {
            const dayKey = localDateKey(date);

            if (!dayActivity[dayKey]) {
              dayActivity[dayKey] = {
                date,
                count: 0,
                quizzes: [],
                categories: {},
                points: 0
              };
            }

            dayActivity[dayKey].count++;
            dayActivity[dayKey].quizzes.push(quiz);
            dayActivity[dayKey].points += quiz.pointsEarned || quiz.points || 0;

            // Track by category
            const category = quiz.category || quiz.type || quiz.quizType || 'Quiz';
            dayActivity[dayKey].categories[category] = (dayActivity[dayKey].categories[category] || 0) + 1;
          }
        });

        setActivityData(dayActivity);
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, [userId, currentYear, currentMonth, quizHistory]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const days = Object.values(activityData);

    if (days.length === 0) {
      return {
        totalQuizzes: 0,
        totalPoints: 0,
        activeDays: 0,
        averageQuizzesPerDay: 0,
        mostActiveDay: null,
        categoryBreakdown: {},
        currentStreak: 0,
        bestStreak: 0
      };
    }

    // Total quizzes and points
    const totalQuizzes = days.reduce((sum, day) => sum + day.count, 0);
    const totalPoints = days.reduce((sum, day) => sum + day.points, 0);
    const activeDays = days.length;
    const averageQuizzesPerDay = totalQuizzes / activeDays;

    // Most active day
    const mostActiveDay = days.reduce((max, day) =>
      day.count > (max?.count || 0) ? day : max
    , null);

    // Category breakdown
    const categoryBreakdown = {};
    days.forEach(day => {
      Object.entries(day.categories).forEach(([category, count]) => {
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + count;
      });
    });

    // Calculate streaks
    const sortedDays = days.sort((a, b) => a.date - b.date);
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDays.length; i++) {
      if (i > 0) {
        const prevDate = sortedDays[i - 1].date;
        const currDate = sortedDays[i].date;
        const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      // Check if this day is part of current streak
      const lastDate = sortedDays[sortedDays.length - 1].date;
      const daysSinceLastQuiz = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (daysSinceLastQuiz <= 1) {
        currentStreak = tempStreak;
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak);

    return {
      totalQuizzes,
      totalPoints,
      activeDays,
      averageQuizzesPerDay: Math.round(averageQuizzesPerDay * 10) / 10,
      mostActiveDay,
      categoryBreakdown,
      currentStreak,
      bestStreak
    };
  }, [activityData]);

  /**
   * Get activity for a specific day
   * @param {Date} date - Date to get activity for
   * @returns {Object|null} Activity data for that day
   */
  const getActivityForDay = (date) => {
    const dayKey = localDateKey(date);
    return activityData[dayKey] || null;
  };

  /**
   * Check if a day has activity
   * @param {Date} date - Date to check
   * @returns {boolean} True if there's activity on that day
   */
  const hasActivityOnDay = (date) => {
    return !!getActivityForDay(date);
  };

  return {
    activityData,
    statistics,
    isLoading,
    error,
    getActivityForDay,
    hasActivityOnDay
  };
}

/**
 * Hook to get user activity data for multiple months
 * @param {string} userId - User ID
 * @param {number} monthsToLoad - Number of months to load (default: 3)
 * @returns {Object} Activity data across multiple months
 */
export function useUserActivityDataMultiMonth(userId, monthsToLoad = 3) {
  const [allData, setAllData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchMultiMonthData = async () => {
      try {
        setIsLoading(true);

        const today = new Date();
        const promises = [];

        // Load current month and previous months
        for (let i = 0; i < monthsToLoad; i++) {
          const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const year = targetDate.getFullYear();
          const month = targetDate.getMonth();

          promises.push({ year, month });
        }

        // This would ideally use the useUserActivityData hook's logic
        // For now, we'll just mark as loaded
        setAllData({});
      } catch (err) {
        console.error('Error fetching multi-month data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMultiMonthData();
  }, [userId, monthsToLoad]);

  return {
    allData,
    isLoading
  };
}
