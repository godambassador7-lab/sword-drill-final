import React, { useState, useEffect } from 'react';
import { Flame, Clock, AlertCircle, Sparkles, X } from 'lucide-react';

const StreakRedemptionOffer = ({ userData, onPurchase, onDismiss }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const REDEMPTION_COST = 2000;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (!userData.streakLostAt) return;

    const updateTimer = () => {
      const elapsed = Date.now() - userData.streakLostAt;
      const remaining = TWENTY_FOUR_HOURS - elapsed;

      if (remaining <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [userData.streakLostAt]);

  const canAfford = userData.totalPoints >= REDEMPTION_COST;
  const isExpired = timeRemaining === 'Expired';

  if (isExpired) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-lg w-full border-2 border-orange-500/50 shadow-2xl animate-pulse-slow my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 sm:p-6 rounded-t-xl relative flex-shrink-0">
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-lg transition-colors z-10"
          >
            <X size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 justify-center pr-8">
            <Flame size={32} sm:size={40} className="text-white flex-shrink-0" />
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Streak Lost!</h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">Your {userData.lastKnownStreak}-day streak has ended</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Timer Warning */}
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <Clock size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-300 mb-1">Limited Time Offer!</div>
              <div className="text-red-200 text-sm">
                You have <span className="font-bold text-white">{timeRemaining}</span> remaining to redeem your streak
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles size={24} className="text-amber-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-400 text-lg mb-2">Streak Redeemption</h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  Restore your {userData.lastKnownStreak}-day streak and continue your journey!
                  This one-time offer expires in 24 hours.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Cost:</span>
                <span className="text-amber-400 font-bold text-xl">{REDEMPTION_COST} points</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Your Balance:</span>
                <span className={`font-bold text-lg ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                  {userData.totalPoints} points
                </span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {!canAfford && (
            <div className="bg-amber-600/20 border border-amber-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-200">
                You need {REDEMPTION_COST - userData.totalPoints} more points to redeem your streak.
                Complete quizzes to earn points quickly!
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onDismiss}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all"
            >
              Maybe Later
            </button>
            <button
              onClick={onPurchase}
              disabled={!canAfford}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                canAfford
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Flame size={20} />
              {canAfford ? 'Redeem Streak' : 'Not Enough Points'}
            </button>
          </div>

          {/* Fine Print */}
          <div className="text-center text-xs text-slate-500">
            This offer can only be used once per streak loss
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakRedemptionOffer;
