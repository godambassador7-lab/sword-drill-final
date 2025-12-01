/**
 * DualCalendarDisplay Component
 *
 * Displays both Roman (Gregorian) and Hebrew calendar dates side by side
 * Tapping the Roman date opens the Activity Dashboard
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useHebrewDate } from '../hooks/useHebrewDate';
import { useTodaysFeast } from '../hooks/useFeastDays';

const DualCalendarDisplay = ({
  showHebrewCalendar = true,
  onRomanDateClick,
  onHebrewDateClick,
  className = ''
}) => {
  const hebrewDate = useHebrewDate();
  const todaysFeast = useTodaysFeast();

  const romanDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`dual-calendar-display ${className}`}>
      {/* Roman Calendar Date - Clickable */}
      <button
        onClick={onRomanDateClick}
        className="roman-date-button group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 border border-slate-700 hover:border-amber-500 cursor-pointer flex-1 min-w-0"
        title="View Activity Dashboard"
      >
        <Sun className="text-amber-500 group-hover:text-amber-400 transition-colors" size={20} />
        <div className="text-left">
          <div className="text-xs text-slate-400 uppercase tracking-wide">Gregorian Calendar</div>
          <div className="text-sm font-semibold text-slate-100">{romanDate}</div>
        </div>
      </button>

      {/* Hebrew Calendar Date - Clickable */}
      {showHebrewCalendar && (
        <button
          onClick={onHebrewDateClick}
          className="hebrew-date-button group flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-900/40 to-purple-900/40 hover:from-blue-800/50 hover:to-purple-800/50 rounded-lg border border-blue-700/50 hover:border-purple-500 transition-all duration-200 cursor-pointer flex-1 min-w-0"
          title="View Hebrew Calendar"
        >
          <Moon className="text-blue-400 group-hover:text-blue-300 transition-colors" size={20} />
          <div className="text-left">
            <div className="text-xs text-blue-300 uppercase tracking-wide">Hebrew Calendar</div>
            <div className="text-sm font-semibold text-blue-100">{hebrewDate.formatted}</div>

            {/* Show if today is Shabbat */}
            {hebrewDate.isShabbat && (
              <div className="text-xs text-blue-200 mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                Shabbat Shalom
              </div>
            )}

            {/* Show if today is a feast day */}
            {todaysFeast && (
              <div className="text-xs text-amber-300 mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                {todaysFeast.name}
              </div>
            )}
          </div>
        </button>
      )}

      <style jsx>{`
        .dual-calendar-display {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .dual-calendar-display {
            flex-direction: row;
          }
        }

        .roman-date-button {
          position: relative;
          overflow: hidden;
        }

        .roman-date-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .roman-date-button:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default DualCalendarDisplay;
