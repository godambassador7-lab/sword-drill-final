/**
 * useFeastDays Hook
 *
 * React hook for managing feast days and biblical calendar events
 */

import { useState, useEffect, useMemo } from 'react';
import {
  getUpcomingFeastDays,
  getFeastDaysForYear,
  getFeastDetails,
  isFeastDay,
  getNextRoshChodesh
} from '../services/utils/hebrewCalendar';

/**
 * Hook to get upcoming feast days
 * @param {number} daysAhead - Number of days to look ahead (default: 60)
 * @returns {Object} Upcoming feast days and related information
 */
export function useFeastDays(daysAhead = 60) {
  const [upcomingFeasts, setUpcomingFeasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeasts = () => {
      try {
        setIsLoading(true);
        const feasts = getUpcomingFeastDays(daysAhead);
        setUpcomingFeasts(feasts);
      } catch (error) {
        console.error('Error loading feast days:', error);
        setUpcomingFeasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeasts();

    // Refresh at midnight each day
    const updateAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      return setTimeout(() => {
        loadFeasts();
        updateAtMidnight();
      }, msUntilMidnight);
    };

    const timer = updateAtMidnight();
    return () => clearTimeout(timer);
  }, [daysAhead]);

  const todaysFeast = useMemo(() => {
    return upcomingFeasts.find(feast => feast.isToday);
  }, [upcomingFeasts]);

  const nextFeast = useMemo(() => {
    return upcomingFeasts.find(feast => !feast.isToday);
  }, [upcomingFeasts]);

  const majorFeasts = useMemo(() => {
    return upcomingFeasts.filter(feast =>
      feast.category === 'spring' || feast.category === 'fall'
    );
  }, [upcomingFeasts]);

  return {
    upcomingFeasts,
    todaysFeast,
    nextFeast,
    majorFeasts,
    isLoading
  };
}

/**
 * Hook to get all feast days for a specific year
 * @param {number} year - Gregorian year (defaults to current year)
 * @returns {Object} All feast days for the year
 */
export function useFeastDaysForYear(year = new Date().getFullYear()) {
  const [feastDays, setFeastDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      const feasts = getFeastDaysForYear(year);
      setFeastDays(feasts);
    } catch (error) {
      console.error('Error loading feast days for year:', error);
      setFeastDays([]);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  const byCategory = useMemo(() => {
    return feastDays.reduce((acc, feast) => {
      const category = feast.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(feast);
      return acc;
    }, {});
  }, [feastDays]);

  const springFeasts = byCategory.spring || [];
  const fallFeasts = byCategory.fall || [];
  const monthlyFeasts = byCategory.monthly || [];

  return {
    feastDays,
    byCategory,
    springFeasts,
    fallFeasts,
    monthlyFeasts,
    isLoading
  };
}

/**
 * Hook to check if today is a feast day
 * @returns {Object} Today's feast information
 */
export function useTodaysFeast() {
  const [todaysFeast, setTodaysFeast] = useState(null);

  useEffect(() => {
    const checkFeast = () => {
      const feast = isFeastDay(new Date());
      setTodaysFeast(feast);
    };

    checkFeast();

    // Check again at midnight
    const updateAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      return setTimeout(() => {
        checkFeast();
        updateAtMidnight();
      }, msUntilMidnight);
    };

    const timer = updateAtMidnight();
    return () => clearTimeout(timer);
  }, []);

  return todaysFeast;
}

/**
 * Hook to get next Rosh Chodesh (New Moon)
 * @returns {Object} Next Rosh Chodesh information
 */
export function useNextRoshChodesh() {
  const [nextRoshChodesh, setNextRoshChodesh] = useState(null);

  useEffect(() => {
    const loadRoshChodesh = () => {
      const next = getNextRoshChodesh();
      setNextRoshChodesh(next);
    };

    loadRoshChodesh();

    // Refresh daily
    const updateDaily = setInterval(loadRoshChodesh, 24 * 60 * 60 * 1000);
    return () => clearInterval(updateDaily);
  }, []);

  return nextRoshChodesh;
}
