/**
 * Hebrew Calendar Utility Functions
 *
 * Provides Hebrew ↔ Roman calendar conversion and feast day calculations
 * Uses @hebcal/core for accurate Hebrew date calculations
 */

import { HDate, HebrewCalendar, Location, Event, flags } from '@hebcal/core';
import feastsData from '../../data/biblical-feast-days-repo/data/feasts.json';

/**
 * Convert Gregorian date to Hebrew date
 * @param {Date} gregorianDate - The Gregorian date to convert
 * @returns {Object} Hebrew date information
 */
export function gregorianToHebrew(gregorianDate = new Date()) {
  const hd = new HDate(gregorianDate);

  const monthName = hd.getMonthName();
  return {
    year: hd.getFullYear(),
    month: hd.getMonth(),
    monthName,
    day: hd.getDate(),
    formatted: hd.toString(),
    dayOfWeek: hd.greg().toLocaleDateString('en-US', { weekday: 'long' })
  };
}

/**
 * Convert Hebrew date to Gregorian
 * @param {number} hebrewYear - Hebrew year
 * @param {string|number} hebrewMonth - Hebrew month (name or number)
 * @param {number} hebrewDay - Hebrew day
 * @returns {Date} Gregorian date
 */
export function hebrewToGregorian(hebrewYear, hebrewMonth, hebrewDay) {
  const hd = new HDate(hebrewDay, hebrewMonth, hebrewYear);
  return hd.greg();
}

/**
 * Get all feast days and holidays for a given year
 * @param {number} gregorianYear - The Gregorian year
 * @returns {Array} Array of feast day events
 */
export function getFeastDaysForYear(gregorianYear = new Date().getFullYear()) {
  const options = {
    year: gregorianYear,
    isHebrewYear: false,
    candlelighting: false,
    sedrot: false,
    omer: false,
  };

  const events = HebrewCalendar.calendar(options);

  // Filter for major feasts and holidays
  const feastEvents = events.filter(ev => {
    const desc = ev.getDesc();
    const flags = ev.getFlags();

    // Include major holidays and feasts
    return (
      flags & (
    flags.MAJOR_FAST |
    flags.MINOR_FAST |
    flags.ROSH_CHODESH |
    flags.MAJOR_HOLIDAY |
    flags.MINOR_HOLIDAY |
    flags.MODERN_HOLIDAY
      )
    );
  });

  return feastEvents.map(ev => ({
    name: ev.getDesc(),
    hebrewDate: ev.getDate().toString(),
    gregorianDate: ev.getDate().greg(),
    category: getFeastCategory(ev.getDesc()),
    details: getFeastDetails(ev.getDesc())
  }));
}

/**
 * Get upcoming feast days within the next N days
 * @param {number} daysAhead - Number of days to look ahead (default: 60)
 * @returns {Array} Array of upcoming feast days
 */
