import React from 'react';
import { Trophy, TrendingUp, Eye, Clock, Award, Star } from 'lucide-react';

const FocusScoreResults = ({ integrityScore, focusBreakCount, totalSecondsAway, onClose }) => {
  const { score, breakdown, tier } = integrityScore;

  const tierConfig = {
    elite: {
      color: 'from-purple-600 to-pink-600',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
      borderColor: 'border-purple-500',
      title: 'Elite Scholar',
      icon: '👑',
      message: 'Perfect focus! You maintained complete integrity throughout your session.',
      bonus: '+50% XP Bonus'
    },
    excellent: {
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-600/20',
      borderColor: 'border-emerald-500',
      title: 'Excellent Focus',
      icon: '⭐',
      message: 'Outstanding concentration with minimal distractions.',
      bonus: '+25% XP Bonus'
    },
    good: {
      color: 'from-blue-600 to-cyan-600',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-500',
      title: 'Good Focus',
      icon: '✨',
      message: 'Solid focus with room for improvement.',
      bonus: '+10% XP Bonus'
    },
    fair: {
      color: 'from-amber-600 to-orange-600',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-600/20',
      borderColor: 'border-amber-500',
      title: 'Fair Focus',
      icon: '📚',
      message: 'Consider using lock-in mode for better focus next time.',
      bonus: 'No Bonus'
    }
  };

  const config = tierConfig[tier] || tierConfig.fair;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border-2 border-amber-500/30 mt-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} rounded-lg p-4 mb-6`}>
        <div className="text-center">
          <div className="text-6xl mb-2">{config.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-1">{config.title}</h3>
          <p className="text-white/90 text-sm">{config.message}</p>
        </div>
      </div>

      {/* Score Display */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 text-center`}>
          <Eye size={24} className={`${config.textColor} mx-auto mb-2`} />
          <div className="text-3xl font-bold text-slate-200">{score}</div>
          <div className="text-sm text-slate-400 mt-1">Integrity Score</div>
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center">
          <TrendingUp size={24} className="text-slate-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-200">{focusBreakCount}</div>
          <div className="text-sm text-slate-400 mt-1">Focus Breaks</div>
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center">
          <Clock size={24} className="text-slate-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-200">{totalSecondsAway}s</div>
          <div className="text-sm text-slate-400 mt-1">Time Away</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          Score Breakdown
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Base Score</span>
            <span className="text-emerald-400 font-semibold">{breakdown.base}</span>
          </div>
          {breakdown.breakDeduction !== 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Focus Breaks Penalty</span>
              <span className="text-red-400 font-semibold">{breakdown.breakDeduction}</span>
            </div>
          )}
          {breakdown.timeDeduction !== 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Time Away Penalty</span>
              <span className="text-red-400 font-semibold">{breakdown.timeDeduction}</span>
            </div>
          )}
          <div className="border-t border-slate-600 pt-2 flex justify-between font-bold">
            <span className="text-slate-200">Final Score</span>
            <span className={config.textColor}>{breakdown.final}</span>
          </div>
        </div>
      </div>

      {/* Bonus */}
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award size={24} className={config.textColor} />
            <div>
              <div className="font-semibold text-slate-200">Focus Bonus</div>
              <div className="text-sm text-slate-400">Applied to this session</div>
            </div>
          </div>
          <div className={`text-xl font-bold ${config.textColor}`}>
            {config.bonus}
          </div>
        </div>
      </div>

      {/* Tips for Improvement */}
      {score < 95 && (
        <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
            <Star size={18} />
            Tips for Elite Status
          </h4>
          <ul className="text-sm text-blue-200 space-y-1 ml-6">
            <li>• Close all unnecessary apps before starting</li>
            <li>• Use guided access / screen pinning</li>
            <li>• Study in a distraction-free environment</li>
            <li>• Set your phone to Do Not Disturb mode</li>
            <li>• Take scheduled breaks between sessions</li>
          </ul>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all`}
      >
        Continue
      </button>
    </div>
  );
};

export default FocusScoreResults;
