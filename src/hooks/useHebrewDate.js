/**
 * useHebrewDate Hook
 *
 * React hook for managing Hebrew date state and conversions
 */

import { useState, useEffect, useMemo } from 'react';
import { gregorianToHebrew, formatHebrewDate, isFeastDay, isShabbat } from '../services/utils/hebrewCalendar';

/**
 * Hook to get current Hebrew date that updates daily
 * @param {Date} date - Optional date to convert (defaults to current date)
 * @returns {Object} Hebrew date information
 */
export function useHebrewDate(date = null) {
  const [currentDate, setCurrentDate] = useState(date || new Date());

  useEffect(() => {
    if (date) {
      setCurrentDate(date);
      return;
    }

    // Update at midnight each day
    const updateAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const timer = setTimeout(() => {
        setCurrentDate(new Date());
        updateAtMidnight(); // Schedule next update
      }, msUntilMidnight);

      return timer;
    };

    const timer = updateAtMidnight();
    return () => clearTimeout(timer);
  }, [date]);

  const hebrewDate = useMemo(() => {
    const hebrew = gregorianToHebrew(currentDate);
    const formatted = formatHebrewDate(currentDate);
    const feastInfo = isFeastDay(currentDate);
    const isShabbatToday = isShabbat(currentDate);

    return {
      ...hebrew,
      formatted,
      gregorianDate: currentDate,
      isFeast: !!feastInfo,
      feastInfo,
      isShabbat: isShabbatToday
    };
  }, [currentDate]);

  return hebrewDate;
}

/**
 * Hook to track Hebrew calendar preference
 * @param {string} userId - User ID for Firebase persistence
 * @returns {Object} Hebrew calendar preference state and setter
 */
export function useHebrewCalendarPreference(userId) {
  const [showHebrewCalendar, setShowHebrewCalendar] = useState(
    () => {
      // Load from localStorage initially
      // Use a consistent key that works with or without userId
      const storageKey = userId ? `hebrewCalendar_${userId}` : 'hebrewCalendar_default';
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : true; // Default to true (show Hebrew calendar)
    }
  );

  useEffect(() => {
    // Save to localStorage whenever it changes
    const storageKey = userId ? `hebrewCalendar_${userId}` : 'hebrewCalendar_default';
    localStorage.setItem(storageKey, JSON.stringify(showHebrewCalendar));
  }, [showHebrewCalendar, userId]);

  return {
    showHebrewCalendar,
    setShowHebrewCalendar,
    toggleHebrewCalendar: () => setShowHebrewCalendar(prev => !prev)
  };
}
