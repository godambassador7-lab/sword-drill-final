import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Clock, Star } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const localDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const ECONOMY_POWER_UPS = {
  DOUBLE_POINTS: { cost: 50, duration: 600000, multiplier: 2, name: 'Double Points' },
  STREAK_FREEZE: { cost: 75, duration: 86400000, name: 'Streak Freeze' },
  EXTRA_TIME: { cost: 25, duration: 600000, extraTime: 60, name: 'Extra Time' },
  POINT_SHIELD: { cost: 100, duration: 1800000, name: 'Point Shield' },
  QUIZ_ATTEMPTS_5: { cost: 100, quizAttempts: 5, name: '+5 Quiz Attempts' },
  QUIZ_ATTEMPTS_10: { cost: 180, quizAttempts: 10, name: '+10 Quiz Attempts' }
};

const DailyChestsPage = ({ onCancel, userData, setUserData, userId, showToast }) => {
  const [dailyChestsData, setDailyChestsData] = useState({});
  const [opening, setOpening] = useState(null);
  const [showRewards, setShowRewards] = useState(null);

  // Daily chests - 2 free per day
  const DAILY_CHESTS = [
    {
      id: 'daily-chest-1',
      title: 'Morning Blessing',
      subtitle: 'Earn Manna with each quiz today!',
      icon: '💎',
      color: 'from-amber-400 to-orange-500',
      glowColor: 'shadow-amber-500/50',
      rewards: [
        { type: 'manna-activation', description: 'Earn 1 Manna per quiz completed today' }
      ]
    },
    {
      id: 'daily-chest-2',
      title: 'Evening Grace',
      subtitle: 'End your day with blessings',
      icon: '🌙',
      color: 'from-indigo-500 to-purple-600',
      glowColor: 'shadow-purple-500/50',
      rewards: [
        { type: 'points', amount: 25 },
        { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 1 }
      ]
    }
  ];

  // Load daily chests data from localStorage
  useEffect(() => {
    const today = localDateString();
    const saved = localStorage.getItem('freeDailyChests');

    if (saved) {
      try {
        const data = JSON.parse(saved);
        // If data is from today, use it; otherwise reset
        if (data.date === today) {
          setDailyChestsData(data);
        } else {
          // New day - reset
          const newData = {
            date: today,
            opened: []
          };
          setDailyChestsData(newData);
          localStorage.setItem('freeDailyChests', JSON.stringify(newData));
        }
      } catch (e) {
        console.error('Error loading daily chests:', e);
      }
    } else {
      // Initialize
      const newData = {
        date: today,
        opened: []
      };
      setDailyChestsData(newData);
      localStorage.setItem('freeDailyChests', JSON.stringify(newData));
    }
  }, []);

  // Check if chest is opened today
  const isChestOpened = (chestId) => {
    return dailyChestsData.opened?.includes(chestId) || false;
  };

  // Open chest with animation
  const openChest = (chest) => {
    if (isChestOpened(chest.id) || opening) return;

    setOpening(chest.id);

    // Show opening animation for 1.5 seconds
    setTimeout(() => {
      let newPoints = userData.totalPoints || 0;
      let newManna = userData.manna || 0;
      const newActiveBoosts = [...(userData.activeBoosts || [])];

      let mannaEarningActivated = false;

      // Process rewards
      chest.rewards.forEach(reward => {
        if (reward.type === 'points') {
          newPoints += reward.amount;
        } else if (reward.type === 'manna') {
          newManna += reward.amount;
        } else if (reward.type === 'manna-activation') {
          mannaEarningActivated = true;
        } else if (reward.type === 'powerup') {
          const powerUpConfig = ECONOMY_POWER_UPS[reward.item];
          if (powerUpConfig) {
            for (let i = 0; i < reward.quantity; i++) {
              newActiveBoosts.push({
                type: reward.item,
                name: powerUpConfig.name,
                activatedAt: Date.now(),
                expiresAt: Date.now() + powerUpConfig.duration,
                ...powerUpConfig
              });
            }
          }
        }
      });

      // Update userData
      const updates = {
        totalPoints: newPoints,
        manna: newManna,
        mannaLastUpdated: Date.now(),
        mannaEarningActive: userData.mannaEarningActive || mannaEarningActivated,
        activeBoosts: newActiveBoosts
      };

      setUserData(prev => ({
        ...prev,
        ...updates
      }));

      // Update localStorage
      const newData = {
        ...dailyChestsData,
        opened: [...(dailyChestsData.opened || []), chest.id]
      };
      setDailyChestsData(newData);
      localStorage.setItem('freeDailyChests', JSON.stringify(newData));

      // Sync to Firebase
      if (userId) {
        updateUserProgress(userId, updates).catch(err =>
          console.error('Error syncing chest rewards:', err)
        );
      }

      setOpening(null);
      setShowRewards(chest);

      // Auto-hide rewards after 3 seconds
      setTimeout(() => {
        setShowRewards(null);
      }, 3000);
    }, 1500);
  };

  if (!dailyChestsData.date) {
    return null; // Still loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles size={32} className="text-amber-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Daily Chests</h1>
              <p className="text-slate-400">Open 2 free chests every day!</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Reset Info */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30 mb-6">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Clock size={18} className="text-amber-400" />
            <span className="text-sm">Chests reset daily at midnight</span>
          </div>
        </div>

        {/* Chests Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {DAILY_CHESTS.map(chest => {
            const opened = isChestOpened(chest.id);
            const isOpening = opening === chest.id;
            const isShowingRewards = showRewards?.id === chest.id;

            return (
              <div key={chest.id} className="relative">
                <div
                  className={`relative bg-gradient-to-br ${chest.color} rounded-2xl p-8 transition-all duration-500 ${
                    opened ? 'opacity-60' : 'opacity-100 hover:scale-105 cursor-pointer'
                  } ${!opened && !isOpening ? 'shadow-2xl hover:shadow-3xl' : ''} ${
                    !opened ? `shadow-2xl ${chest.glowColor} animate-pulse` : ''
                  }`}
                  onClick={() => !opened && !isOpening && openChest(chest)}
                >
                  {/* Glowing Effect */}
                  {!opened && !isOpening && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none animate-pulse" />
                  )}

                  {/* Chest Icon/Image */}
                  <div className="text-center mb-4">
                    <div
                      className={`text-8xl transition-transform duration-500 ${
                        isOpening ? 'animate-bounce scale-125' : opened ? 'scale-90 opacity-50' : 'scale-100'
                      }`}
                    >
                      {chest.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{chest.title}</h3>
                    <p className="text-white/80 text-sm">{chest.subtitle}</p>
                  </div>

                  {/* Rewards Preview (when not opened) */}
                  {!opened && !isShowingRewards && (
                    <div className="space-y-2 text-white/90 text-sm">
                      {chest.rewards.map((reward, idx) => (
                        <div key={idx} className="flex items-center gap-2 justify-center">
                          {reward.type === 'points' ? (
                            <>
                              <Star size={16} className="text-yellow-300" />
                              <span className="font-semibold">{reward.amount} points</span>
                            </>
                          ) : reward.type === 'manna' ? (
                            <>
                              <span className="text-xl">🌾</span>
                              <span className="font-semibold">{reward.amount} Manna</span>
                            </>
                          ) : reward.type === 'manna-activation' ? (
                            <>
                              <span className="text-xl">🌾</span>
                              <span className="font-semibold text-center">{reward.description}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} className="text-cyan-300" />
                              <span className="font-semibold">
                                {ECONOMY_POWER_UPS[reward.item]?.name} x{reward.quantity}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status */}
                  <div className="mt-6 text-center">
                    {opened ? (
                      <div className="flex items-center justify-center gap-2 text-white font-bold">
                        <Clock size={18} />
                        <span>Opened - Reset at Midnight</span>
                      </div>
                    ) : isOpening ? (
                      <div className="text-white font-bold text-lg animate-pulse">
                        Opening...
                      </div>
                    ) : (
                      <div className="text-white font-bold text-lg animate-pulse">
                        Tap to Open!
                      </div>
                    )}
                  </div>
                </div>

                {/* Rewards Popup */}
                {isShowingRewards && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-slate-900/95 border-4 border-amber-400 rounded-2xl p-8 shadow-2xl shadow-amber-500/50 animate-bounce-in">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-amber-400 mb-4">
                          {chest.title} Opened!
                        </h3>
                        <div className="space-y-3">
                          {chest.rewards.map((reward, idx) => (
                            <div key={idx} className="text-white text-lg font-semibold">
                              {reward.type === 'points' && (
                                <div className="flex items-center gap-2 justify-center">
                                  <Star size={24} className="text-yellow-300" />
                                  <span>+{reward.amount} Points</span>
                                </div>
                              )}
                              {reward.type === 'manna' && (
                                <div className="flex items-center gap-2 justify-center">
                                  <span className="text-3xl">🌾</span>
                                  <span>+{reward.amount} Manna</span>
                                </div>
                              )}
                              {reward.type === 'manna-activation' && (
                                <div className="flex flex-col items-center gap-2 justify-center">
                                  <span className="text-3xl">🌾</span>
                                  <span className="text-center">{reward.description}</span>
                                  <span className="text-sm text-amber-300">Active for today!</span>
                                </div>
                              )}
                              {reward.type === 'powerup' && (
                                <div className="flex items-center gap-2 justify-center">
                                  <Sparkles size={24} className="text-cyan-300" />
                                  <span>{ECONOMY_POWER_UPS[reward.item]?.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
            <Sparkles size={24} />
            About Manna 🌾
          </h3>
          <p className="text-slate-300 mb-3">
            <strong className="text-blue-300">Manna</strong> is a special daily-only currency that cannot be saved past 24 hours.
            Just like the manna in the wilderness, it must be used each day!
          </p>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="flex items-start gap-2">
              <Star size={16} className="text-amber-400 mt-1 flex-shrink-0" />
              <span><strong>Earn Manna by:</strong> Opening Morning Blessing chest, completing daily verses</span>
            </div>
            <div className="flex items-start gap-2">
              <Star size={16} className="text-amber-400 mt-1 flex-shrink-0" />
              <span><strong>Use Manna for:</strong> Daily boosts, hints, retries, and quality-of-life features</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-red-400 mt-1 flex-shrink-0" />
              <span><strong>Expires:</strong> Unused Manna resets to 0 at midnight each day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChestsPage;
