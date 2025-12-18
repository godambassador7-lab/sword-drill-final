import React, { useState } from 'react';
import { ShoppingBag, Zap, Shield, Clock, Flame, Star, X, ArrowLeft } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const ECONOMY_POWER_UPS = {
  DOUBLE_POINTS: { cost: 50, duration: 600000, multiplier: 2, name: 'Double Points', icon: '⚡', description: '2x points for 10 minutes' },
  STREAK_FREEZE: { cost: 75, duration: 86400000, name: 'Streak Freeze', icon: '🧊', description: 'Protect your streak for 24 hours' },
  STREAK_REDEMPTION: { cost: 2000, name: 'Streak Redemption', icon: '💪', description: 'Restore your lost streak (24hr window)', special: 'streak' },
  EXTRA_TIME: { cost: 25, duration: 600000, extraTime: 60, name: 'Extra Time', icon: '⏰', description: '+60 seconds for 10 minutes' },
  POINT_SHIELD: { cost: 100, duration: 1800000, name: 'Point Shield', icon: '🛡️', description: 'No point loss for 30 minutes' },
  QUIZ_ATTEMPTS_5: { cost: 100, quizAttempts: 5, name: '+5 Quiz Attempts', icon: '📝', description: 'Add 5 attempts to a quiz type' },
  QUIZ_ATTEMPTS_10: { cost: 180, quizAttempts: 10, name: '+10 Quiz Attempts', icon: '📚', description: 'Add 10 attempts to a quiz type' }
};

const QUIZ_TYPES = [
  { id: 'fill-blank', name: 'Fill in the Blank', icon: '✏️' },
  { id: 'multiple-choice', name: 'Multiple Choice', icon: '✅' },
  { id: 'reference-recall', name: 'Reference Recall', icon: '📖' },
  { id: 'verse-scramble', name: 'Verse Scramble', icon: '🔀' },
  { id: 'verse-detective', name: 'Verse Detective', icon: '🔍' },
  { id: 'book-order', name: 'Book Order', icon: '📚' }
];

