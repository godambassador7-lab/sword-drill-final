import React, { useState } from 'react';
import { Trophy, Clock, Zap, BookOpen, ArrowLeft, Star, Target, Award } from 'lucide-react';

const ChallengeLadders = ({ onBack, userData, setUserData, onStartQuiz }) => {
  const [selectedLadder, setSelectedLadder] = useState(null);
  const [currentRung, setCurrentRung] = useState(0);
  const [ladderProgress, setLadderProgress] = useState({});

  // Define challenge ladders
  const LADDERS = {
    gospels: {
      id: 'gospels',
      title: 'Gospels Ladder',
      icon: '✝️',
      color: 'from-blue-500 to-cyan-500',
      badge: '👑 Gospel Master',
      rungs: [
        { level: 1, time: 60, points: 50, verses: ['Matthew', 'Mark'] },
        { level: 2, time: 50, points: 75, verses: ['Luke', 'John'] },
        { level: 3, time: 40, points: 100, verses: ['Matthew', 'Mark', 'Luke'] },
        { level: 4, time: 35, points: 150, verses: ['All Gospels'] },
        { level: 5, time: 30, points: 250, verses: ['All Gospels - Hard Mode'] }
      ]
    },
    torah: {
      id: 'torah',
      title: 'Torah Ladder',
      icon: '📜',
      color: 'from-amber-500 to-orange-500',
      badge: '⚡ Torah Scholar',
      rungs: [
        { level: 1, time: 60, points: 50, verses: ['Genesis'] },
        { level: 2, time: 50, points: 75, verses: ['Exodus'] },
        { level: 3, time: 45, points: 100, verses: ['Leviticus'] },
        { level: 4, time: 40, points: 150, verses: ['Numbers', 'Deuteronomy'] },
        { level: 5, time: 30, points: 250, verses: ['Full Torah'] }
      ]
    },
    wisdom: {
      id: 'wisdom',
      title: 'Wisdom Literature Ladder',
      icon: '💡',
      color: 'from-purple-500 to-pink-500',
      badge: '🦉 Sage of Wisdom',
      rungs: [
        { level: 1, time: 60, points: 50, verses: ['Proverbs'] },
        { level: 2, time: 50, points: 75, verses: ['Psalms'] },
        { level: 3, time: 45, points: 100, verses: ['Ecclesiastes'] },
        { level: 4, time: 40, points: 150, verses: ['Job', 'Song of Solomon'] },
        { level: 5, time: 30, points: 250, verses: ['All Wisdom Books'] }
      ]
    },
    epistles: {
      id: 'epistles',
      title: 'Epistles Ladder',
      icon: '✉️',
      color: 'from-green-500 to-teal-500',
      badge: '📨 Epistle Expert',
      rungs: [
        { level: 1, time: 60, points: 50, verses: ['Romans', '1 Corinthians'] },
        { level: 2, time: 50, points: 75, verses: ['2 Corinthians', 'Galatians'] },
        { level: 3, time: 45, points: 100, verses: ['Ephesians', 'Philippians', 'Colossians'] },
        { level: 4, time: 40, points: 150, verses: ['Thessalonians', 'Timothy', 'Titus'] },
        { level: 5, time: 30, points: 250, verses: ['All Epistles'] }
      ]
    }
  };

  // Load ladder progress from localStorage
  React.useEffect(() => {
    const savedProgress = localStorage.getItem('challengeLadderProgress');
    if (savedProgress) {
      setLadderProgress(JSON.parse(savedProgress));
    }
  }, []);

  const startRung = (ladder, rungIndex) => {
    setSelectedLadder(ladder);
    setCurrentRung(rungIndex);

    // Start quiz with timer
    if (onStartQuiz) {
      const rung = ladder.rungs[rungIndex];
      onStartQuiz({
        type: 'ladder-challenge',
        ladder: ladder.id,
        rung: rungIndex,
        timeLimit: rung.time,
        pointReward: rung.points
      });
    }
  };

  const completeRung = (ladderId, rungIndex) => {
    const newProgress = { ...ladderProgress };
    if (!newProgress[ladderId]) {
      newProgress[ladderId] = { completedRungs: [] };
    }
    if (!newProgress[ladderId].completedRungs.includes(rungIndex)) {
      newProgress[ladderId].completedRungs.push(rungIndex);
      setLadderProgress(newProgress);
      localStorage.setItem('challengeLadderProgress', JSON.stringify(newProgress));
    }
  };

  const isRungUnlocked = (ladderId, rungIndex) => {
    if (rungIndex === 0) return true;
    const progress = ladderProgress[ladderId];
    if (!progress) return false;
    return progress.completedRungs.includes(rungIndex - 1);
  };

  const isLadderComplete = (ladderId) => {
    const progress = ladderProgress[ladderId];
    if (!progress) return false;
    const ladder = LADDERS[ladderId];
    return progress.completedRungs.length === ladder.rungs.length;
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
            Challenge Ladders
          </h1>
          <p className="text-xl text-slate-300">
            Climb themed ladders with escalating difficulty and earn exclusive badges!
          </p>
        </div>

        {/* How It Works Explanation */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border-2 border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Target size={28} className="text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-400">How Challenge Ladders Work</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-400" />
                What Are Challenge Ladders?
              </h3>
              <p className="text-sm mb-3">
                Challenge Ladders are themed quiz progressions that test your knowledge of specific Bible sections. Each ladder has 5 levels (called "rungs") that increase in difficulty as you climb.
              </p>

              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Trophy size={20} className="text-amber-400" />
                How to Progress
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Start with <span className="text-amber-400 font-bold">Level 1</span> (always unlocked)</li>
                <li>Complete the quiz to unlock the next level</li>
                <li>Each level must be completed in order</li>
                <li>Levels get harder with less time and more content</li>
                <li>Complete all 5 levels to earn an exclusive badge!</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Clock size={20} className="text-blue-400" />
                Time Limits & Points
              </h3>
              <p className="text-sm mb-3">
                Each rung has a time limit (shown in blue) that decreases as you climb. Higher levels give more points (shown in gold) but are more challenging!
              </p>

              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Award size={20} className="text-pink-400" />
                Rewards
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><span className="text-amber-400 font-bold">Points:</span> 50-250 per level</li>
                <li><span className="text-green-400 font-bold">Progress:</span> Track your completion</li>
                <li><span className="text-purple-400 font-bold">Badges:</span> Earn exclusive titles for completing all rungs</li>
                <li><span className="text-blue-400 font-bold">Knowledge:</span> Master entire sections of Scripture!</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-600/10 rounded-lg border border-purple-500/30">
            <p className="text-sm text-center text-purple-200">
              <span className="font-bold">Pro Tip:</span> Green rungs are completed ✓ | Bright rungs are unlocked and ready to play | Dimmed rungs are locked until you complete the previous level
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(LADDERS).map(ladder => {
            const progress = ladderProgress[ladder.id];
            const completedRungs = progress?.completedRungs?.length || 0;
            const totalRungs = ladder.rungs.length;
            const isComplete = isLadderComplete(ladder.id);

            return (
              <div
                key={ladder.id}
                className={`bg-gradient-to-br ${ladder.color} bg-opacity-10 border-2 rounded-2xl p-6 ${
                  isComplete ? 'border-amber-500' : 'border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{ladder.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{ladder.title}</h2>
                      <p className="text-slate-300 text-sm">
                        {completedRungs}/{totalRungs} Rungs Complete
                      </p>
                    </div>
                  </div>
                  {isComplete && (
                    <div className="bg-amber-600/20 border border-amber-500 rounded-lg px-3 py-2">
                      <Trophy size={24} className="text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${ladder.color} transition-all duration-500`}
                      style={{ width: `${(completedRungs / totalRungs) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Rungs */}
                <div className="space-y-2">
                  {ladder.rungs.map((rung, index) => {
                    const isCompleted = progress?.completedRungs?.includes(index);
                    const isUnlocked = isRungUnlocked(ladder.id, index);

                    return (
                      <button
                        key={index}
                        onClick={() => isUnlocked && startRung(ladder, index)}
                        disabled={!isUnlocked}
                        className={`w-full text-left rounded-lg p-3 border-2 transition-all ${
                          isCompleted
                            ? 'bg-green-600/20 border-green-500'
                            : isUnlocked
                            ? 'bg-slate-700/50 border-slate-600 hover:border-amber-500'
                            : 'bg-slate-800/30 border-slate-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-400">Level {rung.level}</span>
                              {isCompleted && <Star size={16} className="text-green-400" />}
                            </div>
                            <div className="text-sm text-slate-300">
                              {rung.verses.join(', ')}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock size={16} className="text-blue-400" />
                              <span className="text-blue-400">{rung.time}s</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Zap size={16} className="text-amber-400" />
                              <span className="text-amber-400">+{rung.points}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Badge Display */}
                {isComplete && (
                  <div className="mt-4 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500 rounded-lg p-3 text-center">
                    <Award size={24} className="text-amber-400 mx-auto mb-2" />
                    <p className="text-amber-400 font-bold">{ladder.badge}</p>
                    <p className="text-xs text-slate-400">Badge Earned!</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChallengeLadders;
