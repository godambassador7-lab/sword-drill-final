import React, { useState, useEffect } from 'react';
import { Gift, Star, Zap, Shield, Clock, Trophy, Sparkles } from 'lucide-react';

const ECONOMY_POWER_UPS = {
  DOUBLE_POINTS: { cost: 100, duration: 600000, multiplier: 2, name: 'Double Points' },
  STREAK_FREEZE: { cost: 150, duration: 86400000, name: 'Streak Freeze' },
  EXTRA_TIME: { cost: 50, duration: 600000, extraTime: 60, name: 'Extra Time' },
  POINT_SHIELD: { cost: 200, duration: 1800000, name: 'Point Shield' }
};

const StreakChests = ({ userData, setUserData, showToast }) => {
  const [availableChests, setAvailableChests] = useState([]);
  const [openedChests, setOpenedChests] = useState({});

  // Define chest tiers
  const CHEST_TIERS = {
    daily: [
      {
        id: 'daily-3',
        title: '3-Day Streak Chest',
        requirement: 3,
        type: 'daily',
        icon: '🎁',
        color: 'from-blue-500 to-cyan-500',
        rewards: [
          { type: 'points', amount: 50 },
          { type: 'powerup', item: 'EXTRA_TIME', quantity: 1 }
        ]
      },
      {
        id: 'daily-7',
        title: '7-Day Streak Chest',
        requirement: 7,
        type: 'daily',
        icon: '🎉',
        color: 'from-purple-500 to-pink-500',
        rewards: [
          { type: 'points', amount: 100 },
          { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 1 }
        ]
      },
      {
        id: 'daily-14',
        title: '14-Day Streak Chest',
        requirement: 14,
        type: 'daily',
        icon: '💎',
        color: 'from-amber-500 to-orange-500',
        rewards: [
          { type: 'points', amount: 200 },
          { type: 'powerup', item: 'STREAK_FREEZE', quantity: 1 }
        ]
      },
      {
        id: 'daily-30',
        title: '30-Day Streak Chest',
        requirement: 30,
        type: 'daily',
        icon: '👑',
        color: 'from-yellow-400 to-amber-500',
        rewards: [
          { type: 'points', amount: 500 },
          { type: 'powerup', item: 'POINT_SHIELD', quantity: 1 },
          { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 2 }
        ]
      },
      {
        id: 'daily-50',
        title: '50-Day Streak Chest',
        requirement: 50,
        type: 'daily',
        icon: '🏆',
        color: 'from-red-500 to-pink-500',
        rewards: [
          { type: 'points', amount: 1000 },
          { type: 'powerup', item: 'STREAK_FREEZE', quantity: 2 },
          { type: 'powerup', item: 'POINT_SHIELD', quantity: 1 }
        ]
      },
      {
        id: 'daily-100',
        title: '100-Day Streak Chest',
        requirement: 100,
        type: 'daily',
        icon: '🌟',
        color: 'from-purple-600 to-indigo-600',
        rewards: [
          { type: 'points', amount: 2500 },
          { type: 'powerup', item: 'DOUBLE_POINTS', quantity: 5 },
          { type: 'powerup', item: 'STREAK_FREEZE', quantity: 3 },
          { type: 'powerup', item: 'POINT_SHIELD', quantity: 2 }
        ]
      }
    ]
  };

  // Check which chests are available
  useEffect(() => {
    if (!userData) return;

    const currentStreak = userData.currentStreak || 0;
    const saved = localStorage.getItem('openedStreakChests');
    const opened = saved ? JSON.parse(saved) : {};
    setOpenedChests(opened);

    const available = CHEST_TIERS.daily.filter(chest =>
      currentStreak >= chest.requirement && !opened[chest.id]
    );

    setAvailableChests(available);
  }, [userData]);

  const openChest = (chest) => {
    // Award rewards
    let pointsGained = 0;
    const powerUpsGained = [];

    chest.rewards.forEach(reward => {
      if (reward.type === 'points') {
        pointsGained += reward.amount;
      } else if (reward.type === 'powerup') {
        powerUpsGained.push({
          type: reward.item,
          quantity: reward.quantity
        });
      }
    });

    // Update user data
    if (setUserData) {
      setUserData(prev => {
        const newActiveBoosts = [...(prev.activeBoosts || [])];

        powerUpsGained.forEach(pu => {
          for (let i = 0; i < pu.quantity; i++) {
            const powerUpInfo = ECONOMY_POWER_UPS[pu.type];
            newActiveBoosts.push({
              type: pu.type,
              activatedAt: Date.now(),
              expiresAt: Date.now() + powerUpInfo.duration,
              multiplier: powerUpInfo.multiplier
            });
          }
        });

        return {
          ...prev,
          totalPoints: prev.totalPoints + pointsGained,
          activeBoosts: newActiveBoosts
        };
      });
    }

    // Mark chest as opened
    const newOpened = { ...openedChests, [chest.id]: true };
    setOpenedChests(newOpened);
    localStorage.setItem('openedStreakChests', JSON.stringify(newOpened));

    // Remove from available
    setAvailableChests(prev => prev.filter(c => c.id !== chest.id));

    // Show toast
    if (showToast) {
      const powerUpText = powerUpsGained.map(pu =>
        `${pu.quantity}x ${ECONOMY_POWER_UPS[pu.type].name}`
      ).join(', ');

      showToast(
        `🎉 ${chest.title} Opened!\n\n+${pointsGained} points${powerUpsGained.length > 0 ? `\n${powerUpText}` : ''}`,
        'success'
      );
    }
  };

  const getRewardIcon = (reward) => {
    if (reward.type === 'points') return <Star className="text-amber-400" size={16} />;
    if (reward.item === 'DOUBLE_POINTS') return <Zap className="text-purple-400" size={16} />;
    if (reward.item === 'STREAK_FREEZE') return <Shield className="text-cyan-400" size={16} />;
    if (reward.item === 'EXTRA_TIME') return <Clock className="text-blue-400" size={16} />;
    if (reward.item === 'POINT_SHIELD') return <Shield className="text-green-400" size={16} />;
    return <Gift size={16} />;
  };

  const getRewardText = (reward) => {
    if (reward.type === 'points') return `+${reward.amount} Points`;
    const powerUp = ECONOMY_POWER_UPS[reward.item];
    return `${reward.quantity}x ${powerUp.name}`;
  };

  if (availableChests.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-6 text-center">
        <Gift size={48} className="text-slate-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-400 mb-2">No Chests Available</h3>
        <p className="text-slate-500 text-sm">
          Keep your daily streak going to unlock reward chests!
          <br />
          Next chest at {CHEST_TIERS.daily.find(c => !openedChests[c.id])?.requirement || 3} days
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Trophy size={28} className="text-amber-400" />
        <div>
          <h2 className="text-2xl font-bold text-amber-400">Streak Rewards</h2>
          <p className="text-slate-400 text-sm">Open chests to claim your rewards!</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {availableChests.map(chest => (
          <div
            key={chest.id}
            className={`bg-gradient-to-br ${chest.color} bg-opacity-20 border-2 border-amber-500 rounded-2xl p-6 relative overflow-hidden animate-pulse-slow`}
          >
            {/* Sparkle effect */}
            <div className="absolute top-2 right-2">
              <Sparkles size={24} className="text-amber-400 animate-spin-slow" />
            </div>

            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{chest.icon}</div>
              <h3 className="text-xl font-bold text-white mb-1">{chest.title}</h3>
              <p className="text-sm text-slate-300">
                Earned for {chest.requirement}-day streak!
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-400 mb-2 font-semibold">Rewards:</p>
              <div className="space-y-1">
                {chest.rewards.map((reward, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {getRewardIcon(reward)}
                    <span className="text-white">{getRewardText(reward)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => openChest(chest)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              Open Chest
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.02); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StreakChests;