const PowerUpStore = ({ onBack, userData, setUserData, userId }) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);
  const [showQuizSelector, setShowQuizSelector] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const purchasePowerUp = (powerUpKey, selectedQuizType = null) => {
    const powerUp = ECONOMY_POWER_UPS[powerUpKey];

    // Special handling for Streak Redemption
    if (powerUpKey === 'STREAK_REDEMPTION') {
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      if (!userData.streakLostAt || !userData.lastKnownStreak) {
        alert('❌ No Lost Streak\n\nYou don\'t have a lost streak to redeem. This powerup only becomes available when you lose your streak.');
        return;
      }

      const elapsed = Date.now() - userData.streakLostAt;
      if (elapsed >= TWENTY_FOUR_HOURS) {
        alert('❌ Window Expired\n\nThe 24-hour redemption window has expired. You can only redeem your streak within 24 hours of losing it.');
        return;
      }

      if (userData.totalPoints < powerUp.cost) {
        alert(`Not enough points! You need ${powerUp.cost} points but only have ${userData.totalPoints}.`);
        return;
      }

      setPurchasing(true);

      // Restore the streak
      const newPoints = userData.totalPoints - powerUp.cost;
      const restoredStreak = userData.lastKnownStreak;

      // Mark streak days in localStorage
      const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
      for (let i = 0; i < restoredStreak; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        if (!streakData[dateString]) {
          streakData[dateString] = { marked: true, quizzesDone: 1 };
        }
      }
      localStorage.setItem('streakData', JSON.stringify(streakData));

      const updatedData = {
        ...userData,
        currentStreak: restoredStreak,
        totalPoints: newPoints,
        streakLostAt: null,
        lastKnownStreak: 0
      };

      setUserData(updatedData);

      // Sync to Firebase
      if (userId) {
        updateUserProgress(userId, updatedData).catch(err =>
          console.error('Error syncing streak redemption:', err)
        );
      }

      alert(`✅ Streak Restored!\n\nYour ${restoredStreak}-day streak has been redeemed!\n\n-${powerUp.cost} points\nNew balance: ${newPoints} points`);
      setPurchasing(false);
      return;
    }

    if (userData.totalPoints < powerUp.cost) {
      alert(`Not enough points! You need ${powerUp.cost} points but only have ${userData.totalPoints}.`);
      return;
    }

    // If it's a quiz attempts powerup and no quiz type selected yet, show selector
    if (powerUp.quizAttempts && !selectedQuizType) {
      setSelectedPowerUp(powerUpKey);
      setShowQuizSelector(true);
      return;
    }

    setPurchasing(true);

    const newPoints = userData.totalPoints - powerUp.cost;
    let updatedData = {
      ...userData,
      totalPoints: newPoints
    };

    // Handle quiz attempts powerup
    if (powerUp.quizAttempts && selectedQuizType) {
      const quizAttemptsKey = `${selectedQuizType}QuizAttempts`;
      const currentAttempts = userData[quizAttemptsKey] || 0;
      updatedData[quizAttemptsKey] = currentAttempts + powerUp.quizAttempts;

      alert(`✅ Purchased!\n\n+${powerUp.quizAttempts} attempts added to ${QUIZ_TYPES.find(q => q.id === selectedQuizType)?.name}!\n\nNew balance: ${newPoints} points`);
    } else {
      // Handle time-based boosts
      const newBoost = {
        type: powerUpKey,
        name: powerUp.name,
        activatedAt: Date.now(),
        expiresAt: Date.now() + powerUp.duration,
        ...powerUp
      };

      updatedData.activeBoosts = [...(userData.activeBoosts || []), newBoost];

      const durationMinutes = Math.floor(powerUp.duration / 60000);
      alert(`✅ Purchased!\n\n${powerUp.name} activated for ${durationMinutes} minutes!\n\nNew balance: ${newPoints} points`);
    }

    setUserData(updatedData);

    // Sync to Firebase
    if (userId) {
      updateUserProgress(userId, updatedData).catch(err =>
        console.error('Error syncing powerup purchase:', err)
      );
    }

    setPurchasing(false);
    setShowQuizSelector(false);
    setSelectedPowerUp(null);
  };

  const handleQuizTypeSelection = (quizTypeId) => {
    purchasePowerUp(selectedPowerUp, quizTypeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Power-Up Store
          </h1>
          <div className="flex items-center justify-center gap-2 text-2xl">
            <Star size={28} className="text-amber-400" />
            <span className="text-amber-400 font-bold">{userData.totalPoints || 0}</span>
            <span className="text-slate-400">points available</span>
          </div>
        </div>

        {/* Quiz Type Selector Modal */}
        {showQuizSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowQuizSelector(false)}>
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border-2 border-amber-500/30" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-amber-400">Select Quiz Type</h2>
                <button onClick={() => setShowQuizSelector(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <p className="text-slate-300 mb-4 text-sm">
                Choose which quiz type will receive the extra attempts:
              </p>
              <div className="space-y-2">
                {QUIZ_TYPES.map(quizType => (
                  <button
                    key={quizType.id}
                    onClick={() => handleQuizTypeSelection(quizType.id)}
                    disabled={purchasing}
                    className="w-full flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg border-2 border-transparent hover:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-3xl">{quizType.icon}</span>
                    <span className="text-lg font-semibold text-white">{quizType.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Power-Ups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(ECONOMY_POWER_UPS).map(([key, powerUp]) => {
            const canAfford = userData.totalPoints >= powerUp.cost;
            const isQuizAttempt = !!powerUp.quizAttempts;

            // Special handling for Streak Redemption availability
            let isStreakRedemptionAvailable = true;
            let streakRedemptionMessage = '';

            if (key === 'STREAK_REDEMPTION') {
              const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

              if (!userData.streakLostAt || !userData.lastKnownStreak) {
                isStreakRedemptionAvailable = false;
                streakRedemptionMessage = 'No Lost Streak';
              } else {
                const elapsed = Date.now() - userData.streakLostAt;
                if (elapsed >= TWENTY_FOUR_HOURS) {
                  isStreakRedemptionAvailable = false;
                  streakRedemptionMessage = '24hr Window Expired';
                } else {
                  const hoursLeft = Math.floor((TWENTY_FOUR_HOURS - elapsed) / (60 * 60 * 1000));
                  const minutesLeft = Math.floor(((TWENTY_FOUR_HOURS - elapsed) % (60 * 60 * 1000)) / (60 * 1000));
                  streakRedemptionMessage = `${hoursLeft}h ${minutesLeft}m remaining`;
                }
              }
            }

            return (
              <div
                key={key}
                className={`bg-gradient-to-br ${
                  canAfford && (key !== 'STREAK_REDEMPTION' || isStreakRedemptionAvailable)
                    ? 'from-slate-800 to-slate-700 border-amber-500/50'
                    : 'from-slate-900 to-slate-800 border-slate-700'
                } border-2 rounded-2xl p-6 transition-all ${
                  canAfford && (key !== 'STREAK_REDEMPTION' || isStreakRedemptionAvailable) ? 'hover:scale-105 hover:border-amber-400' : 'opacity-60'
                }`}
              >
                {/* Icon */}
                <div className="text-6xl text-center mb-4">{powerUp.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {powerUp.name}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm text-center mb-4">
                  {powerUp.description}
                </p>

                {/* Streak Redemption Status */}
                {key === 'STREAK_REDEMPTION' && streakRedemptionMessage && (
                  <div className={`text-center text-sm mb-3 font-semibold ${
                    isStreakRedemptionAvailable ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isStreakRedemptionAvailable && userData.lastKnownStreak && (
                      <div className="text-amber-400 mb-1">Restore {userData.lastKnownStreak}-day streak</div>
                    )}
                    {streakRedemptionMessage}
                  </div>
                )}

                {/* Cost */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star size={20} className="text-amber-400" />
                  <span className="text-2xl font-bold text-amber-400">{powerUp.cost}</span>
                  <span className="text-slate-400">points</span>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => purchasePowerUp(key)}
                  disabled={!canAfford || purchasing || (key === 'STREAK_REDEMPTION' && !isStreakRedemptionAvailable)}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    canAfford && (key !== 'STREAK_REDEMPTION' || isStreakRedemptionAvailable)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {key === 'STREAK_REDEMPTION' && !isStreakRedemptionAvailable
                    ? 'Unavailable'
                    : canAfford
                    ? (isQuizAttempt ? 'Select Quiz Type' : 'Purchase')
                    : 'Not Enough Points'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border-2 border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-400 mb-3">How Power-Ups Work</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>⚡ <strong>Double Points:</strong> Earn 2x points on all quizzes for 10 minutes</li>
            <li>🧊 <strong>Streak Freeze:</strong> Your streak won't break even if you miss a day (lasts 24 hours)</li>
            <li>💪 <strong>Streak Redemption:</strong> Restore your lost streak within 24 hours of losing it (2000 points). Only available when you have a lost streak.</li>
            <li>⏰ <strong>Extra Time:</strong> Get an additional 60 seconds on timed quizzes for 10 minutes</li>
            <li>🛡️ <strong>Point Shield:</strong> Protect yourself from losing points on incorrect answers for 30 minutes</li>
            <li>📝 <strong>+5 Quiz Attempts:</strong> Add 5 extra attempts to a specific quiz type today</li>
            <li>📚 <strong>+10 Quiz Attempts:</strong> Add 10 extra attempts to a specific quiz type today</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PowerUpStore;
