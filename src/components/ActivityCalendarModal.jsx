/**
 * ActivityCalendarModal Component
 *
 * Full-screen activity calendar view showing quiz activity and streaks
 * Matches the design of HebrewCalendarModal with activity tracking features
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';
import DayDetailModal from './DayDetailModal';

const ActivityCalendarModal = ({ onClose, userData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
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

  // Get activity data from localStorage
  const getActivityForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
    return streakData[dateString] || { marked: false, quizCount: 0 };
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
      const activity = getActivityForDate(date);

      days.push({
        date,
        day,
        activity,
        isToday: isToday(date),
        isEmpty: false,
        key: `day-${day}`
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate streak stats
  const todayActivity = getActivityForDate(new Date());

  return (
    <div className="activity-calendar-modal fixed inset-0 bg-gradient-to-br from-slate-900 via-amber-900/20 to-orange-900/20 z-40 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg z-10 border-b-2 border-amber-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="text-amber-100" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Activity Calendar</h1>
              <p className="text-amber-100 text-sm">Track Your Quiz Streaks & Progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close Activity Calendar"
          >
            <X className="text-white" size={28} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Today's Activity Status */}
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-lg p-6 border border-amber-700/50">
          <div className="flex items-center gap-4">
            {todayActivity.marked ? (
              <>
                <CheckCircle2 className="text-green-400" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-green-300 mb-1">Today's Activity Completed!</h3>
                  <p className="text-slate-300 text-sm">
                    Quizzes completed today: {todayActivity.quizCount}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Flame className="text-amber-400" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-amber-300 mb-1">No Activity Today</h3>
                  <p className="text-slate-300 text-sm">
                    Complete a quiz correctly to mark today's activity automatically
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

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
                <h2 className="text-xl font-bold text-slate-100">{monthName}</h2>
              </div>
              <p className="text-sm text-slate-400">Current Streak: {userData?.currentStreak || 0} days</p>
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
                key={day}
                className="text-center text-xs font-semibold text-slate-200 uppercase tracking-[0.4em] pb-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(({ date, day, activity, isToday, isEmpty, key }) => {
              if (isEmpty) {
                return <div key={key} className="aspect-square" />;
              }

              const hasActivity = activity?.marked;
              const quizCount = activity?.quizCount || 0;

              return (
                <button
                  key={key}
                  onClick={() => hasActivity && setSelectedDate(date)}
                  disabled={!hasActivity}
                  className={`
                    relative
                    aspect-square
                    rounded-lg
                    p-2
                    flex flex-col
                    justify-between
                    items-center
                    transition-all
                    duration-200
                    ${hasActivity ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-default'}
                    ${isToday
                      ? 'bg-amber-900/60 border-2 border-amber-400 text-amber-100 shadow-lg shadow-amber-500/20'
                      : hasActivity
                      ? 'bg-gradient-to-br from-orange-900/60 to-amber-900/60 border-2 border-orange-500/50 text-orange-100 hover:from-orange-800/70 hover:to-amber-800/70'
                      : 'bg-slate-700/50 border border-slate-600 text-slate-300'
                    }
                  `}
                >
                  {/* Day number */}
                  <div className={`text-sm font-bold ${hasActivity ? 'text-white' : ''}`}>
                    {day}
                  </div>

                  {/* Activity indicator */}
                  {hasActivity && (
                    <div className="flex flex-col items-center gap-1">
                      <Flame className="text-orange-400" size={20} />
                      {quizCount > 0 && (
                        <span className="text-xs font-bold text-orange-200">
                          {quizCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-900/60 border-2 border-amber-400 rounded"></div>
              <span className="text-sm text-slate-300">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-900/60 to-amber-900/60 border-2 border-orange-500/50 rounded flex items-center justify-center">
                <Flame className="text-orange-400" size={12} />
              </div>
              <span className="text-sm text-slate-300">Activity Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-700/50 border border-slate-600 rounded"></div>
              <span className="text-sm text-slate-300">No Activity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default ActivityCalendarModal;
