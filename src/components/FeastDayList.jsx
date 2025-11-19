/**
 * FeastDayList Component
 *
 * Displays upcoming Biblical feast days with detailed information
 * Shows Hebrew and Roman dates, days until, and tooltips with Biblical context
 */

import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  BookOpen,
  Info,
  Sparkles
} from 'lucide-react';
import { useFeastDays } from '../hooks/useFeastDays';

const FeastDayList = ({ daysAhead = 60, className = '' }) => {
  const { upcomingFeasts, todaysFeast, isLoading } = useFeastDays(daysAhead);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFeast, setSelectedFeast] = useState(null);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const getCategoryColor = (category) => {
    const colors = {
      spring: 'text-green-400 bg-green-900/30 border-green-700',
      fall: 'text-orange-400 bg-orange-900/30 border-orange-700',
      weekly: 'text-blue-400 bg-blue-900/30 border-blue-700',
      monthly: 'text-purple-400 bg-purple-900/30 border-purple-700',
      'post-exilic': 'text-pink-400 bg-pink-900/30 border-pink-700',
      'second-temple': 'text-cyan-400 bg-cyan-900/30 border-cyan-700',
      other: 'text-slate-400 bg-slate-900/30 border-slate-700'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    if (category === 'spring' || category === 'fall') return <Sparkles size={16} />;
    if (category === 'weekly') return <Calendar size={16} />;
    if (category === 'monthly') return <Star size={16} />;
    return <BookOpen size={16} />;
  };

  if (isLoading) {
    return (
      <div className={`feast-day-list ${className}`}>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <span>Loading feast days...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`feast-day-list ${className}`}>
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {/* Header */}
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-900/60 hover:to-blue-900/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Star className="text-amber-400" size={24} />
            <div className="text-left">
              <h3 className="text-lg font-bold text-white">Upcoming Biblical Feasts & Holy Days</h3>
              <p className="text-xs text-slate-300">Next {daysAhead} days</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="text-slate-300" size={20} />
          ) : (
            <ChevronDown className="text-slate-300" size={20} />
          )}
        </button>

        {/* Today's Feast Highlight */}
        {isExpanded && todaysFeast && (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 border-b border-amber-700">
            <div className="flex items-start gap-3">
              <Sparkles className="text-white mt-1 flex-shrink-0 animate-pulse" size={24} />
              <div className="flex-1">
                <div className="text-xs text-amber-100 uppercase tracking-wide font-semibold mb-1">
                  Today's Feast
                </div>
                <div className="text-xl font-bold text-white mb-1">{todaysFeast.name}</div>
                {todaysFeast.details && (
                  <p className="text-sm text-amber-50">{todaysFeast.details.tooltip}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feast List */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            {upcomingFeasts.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                <p>No feast days in the next {daysAhead} days</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {upcomingFeasts.map((feast, index) => {
                  const isSelected = selectedFeast === index;
                  const categoryColor = getCategoryColor(feast.category);

                  return (
                    <div
                      key={`${feast.name}-${index}`}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <button
                        onClick={() => setSelectedFeast(isSelected ? null : index)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            {/* Feast Name */}
                            <div className="flex items-center gap-2 mb-1">
                              {getCategoryIcon(feast.category)}
                              <h4 className="font-semibold text-white">{feast.name}</h4>
                            </div>

                            {/* Dates */}
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-slate-300">
                                <span className="text-xs text-slate-500">Hebrew:</span>
                                <span>{feast.hebrewDate}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <span className="text-xs text-slate-500">Gregorian:</span>
                                <span>
                                  {new Date(feast.gregorianDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Category Badge */}
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${categoryColor}`}
                              >
                                {feast.category}
                              </span>
                            </div>
                          </div>

                          {/* Days Until */}
                          <div className="flex flex-col items-end">
                            <div className="text-2xl font-bold text-amber-400">
                              {feast.daysUntil}
                            </div>
                            <div className="text-xs text-slate-400">
                              {feast.daysUntil === 1 ? 'day' : 'days'}
                            </div>
                            {feast.details && (
                              <Info
                                size={16}
                                className="mt-2 text-blue-400"
                                title="Click for more info"
                              />
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isSelected && feast.details && (
                          <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-600">
                            {/* Hebrew Name */}
                            {feast.details.hebrewName && (
                              <div className="mb-2">
                                <span className="text-xs text-slate-400">Hebrew Name: </span>
                                <span className="text-sm text-blue-300 font-semibold">
                                  {feast.details.hebrewName}
                                </span>
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-sm text-slate-300 mb-3">
                              {feast.details.description}
                            </p>

                            {/* Themes */}
                            {feast.details.themes && feast.details.themes.length > 0 && (
                              <div className="mb-2">
                                <div className="text-xs text-slate-400 mb-1">Themes:</div>
                                <div className="flex flex-wrap gap-1">
                                  {feast.details.themes.map(theme => (
                                    <span
                                      key={theme}
                                      className="text-xs px-2 py-0.5 bg-purple-900/30 text-purple-300 rounded border border-purple-700"
                                    >
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Scripture References */}
                            {feast.details.primaryRefs && feast.details.primaryRefs.length > 0 && (
                              <div className="mb-2">
                                <div className="text-xs text-slate-400 mb-1">
                                  Primary Scripture References:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {feast.details.primaryRefs.map(ref => (
                                    <span
                                      key={ref}
                                      className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded border border-blue-700"
                                    >
                                      {ref}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* NT References */}
                            {feast.details.ntRefs && feast.details.ntRefs.length > 0 && (
                              <div>
                                <div className="text-xs text-slate-400 mb-1">
                                  New Testament References:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {feast.details.ntRefs.map(ref => (
                                    <span
                                      key={ref}
                                      className="text-xs px-2 py-0.5 bg-green-900/30 text-green-300 rounded border border-green-700"
                                    >
                                      {ref}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .feast-day-list {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feast-day-list ::-webkit-scrollbar {
          width: 8px;
        }

        .feast-day-list ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        .feast-day-list ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }

        .feast-day-list ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default FeastDayList;
