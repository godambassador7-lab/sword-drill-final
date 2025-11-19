/**
 * HebrewCalendarModal Component
 *
 * Full-screen Hebrew calendar view showing monthly calendar with Hebrew dates and feast days
 * Allows users to click on feast days to see detailed information
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Star,
  Sparkles,
  Calendar as CalendarIcon
} from 'lucide-react';
import { gregorianToHebrew, formatHebrewDate, isFeastDay } from '../services/utils/hebrewCalendar';
import { getUpcomingFeastDays } from '../services/utils/hebrewCalendar';

// Feast Day Detail Modal
function FeastDayDetail({ feast, onClose }) {
  if (!feast) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl border-b border-blue-500/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-amber-300" size={24} />
                <h2 className="text-2xl font-bold text-white">{feast.englishName}</h2>
              </div>
              <p className="text-blue-100 text-lg">{feast.hebrewName}</p>
              {feast.hebrewDate && (
                <p className="text-blue-200 text-sm mt-1">{feast.hebrewDate}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="text-white" size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Themes */}
          {feast.themes && feast.themes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <Star size={18} />
                Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {feast.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-900/40 text-blue-200 rounded-full text-sm border border-blue-700/50"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Participation Summary */}
          {feast.participationSummary && (
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">How to Observe</h3>
              <p className="text-slate-300 leading-relaxed">{feast.participationSummary}</p>
            </div>
          )}

          {/* Old Testament References */}
          {feast.primaryOTRefs && feast.primaryOTRefs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Old Testament References</h3>
              <div className="space-y-1">
                {feast.primaryOTRefs.map((ref, i) => (
                  <div key={i} className="text-blue-300 text-sm font-mono bg-slate-800/50 px-3 py-1 rounded">
                    {ref}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Testament References */}
          {feast.ntRefs && feast.ntRefs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">New Testament Fulfillment</h3>
              <div className="space-y-1">
                {feast.ntRefs.map((ref, i) => (
                  <div key={i} className="text-purple-300 text-sm font-mono bg-slate-800/50 px-3 py-1 rounded">
                    {ref}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Badge */}
          {feast.category && (
            <div className="pt-4 border-t border-slate-700">
              <span className={`
                px-4 py-2 rounded-lg text-sm font-semibold inline-block
                ${feast.category === 'spring' ? 'bg-green-900/40 text-green-300 border border-green-700/50' : ''}
                ${feast.category === 'fall' ? 'bg-orange-900/40 text-orange-300 border border-orange-700/50' : ''}
                ${feast.category === 'weekly' ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50' : ''}
                ${feast.category === 'monthly' ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' : ''}
                ${feast.category === 'other' ? 'bg-slate-700/40 text-slate-300 border border-slate-600/50' : ''}
              `}>
                {feast.category.charAt(0).toUpperCase() + feast.category.slice(1)} Feast
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const HebrewCalendarModal = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFeast, setSelectedFeast] = useState(null);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ isEmpty: true, key: `empty-${i}` });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const hebrewDate = gregorianToHebrew(date);
      const feastInfo = isFeastDay(date);

      days.push({
        date,
        day,
        hebrewDay: hebrewDate.day,
        hebrewMonth: hebrewDate.monthName,
        hebrewYear: hebrewDate.year,
        feastInfo,
        isToday: isToday(date),
        isEmpty: false,
        key: `day-${day}`
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const weekDays = [
    { short: 'Sun', full: 'Sunday', hebrew: 'Yom Rishon', hebrewScript: 'יום ראשון', translation: 'First Day' },
    { short: 'Mon', full: 'Monday', hebrew: 'Yom Sheni', hebrewScript: 'יום שני', translation: 'Second Day' },
    { short: 'Tue', full: 'Tuesday', hebrew: 'Yom Shlishi', hebrewScript: 'יום שלישי', translation: 'Third Day' },
    { short: 'Wed', full: 'Wednesday', hebrew: 'Yom Revi‘i', hebrewScript: 'יום רביעי', translation: 'Fourth Day' },
    { short: 'Thu', full: 'Thursday', hebrew: 'Yom Ḥamishi', hebrewScript: 'יום חמישי', translation: 'Fifth Day' },
    { short: 'Fri', full: 'Friday', hebrew: 'Yom Shishi', hebrewScript: 'יום שישי', translation: 'Sixth Day' },
    { short: 'Sat', full: 'Saturday', hebrew: 'Shabbat', hebrewScript: 'שבת', translation: 'Sabbath' }
  ];

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hebrewMonthInfo = gregorianToHebrew(new Date(currentYear, currentMonth, 1));
  const hebrewMonthLabel = `${hebrewMonthInfo.monthName} ${hebrewMonthInfo.year}`;

  return (
    <>
      <div className="hebrew-calendar-modal fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 z-40 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg z-10 border-b-2 border-blue-500/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="text-blue-100" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">Hebrew Calendar</h1>
                <p className="text-blue-100 text-sm">Biblical Dates & Feast Days</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close Hebrew Calendar"
            >
              <X className="text-white" size={28} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Month Navigation */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="text-slate-300" size={24} />
              </button>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-amber-400" size={20} />
                  <div className="text-left">
                    <p className="text-xs text-amber-200 uppercase tracking-wide">Hebrew Month</p>
                    <h2 className="text-xl font-bold text-slate-100">{hebrewMonthLabel}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{monthName}</p>
              </div>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="text-slate-300" size={24} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-xl">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div
                  key={day.short}
                  className="text-center text-xs font-semibold text-slate-200 uppercase tracking-[0.4em] pb-1"
                >
                  {day.short}
                  <div className="text-[0.65rem] text-blue-200 font-normal tracking-normal uppercase leading-tight mt-1">
                    {day.hebrewScript}
                  </div>
                  <div className="text-[0.55rem] text-slate-400 font-normal tracking-[0.1em] mt-0.5">
                    {day.translation}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map(({ date, day, hebrewDay, hebrewMonth, feastInfo, isToday, isEmpty, key }) => {
                if (isEmpty) {
                  return <div key={key} className="aspect-square" />;
                }

                const hasFeast = !!feastInfo;

                return (
                  <div
                    key={key}
                    onClick={() => hasFeast && setSelectedFeast(feastInfo)}
                    className={`
                      relative
                      aspect-square
                      rounded-lg
                      p-2
                      flex flex-col
                      justify-between
                      transition-all
                      duration-200
                      ${isToday
                        ? 'bg-blue-900/60 border-2 border-blue-400 text-blue-100 shadow-lg shadow-blue-500/20'
                        : hasFeast
                        ? 'bg-gradient-to-br from-purple-900/60 to-blue-900/60 border-2 border-purple-500/50 text-purple-100'
                        : 'bg-slate-700/50 border border-slate-600 text-slate-300'
                      }
                      ${hasFeast ? 'hover:scale-105 hover:shadow-xl cursor-pointer hover:border-amber-400' : ''}
                    `}
                    title={hasFeast ? `${feastInfo.englishName}\nClick for details` : ''}
                  >
                    {/* Gregorian day number */}
                    <div className={`text-sm font-bold ${hasFeast ? 'text-white' : ''}`}>
                      {day}
                    </div>

                    {/* Hebrew date */}
                    <div className="text-xs text-center space-y-0.5">
                      <div className={`font-semibold ${isToday ? 'text-blue-200' : hasFeast ? 'text-purple-200' : 'text-slate-400'}`}>
                        {hebrewDay}
                      </div>
                      <div className={`text-[0.65rem] uppercase tracking-[0.2em] ${isToday ? 'text-blue-200' : hasFeast ? 'text-purple-200' : 'text-slate-500'}`}>
                        {hebrewMonth}
                      </div>
                    </div>

                    {/* Feast indicator */}
                    {hasFeast && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles
                          size={16}
                          className="text-amber-400 drop-shadow-glow animate-pulse"
                          fill="currentColor"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        {/* Legend */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Legend</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-900/60 border-2 border-blue-400 rounded"></div>
                <span className="text-slate-300">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-900/60 to-blue-900/60 border-2 border-purple-500/50 rounded"></div>
                <span className="text-slate-300">Feast Day</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-slate-300">Click feast day for details</span>
        </div>

        {/* Hebrew Days Reference */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800 rounded-lg p-4 border border-blue-500/30 shadow-inner text-sm space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Hebrew Days of the Week
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
            {weekDays.map(day => (
            <li key={day.short} className="flex flex-col">
              <span className="text-amber-200 font-semibold">{day.hebrew}</span>
              <span>{day.hebrewScript} — “{day.translation}”</span>
              <span className="text-slate-500 italic text-[0.6rem] uppercase tracking-[0.2em]">
                Equivalent to {day.full}
              </span>
            </li>
            ))}
            <li className="mt-2 text-slate-400 text-[0.65rem] col-span-full">
              Shabbat is the seventh day and the weekly covenant rest.
            </li>
          </ul>
        </div>
      </div>
          </div>
        </div>

        <style jsx>{`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.8));
          }

          @keyframes slideInFromTop {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .hebrew-calendar-modal > div:first-child {
            animation: slideInFromTop 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* Feast Day Detail Modal */}
      {selectedFeast && (
        <FeastDayDetail feast={selectedFeast} onClose={() => setSelectedFeast(null)} />
      )}
    </>
  );
};

export default HebrewCalendarModal;
