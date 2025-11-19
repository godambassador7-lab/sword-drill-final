/**
 * ActivityDashboard Component
 *
 * Full-screen activity dashboard showing monthly calendar with quiz completion tracking
 * Includes streak visualization and statistics
 */

import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useUserActivityData } from '../hooks/useUserActivityData';
import MonthlyCalendar from './MonthlyCalendar';

/** Custom Multi-Layer Candle Flame Component */
function CandleFlame({ delay = 0, streak = 1, size = 'normal' }) {
  // Determine colors based on streak milestones
  let outerColor, middleColor, innerColor;

  if (streak >= 50) {
    // Purple flame (50+ days)
    outerColor = "#7c3aed"; // violet-600
    middleColor = "#a78bfa"; // violet-400
    innerColor = "#c4b5fd"; // violet-300
  } else if (streak >= 40) {
    // Blue flame (40-49 days)
    outerColor = "#2563eb"; // blue-600
    middleColor = "#60a5fa"; // blue-400
    innerColor = "#93c5fd"; // blue-300
  } else if (streak >= 30) {
    // Green flame (30-39 days)
    outerColor = "#059669"; // emerald-600
    middleColor = "#34d399"; // emerald-400
    innerColor = "#6ee7b7"; // emerald-300
  } else if (streak >= 20) {
    // Yellow flame (20-29 days)
    outerColor = "#d97706"; // amber-600
    middleColor = "#fbbf24"; // amber-400
    innerColor = "#fde047"; // yellow-300
  } else if (streak >= 10) {
    // Orange flame (10-19 days)
    outerColor = "#ea580c"; // orange-600
    middleColor = "#fb923c"; // orange-400
    innerColor = "#fdba74"; // orange-300
  } else {
    // Red/Orange flame (1-9 days) - default
    outerColor = "#dc2626"; // red-600
    middleColor = "#f97316"; // orange-500
    innerColor = "#fbbf24"; // amber-400
  }

  const scale = size === 'large' ? 2 : 1;
  const width = 24 * scale;
  const height = 32 * scale;

  return (
    <div className="relative inline-block" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Outer layer */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 animate-flame-outer"
        style={{ animationDelay: `${delay}s` }}
      >
        <path
          d="M12 2C10 5 8 8 8 12C8 13.5 8.5 15 9.5 16.5C8 15.5 6.5 13.5 6.5 11C4 14 3 18 3 22C3 27.5 7 32 12 32C17 32 21 27.5 21 22C21 17 19 13 16.5 10C17 13 16.5 16 14.5 18C15 15 14 11 12 2Z"
          fill={outerColor}
          opacity="0.9"
        />
      </svg>

      {/* Middle layer */}
      <svg
        width={20 * scale}
        height={28 * scale}
        viewBox="0 0 20 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute animate-flame-middle"
        style={{ left: `${2 * scale}px`, top: `${2 * scale}px`, animationDelay: `${delay + 0.1}s` }}
      >
        <path
          d="M10 1C8.5 3.5 7 6 7 9C7 10.5 7.5 11.5 8 12.5C7 12 6 10.5 6 9C4 11.5 3 14 3 17.5C3 22 6.5 26 10 26C13.5 26 17 22 17 17.5C17 13.5 15.5 10.5 13.5 8C14 10.5 13.5 12.5 12 14C12.5 11.5 11.5 8 10 1Z"
          fill={middleColor}
          opacity="0.85"
        />
      </svg>

      {/* Inner layer */}
      <svg
        width={14 * scale}
        height={22 * scale}
        viewBox="0 0 14 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute animate-flame-inner"
        style={{ left: `${5 * scale}px`, top: `${6 * scale}px`, animationDelay: `${delay + 0.2}s` }}
      >
        <path
          d="M7 1C6 2.5 5 4.5 5 6.5C5 7.5 5.5 8.5 6 9C5.5 8.5 5 7.5 5 6.5C3.5 8.5 3 10.5 3 13C3 16.866 5.134 20 7 20C8.866 20 12 16.866 12 13C12 10 11 8 9.5 6.5C10 8 9.5 9.5 8.5 10.5C9 8.5 8 5.5 7 1Z"
          fill={innerColor}
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

const ActivityDashboard = ({ userId, onClose, currentStreak = 0, quizHistory = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const { activityData, statistics, isLoading, getActivityForDay } = useUserActivityData(
    userId,
    currentYear,
    currentMonth,
    quizHistory
  );

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

  // Navigate to current month
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Check if we're viewing the current month
  const isCurrentMonth = currentYear === new Date().getFullYear() &&
                         currentMonth === new Date().getMonth();

  return (
    <div className="activity-dashboard fixed inset-0 z-50 bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={28} />
              <div>
                <h1 className="text-2xl font-bold">Activity Dashboard</h1>
                <p className="text-sm text-amber-100">Track your Sword Drill journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Close Dashboard"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Streak Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-center gap-4">
            <CandleFlame delay={0} streak={currentStreak} size="large" />
            <div className="text-center">
              <div className="text-5xl font-bold">{currentStreak}</div>
              <div className="text-lg font-medium">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Monthly Quizzes */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Target size={20} />
                <span className="text-xs font-semibold uppercase tracking-wide">Monthly Quizzes</span>
              </div>
              <div className="text-3xl font-bold text-white">{statistics.totalQuizzes}</div>
            </div>

            {/* Best Streak This Month */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <Flame size={20} />
                <span className="text-xs font-semibold uppercase tracking-wide">Best Streak</span>
              </div>
              <div className="text-3xl font-bold text-white">{statistics.bestStreak}</div>
            </div>

            {/* Current Streak */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <TrendingUp size={20} />
                <span className="text-xs font-semibold uppercase tracking-wide">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-white">{statistics.currentStreak}</div>
            </div>

            {/* Total Points */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Trophy size={20} />
                <span className="text-xs font-semibold uppercase tracking-wide">Points Earned</span>
              </div>
              <div className="text-3xl font-bold text-white">{statistics.totalPoints}</div>
            </div>
          </div>
        )}

        {/* Most Active Day */}
        {statistics.mostActiveDay && (
          <div className="bg-slate-800 rounded-lg p-4 border border-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 uppercase tracking-wide font-semibold mb-1">
                  Most Active Day
                </div>
                <div className="text-xl font-bold text-white">
                  {statistics.mostActiveDay.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-400">
                  {statistics.mostActiveDay.count}
                </div>
                <div className="text-xs text-slate-400">quizzes</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {Object.keys(statistics.categoryBreakdown).length > 0 && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3">Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(statistics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="bg-slate-700 rounded p-3">
                  <div className="text-sm text-slate-300">{category}</div>
                  <div className="text-2xl font-bold text-amber-400">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Calendar */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={24} className="text-slate-300" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{monthName}</h2>
              {!isCurrentMonth && (
                <button
                  onClick={goToCurrentMonth}
                  className="text-xs text-amber-400 hover:text-amber-300 mt-1"
                >
                  Back to Current Month
                </button>
              )}
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              title="Next Month"
            >
              <ChevronRight size={24} className="text-slate-300" />
            </button>
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
              <p className="text-slate-400 mt-4">Loading activity...</p>
            </div>
          ) : (
            <MonthlyCalendar
              year={currentYear}
              month={currentMonth}
              activityData={activityData}
              getActivityForDay={getActivityForDay}
            />
          )}
        </div>

        {/* Legend */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-slate-400">
                15
              </div>
              <span className="text-slate-400">No activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-white relative">
                15
                <Flame size={12} className="absolute -top-1 -right-1 text-orange-500" />
              </div>
              <span className="text-slate-400">Quiz completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900/40 border border-blue-700 rounded flex items-center justify-center text-blue-300">
                15
              </div>
              <span className="text-slate-400">Today</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .activity-dashboard {
          font-family: system-ui, -apple-system, sans-serif;
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

        .activity-dashboard > div:first-child {
          animation: slideInFromTop 0.3s ease-out;
        }

        /* Flame animations */
        @keyframes flame-outer {
          0%, 100% {
            transform: translateY(0) scaleY(1) scaleX(1) skewX(0deg);
          }
          25% {
            transform: translateY(-2px) scaleY(1.05) scaleX(0.97) skewX(-1.5deg);
          }
          50% {
            transform: translateY(-1px) scaleY(0.96) scaleX(1.03) skewX(2deg);
          }
          75% {
            transform: translateY(-1.5px) scaleY(1.02) scaleX(0.98) skewX(-1deg);
          }
        }

        @keyframes flame-middle {
          0%, 100% {
            transform: translateY(0) scaleY(1) scaleX(1) skewX(0deg);
          }
          20% {
            transform: translateY(-2px) scaleY(1.06) scaleX(0.95) skewX(2deg);
          }
          40% {
            transform: translateY(-3px) scaleY(0.94) scaleX(1.05) skewX(-2deg);
          }
          60% {
            transform: translateY(-1px) scaleY(1.04) scaleX(0.97) skewX(2.5deg);
          }
          80% {
            transform: translateY(-2px) scaleY(0.97) scaleX(1.02) skewX(-1.5deg);
          }
        }

        @keyframes flame-inner {
          0%, 100% {
            transform: translateY(0) scaleY(1) scaleX(1) skewX(0deg);
          }
          20% {
            transform: translateY(-3px) scaleY(1.08) scaleX(0.93) skewX(-2.5deg);
          }
          40% {
            transform: translateY(-1px) scaleY(0.92) scaleX(1.06) skewX(3deg);
          }
          60% {
            transform: translateY(-2.5px) scaleY(1.05) scaleX(0.95) skewX(-2deg);
          }
          80% {
            transform: translateY(-1.5px) scaleY(0.96) scaleX(1.03) skewX(2deg);
          }
        }

        .animate-flame-outer {
          animation: flame-outer 2s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .animate-flame-middle {
          animation: flame-middle 1.6s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .animate-flame-inner {
          animation: flame-inner 1.3s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>
    </div>
  );
};

export default ActivityDashboard;
