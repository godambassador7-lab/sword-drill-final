import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Flame, Target, Edit2, Trash2, Check } from 'lucide-react';

const LearningPlan = ({ userData, onUpdatePlan }) => {
  const [plans, setPlans] = useState([]);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [streakData, setStreakData] = useState({});
  const [newPlan, setNewPlan] = useState({
    title: '',
    quizType: 'memory',
    daysPerWeek: 3,
    targetDate: '',
    completed: false
  });

  const quizTypes = [
    { value: 'memory', label: 'Memory Verse Practice' },
    { value: 'verse-scramble', label: 'Verse Scramble' },
    { value: 'book-order', label: 'Book Order Challenge' },
    { value: 'sword-drill-ultimate', label: 'Sword Drill Ultimate' },
    { value: 'greek', label: 'Greek Studies' },
    { value: 'any', label: 'Any Quiz Type' }
  ];

  useEffect(() => {
    // Load plans from localStorage
    const savedPlans = localStorage.getItem('learningPlans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }

  }, []);

  // Refresh streak view whenever the user's streak changes (e.g., after a quiz)
  useEffect(() => {
    const savedStreaks = localStorage.getItem('streakData');
    if (savedStreaks) {
      // Normalize keys to local date (YYYY-MM-DD) in case of mixed formats
      try {
        const raw = JSON.parse(savedStreaks);
        const normalized = {};
        Object.entries(raw).forEach(([k, v]) => {
          // Already yyyy-mm-dd?
          if (/^\d{4}-\d{2}-\d{2}$/.test(k)) {
            normalized[k] = v;
          } else {
            const d = new Date(k);
            if (!isNaN(d)) {
              const key = d.toLocaleDateString('en-CA');
              normalized[key] = v;
            }
          }
        });
        setStreakData(normalized);
      } catch {
        setStreakData({});
      }
    } else {
      setStreakData({});
    }
  }, [userData?.currentStreak]);

  const savePlans = (updatedPlans) => {
    setPlans(updatedPlans);
    localStorage.setItem('learningPlans', JSON.stringify(updatedPlans));
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlans);
    }
  };

  const handleAddPlan = () => {
    if (!newPlan.title.trim()) return;

    const plan = {
      id: Date.now(),
      ...newPlan,
      createdAt: new Date().toISOString(),
      progress: 0
    };

    savePlans([...plans, plan]);
    setNewPlan({
      title: '',
      quizType: 'memory',
      daysPerWeek: 3,
      targetDate: '',
      completed: false
    });
    setShowAddPlan(false);
  };

  const handleDeletePlan = (planId) => {
    savePlans(plans.filter(p => p.id !== planId));
  };

  const handleTogglePlanComplete = (planId) => {
    savePlans(plans.map(p =>
      p.id === planId ? { ...p, completed: !p.completed } : p
    ));
  };

  const getWeekStreak = () => {
    const today = new Date();
    const weekDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
      weekDays.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        marked: streakData[dateStr]?.marked || false
      });
    }

    return weekDays;
  };

  return (
    <div className="space-y-6">
      {/* Streak Tracker */}
      <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-6 border border-orange-700/50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Flame className="text-orange-400" size={32} fill="currentColor" />
            <div>
              <h3 className="text-xl font-bold text-orange-400">Current Streak</h3>
              <p className="text-orange-200 text-sm">Keep the fire burning!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-orange-400">{userData?.currentStreak || 0}</div>
            <div className="text-orange-200 text-sm">days</div>
          </div>
        </div>

        {/* Weekly Streak Visual */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {getWeekStreak().map((day) => (
            <div key={day.date} className="text-center">
              <div className="text-xs text-slate-400 mb-1">{day.day}</div>
              <div
                className={`aspect-square rounded-lg flex items-center justify-center ${
                  day.marked
                    ? 'bg-orange-500 border-2 border-orange-400'
                    : 'bg-slate-700 border-2 border-slate-600'
                }`}
              >
                {day.marked && <Flame size={16} className="text-white" fill="currentColor" />}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Learning Plans */}
      <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Target className="text-blue-400" size={28} />
            <div>
              <h3 className="text-xl font-bold text-blue-400">Learning Plans</h3>
              <p className="text-slate-300 text-sm">Set goals and track your progress</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddPlan(!showAddPlan)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            {showAddPlan ? <X size={20} /> : <Plus size={20} />}
            {showAddPlan ? 'Cancel' : 'Add Plan'}
          </button>
        </div>

        {/* Add Plan Form */}
        {showAddPlan && (
          <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-600">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  placeholder="e.g., Master 50 verses in 30 days"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Quiz Type
                </label>
                <select
                  value={newPlan.quizType}
                  onChange={(e) => setNewPlan({ ...newPlan, quizType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  {quizTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Days per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={newPlan.daysPerWeek}
                    onChange={(e) => setNewPlan({ ...newPlan, daysPerWeek: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newPlan.targetDate}
                    onChange={(e) => setNewPlan({ ...newPlan, targetDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddPlan}
                disabled={!newPlan.title.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Plan
              </button>
            </div>
          </div>
        )}

        {/* Plans List */}
        <div className="space-y-3">
          {plans.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Target className="mx-auto mb-3 opacity-50" size={48} />
              <p>No learning plans yet. Create one to get started!</p>
            </div>
          ) : (
            plans.map(plan => (
              <div
                key={plan.id}
                className={`bg-slate-800 rounded-lg p-4 border-2 transition-all ${
                  plan.completed
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-slate-600 hover:border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg ${plan.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                      {plan.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">
                        {quizTypes.find(t => t.value === plan.quizType)?.label}
                      </span>
                      <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                        {plan.daysPerWeek} days/week
                      </span>
                      {plan.targetDate && (
                        <span className="text-xs bg-amber-600/30 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(plan.targetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTogglePlanComplete(plan.id)}
                      className={`p-2 rounded-lg transition-all ${
                        plan.completed
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                      title={plan.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all"
                      title="Delete plan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlan;
