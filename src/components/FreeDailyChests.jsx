import React, { useState, useEffect } from 'react';
import { Gift, Star, Sparkles, Clock } from 'lucide-react';
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

const FreeDailyChests = ({ userData, setUserData, userId, showToast }) => {
  const [dailyChestsData, setDailyChestsData] = useState({});
  const [opening, setOpening] = useState(null);

  // Daily chests - 2 free per day
  const DAILY_CHESTS = [
    {
      id: 'daily-chest-1',
      title: 'Morning Blessing',
      icon: '🌅',
      color: 'from-amber-400 to-orange-500',
      rewards: [
        { type: 'points', amount: 25 },
        { type: 'powerup', item: 'EXTRA_TIME', quantity: 1 }
      ]
    },
    {
      id: 'daily-chest-2',
      title: 'Evening Grace',
      icon: '🌙',
      color: 'from-indigo-500 to-purple-600',
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

  // Check if Morning Blessing is available (3am to 3pm)
  const isMorningBlessingAvailable = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 3 && currentHour < 15; // 3:00 AM to 2:59 PM
  };

  // Check if Evening Grace is available (3pm to 3am next day)
  const isEveningGraceAvailable = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 15 || currentHour < 3; // 3:00 PM to 2:59 AM
  };

  // Open chest
  const openChest = (chest) => {
    if (isChestOpened(chest.id) || opening) return;

    // Check if Morning Blessing chest and time restriction
    if (chest.id === 'daily-chest-1' && !isMorningBlessingAvailable()) {
      if (showToast) {
        showToast('🌅 Morning Blessing is only available between 3:00 AM and 3:00 PM', 'info');
      } else {
        alert('Morning Blessing is only available between 3:00 AM and 3:00 PM');
      }
      return;
    }

    // Check if Evening Grace chest and time restriction
    if (chest.id === 'daily-chest-2' && !isEveningGraceAvailable()) {
      if (showToast) {
        showToast('🌙 Evening Grace is only available between 3:00 PM and 3:00 AM', 'info');
      } else {
        alert('Evening Grace is only available between 3:00 PM and 3:00 AM');
      }
      return;
    }

    setOpening(chest.id);

    setTimeout(() => {
      let newPoints = userData.totalPoints || 0;
      const newActiveBoosts = [...(userData.activeBoosts || [])];

      // Process rewards
      chest.rewards.forEach(reward => {
        if (reward.type === 'points') {
          newPoints += reward.amount;
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
      setUserData(prev => ({
        ...prev,
        totalPoints: newPoints,
        activeBoosts: newActiveBoosts
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
        updateUserProgress(userId, {
          totalPoints: newPoints,
          activeBoosts: newActiveBoosts
        }).catch(err => console.error('Error syncing chest rewards:', err));
      }

      // Show reward message
      const pointsReward = chest.rewards.find(r => r.type === 'points');
      const powerUpRewards = chest.rewards.filter(r => r.type === 'powerup');

      let message = `🎉 ${chest.title} Opened!\n\n`;
      if (pointsReward) {
        message += `💰 +${pointsReward.amount} points\n`;
      }
      if (powerUpRewards.length > 0) {
        powerUpRewards.forEach(pu => {
          const config = ECONOMY_POWER_UPS[pu.item];
          message += `⚡ ${config.name} x${pu.quantity}\n`;
        });
      }

      if (showToast) {
        showToast(message, 'success');
      } else {
        alert(message);
      }

      setOpening(null);
    }, 500);
  };

  if (!dailyChestsData.date) {
    return null; // Still loading
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border-2 border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Gift size={20} className="text-amber-400" />
        <h3 className="text-lg font-bold text-amber-400">Free Daily Chests</h3>
        <Sparkles size={18} className="text-yellow-400 animate-pulse" />
      </div>

      <p className="text-slate-300 mb-4 text-xs">
        Open 2 free chests every day! Chests reset at midnight.
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        {DAILY_CHESTS.map(chest => {
          const opened = isChestOpened(chest.id);
          const isOpening = opening === chest.id;
          const isMorningChest = chest.id === 'daily-chest-1';
          const isEveningChest = chest.id === 'daily-chest-2';
          const isLocked = (isMorningChest && !isMorningBlessingAvailable()) ||
                          (isEveningChest && !isEveningGraceAvailable());

          return (
            <div
              key={chest.id}
              className={`relative bg-gradient-to-br ${chest.color} ${
                opened || isLocked ? 'opacity-40' : 'opacity-100 hover:scale-105'
              } rounded-lg p-4 transition-all duration-300 ${
                !opened && !isOpening && !isLocked ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${isOpening ? 'animate-pulse' : ''}`}
              onClick={() => !opened && !isOpening && !isLocked && openChest(chest)}
            >
              {/* Chest Icon */}
              <div className="text-4xl text-center mb-2">
                {chest.icon}
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-white text-center mb-2">
                {chest.title}
              </h4>

              {/* Rewards */}
              <div className="space-y-1 text-white text-xs">
                {chest.rewards.map((reward, idx) => (
                  <div key={idx} className="flex items-center gap-2 justify-center">
                    {reward.type === 'points' ? (
                      <>
                        <Star size={14} className="text-yellow-300" />
                        <span>{reward.amount} points</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} className="text-cyan-300" />
                        <span>
                          {ECONOMY_POWER_UPS[reward.item]?.name} x{reward.quantity}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Status */}
              {opened ? (
                <div className="mt-4 text-center text-white font-bold flex items-center justify-center gap-2">
                  <Clock size={16} />
                  <span>Opened</span>
                </div>
              ) : isLocked ? (
                <div className="mt-4 text-center text-white font-bold flex items-center justify-center gap-2">
                  <Clock size={16} />
                  <span>{isMorningChest ? 'Available 3am-3pm' : 'Available 3pm-3am'}</span>
                </div>
              ) : (
                <div className="mt-4 text-center text-white font-bold animate-pulse">
                  Click to Open!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Info */}
      <div className="mt-4 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <Clock size={16} />
        <span>Chests reset daily at midnight</span>
      </div>
    </div>
  );
};

export default FreeDailyChests;