export function getUpcomingFeastDays(daysAhead = 60) {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + daysAhead);

  const currentYear = today.getFullYear();
  const endYear = endDate.getFullYear();

  let allFeasts = getFeastDaysForYear(currentYear);

  // If date range spans into next year, include next year's feasts
  if (endYear > currentYear) {
    allFeasts = [...allFeasts, ...getFeastDaysForYear(endYear)];
  }

  // Filter feasts within date range and add days until
  const upcomingFeasts = allFeasts
    .filter(feast => {
      const feastDate = new Date(feast.gregorianDate);
      return feastDate >= today && feastDate <= endDate;
    })
    .map(feast => {
      const feastDate = new Date(feast.gregorianDate);
      const daysUntil = Math.ceil((feastDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...feast,
        daysUntil,
        isToday: daysUntil === 0
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return upcomingFeasts;
}

/**
 * Get feast category from our custom feast data
 * @param {string} feastName - Name of the feast
 * @returns {string} Category of the feast
 */
function getFeastCategory(feastName) {
  const normalizedName = feastName.toLowerCase();

  // Map hebcal feast names to our categories
  if (normalizedName.includes('passover') || normalizedName.includes('pesach')) {
    return 'spring';
  }
  if (normalizedName.includes('unleavened')) {
    return 'spring';
  }
  if (normalizedName.includes('shavuot') || normalizedName.includes('pentecost')) {
    return 'spring';
  }
  if (normalizedName.includes('rosh hashana') || normalizedName.includes('trumpets')) {
    return 'fall';
  }
  if (normalizedName.includes('yom kippur') || normalizedName.includes('atonement')) {
    return 'fall';
  }
  if (normalizedName.includes('sukkot') || normalizedName.includes('tabernacles')) {
    return 'fall';
  }
  if (normalizedName.includes('purim')) {
    return 'post-exilic';
  }
  if (normalizedName.includes('chanukah') || normalizedName.includes('hanukkah')) {
    return 'second-temple';
  }
  if (normalizedName.includes('rosh chodesh')) {
    return 'monthly';
  }
  if (normalizedName.includes('shabbat') || normalizedName.includes('sabbath')) {
    return 'weekly';
  }

  return 'other';
}

/**
 * Get detailed information about a feast from our custom data
 * @param {string} feastName - Name of the feast
 * @returns {Object|null} Detailed feast information
 */
export function getFeastDetails(feastName) {
  const normalizedName = feastName.toLowerCase();

  // Find matching feast in our data
  const feast = feastsData.find(f => {
    const englishMatch = f.englishName.toLowerCase().includes(normalizedName) ||
                        normalizedName.includes(f.englishName.toLowerCase());
    const hebrewMatch = f.hebrewName && (
      f.hebrewName.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(f.hebrewName.toLowerCase())
    );
    return englishMatch || hebrewMatch;
  });

  if (!feast) return null;

  return {
    id: feast.id,
    englishName: feast.englishName,
    hebrewName: feast.hebrewName,
    category: feast.category,
    type: feast.type,
    themes: feast.themes,
    primaryRefs: feast.primaryOTRefs,
    ntRefs: feast.ntRefs,
    tooltip: feast.participationSummary,
    description: `Biblical ${feast.type.includes('pilgrimage') ? 'pilgrimage ' : ''}feast. ${feast.participationSummary}`
  };
}

/**
 * Check if a given date is a feast day
 * @param {Date} date - Date to check
 * @returns {Object|null} Feast information if it's a feast day, null otherwise
 */
export function isFeastDay(date = new Date()) {
  const hd = new HDate(date);
  const events = HebrewCalendar.calendar({
    start: date,
    end: date,
    candlelighting: false
  });

  const feastEvent = events.find(ev => {
    const flags = ev.getFlags();
    return flags & (
    flags.MAJOR_FAST |
    flags.MINOR_FAST |
    flags.ROSH_CHODESH |
    flags.MAJOR_HOLIDAY |
    flags.MINOR_HOLIDAY
    );
  });

  if (!feastEvent) return null;

  return {
    name: feastEvent.getDesc(),
    hebrewDate: hd.toString(),
    details: getFeastDetails(feastEvent.getDesc())
  };
}

/**
 * Get the current Hebrew month and year
 * @returns {Object} Current Hebrew month and year
 */
export function getCurrentHebrewMonth() {
  const hd = new HDate();
  return {
    month: hd.getMonthName(),
    monthNum: hd.getMonth(),
    year: hd.getFullYear(),
    isLeapYear: hd.isLeapYear()
  };
}

/**
 * Check if today is Shabbat (Sabbath)
 * @param {Date} date - Date to check (defaults to today)
 * @returns {boolean} True if it's Shabbat
 */
export function isShabbat(date = new Date()) {
  // Shabbat is from Friday evening to Saturday evening
  // For simplicity, we check if it's Saturday
  return date.getDay() === 6;
}

/**
 * Get next Rosh Chodesh (New Moon)
 * @returns {Object} Next Rosh Chodesh information
 */
export function getNextRoshChodesh() {
  const today = new Date();
  const feasts = getFeastDaysForYear(today.getFullYear());

  const nextRoshChodesh = feasts.find(feast => {
    const feastDate = new Date(feast.gregorianDate);
    return feastDate > today && feast.name.toLowerCase().includes('rosh chodesh');
  });

  return nextRoshChodesh;
}

/**
 * Format Hebrew date for display
 * @param {Date} gregorianDate - Gregorian date to format
 * @returns {string} Formatted Hebrew date string
 */
export function formatHebrewDate(gregorianDate = new Date()) {
  const hd = new HDate(gregorianDate);
  const day = hd.getDate();
  const month = hd.getMonthName();
  const year = hd.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Get all Shabbat dates for a given month
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month (0-11)
 * @returns {Array} Array of Shabbat dates
 */
export function getShabbatDatesForMonth(year, month) {
  const shabbatDates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (isShabbat(date)) {
      shabbatDates.push(date);
    }
  }

  return shabbatDates;
}
