/**
 * MonthlyCalendar Component
 *
 * Displays a monthly calendar grid with activity tracking
 * Shows flame icons for days with completed quizzes
 */

import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';

const MonthlyCalendar = ({ year, month, activityData, getActivityForDay }) => {
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
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ isEmpty: true, key: `empty-${i}` });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const activity = getActivityForDay(date);

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
  }, [year, month, getActivityForDay]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="monthly-calendar">
      {/* Week day headers */}
      <div className="calendar-header grid grid-cols-7 gap-2 mb-3">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid grid grid-cols-7 gap-2">
        {calendarDays.map(({ date, day, activity, isToday, isEmpty, key }) => {
          if (isEmpty) {
            return <div key={key} className="calendar-day-empty" />;
          }

          const hasActivity = !!activity;
          const quizCount = activity?.count || 0;

          return (
            <div
              key={key}
              className={`
                calendar-day
                relative
                aspect-square
                rounded-lg
                flex flex-col
                items-center
                justify-center
                transition-all
                duration-200
                ${isToday
                  ? 'bg-blue-900/40 border-2 border-blue-500 text-blue-100'
                  : 'bg-slate-700 border border-slate-600 text-slate-300'
                }
                ${hasActivity ? 'ring-2 ring-amber-500/30' : ''}
                hover:scale-105
                hover:shadow-lg
                cursor-pointer
                group
              `}
              title={
                hasActivity
                  ? `${quizCount} quiz${quizCount > 1 ? 'zes' : ''} completed\n${activity.points} points earned`
                  : 'No activity'
              }
            >
              {/* Day number */}
              <div className={`text-sm font-bold ${hasActivity ? 'text-white' : ''}`}>
                {day}
              </div>

              {/* Flame icon(s) for activity */}
              {hasActivity && (
                <div className="absolute -top-1 -right-1 flex gap-0.5">
                  {[...Array(Math.min(quizCount, 3))].map((_, i) => (
                    <Flame
                      key={i}
                      size={12}
                      className="text-orange-500 drop-shadow-glow"
                      fill="currentColor"
                    />
                  ))}
                  {quizCount > 3 && (
                    <span className="text-xs font-bold text-orange-500">+</span>
                  )}
                </div>
              )}

              {/* Hover tooltip */}
              {hasActivity && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700 whitespace-nowrap">
                    <div className="font-bold">{quizCount} quiz{quizCount > 1 ? 'zes' : ''}</div>
                    <div className="text-amber-400">{activity.points} points</div>
                    {activity.categories && (
                      <div className="mt-1 text-slate-400">
                        {Object.entries(activity.categories)
                          .map(([cat, count]) => `${cat}: ${count}`)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 2px rgba(249, 115, 22, 0.6));
        }

        .calendar-day:hover {
          transform: scale(1.05);
        }

        @media (max-width: 640px) {
          .calendar-day {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MonthlyCalendar;
