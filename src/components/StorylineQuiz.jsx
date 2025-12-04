import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Star, ArrowLeft, CheckCircle, XCircle, Zap } from 'lucide-react';

const StorylineQuiz = ({ onComplete, onBack, userLevel = 'Beginner' }) => {
  const [metadata, setMetadata] = useState(null);
  const [availablePacks, setAvailablePacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [userOrder, setUserOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load metadata and discover available packs
  useEffect(() => {
    const metadataUrl = `${process.env.PUBLIC_URL || ''}/storyline_quiz_with_gospels/metadata.json`;

    fetch(metadataUrl)
      .then(res => res.json())
      .then(data => {
        setMetadata(data);
        discoverPacks(userLevel);
      })
      .catch(err => {
        console.error('Error loading storyline quiz metadata:', err);
        setLoading(false);
      });
  }, [userLevel]);

  const discoverPacks = async (difficulty) => {
    const difficultyFolders = {
      'Beginner': 'beginner',
      'Intermediate': 'intermediate',
      'Advanced': 'advanced',
      'Elite': 'legendary',
      'Eli Challenge': 'legendary'
    };

    const folder = difficultyFolders[difficulty] || 'beginner';
    const packs = [];

    // Try to load up to 8 packs for the difficulty
    for (let i = 1; i <= 8; i++) {
      const packId = folder === 'legendary' ? `L-00${i}` :
                     folder === 'advanced' ? `A-00${i}` :
                     folder === 'intermediate' ? `I-00${i}` : `B-00${i}`;

      const packUrl = `${process.env.PUBLIC_URL || ''}/storyline_quiz_with_gospels/packs/${folder}/${packId}.json`;

      try {
        const res = await fetch(packUrl);
        if (res.ok) {
          const data = await res.json();
          packs.push({ id: packId, ...data });
        }
      } catch (err) {
        // Pack doesn't exist, continue
      }
    }

    // Also load Gospel packs
    const gospelPrefixes = {
      'Beginner': 'GOS-B',
      'Intermediate': 'GOS-I',
      'Advanced': 'GOS-A',
      'Elite': 'GOS-L',
      'Eli Challenge': 'GOS-L'
    };

    const gospelPrefix = gospelPrefixes[difficulty] || 'GOS-B';
    for (let i = 1; i <= 3; i++) {
      const packId = `${gospelPrefix}-00${i}`;
      const packUrl = `${process.env.PUBLIC_URL || ''}/storyline_quiz_with_gospels/packs/gospels/${packId}.json`;

      try {
        const res = await fetch(packUrl);
        if (res.ok) {
          const data = await res.json();
          packs.push({ id: packId, ...data });
        }
      } catch (err) {
        // Pack doesn't exist
      }
    }

    setAvailablePacks(packs);
    setLoading(false);
  };

  const startQuiz = (pack) => {
    setSelectedPack(pack);
    setQuizData(pack);
    setUserOrder([...pack.events].sort(() => Math.random() - 0.5)); // Shuffle

    const profile = metadata.difficultyProfiles[pack.difficulty];
    setTimeLeft(profile.maxTimeSeconds);
    setScore(0);
    setShowResults(false);
  };

  // Timer countdown
  useEffect(() => {
    if (quizData && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, quizData, showResults]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newOrder = [...userOrder];
    const draggedEvent = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(index, 0, draggedEvent);

    setDraggedItem(index);
    setUserOrder(newOrder);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    if (!quizData) return;

    const profile = metadata.difficultyProfiles[quizData.difficulty];
    let totalScore = 0;
    let perfectCount = 0;

    // Calculate score based on correctness
    userOrder.forEach((event, index) => {
      if (event.correctIndex === index) {
        totalScore += profile.basePointsPerCorrect;
        perfectCount++;
      } else if (Math.abs(event.correctIndex - index) === 1) {
        // Near miss
        totalScore += profile.nearMissPoints;
      } else if (Math.abs(event.correctIndex - index) <= 2) {
        // Half correct
        totalScore += profile.halfCorrectPoints;
      }
    });

    // Perfect bonus
    if (perfectCount === quizData.events.length) {
      totalScore += profile.perfectBonus;
    }

    // Time bonus
    if (metadata.uiConfig.timerMode.enabled) {
      const percentTimeLeft = timeLeft / profile.maxTimeSeconds;
      metadata.uiConfig.timerMode.bonusThresholds.forEach(threshold => {
        if (percentTimeLeft >= threshold.percentTimeLeft) {
          totalScore += threshold.bonusPoints;
        }
      });
    }

    setScore(totalScore);
    setShowResults(true);

    // Report completion
    if (onComplete) {
      onComplete({
        type: 'storyline-quiz',
        packId: quizData.id,
        score: totalScore,
        perfect: perfectCount === quizData.events.length,
        timeLeft: timeLeft
      });
    }
  };

  const handleBackToMenu = () => {
    setSelectedPack(null);
    setQuizData(null);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-purple-300 text-xl">Loading Storyline Quizzes...</div>
      </div>
    );
  }

  // Results view
  if (showResults && quizData) {
    const profile = metadata.difficultyProfiles[quizData.difficulty];
    const maxPossibleScore = (profile.basePointsPerCorrect * quizData.events.length) +
                             profile.perfectBonus + 50; // Max time bonus

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500 max-w-2xl w-full">
          <div className="text-center mb-6">
            <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
            <h2 className="text-3xl font-bold text-purple-400 mb-2">Quiz Complete!</h2>
            <p className="text-slate-300 mb-4">{quizData.title}</p>

            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
              {score} Points
            </div>
            <div className="text-slate-400 text-sm">
              Out of ~{maxPossibleScore} possible
            </div>
          </div>

          {/* Correct Order */}
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
            <h3 className="text-purple-400 font-bold mb-3">Correct Order:</h3>
            <ol className="space-y-2">
              {quizData.events.map((event, idx) => (
                <li key={event.id} className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">{idx + 1}.</span>
                  <span className="text-slate-200">{event.text}</span>
                  {userOrder.findIndex(e => e.id === event.id) === idx && (
                    <CheckCircle className="text-green-400 ml-auto" size={20} />
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleBackToMenu}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              Try Another
            </button>
            <button
              onClick={onBack}
              className="w-full bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-600 transition-all"
            >
              Exit to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz active view
  if (quizData) {
    const profile = metadata.difficultyProfiles[quizData.difficulty];
    const timePercent = (timeLeft / profile.maxTimeSeconds) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToMenu}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-purple-300">
                <Clock size={20} />
                <span className="font-mono font-bold text-lg">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star size={20} />
                <span className="font-bold">{score}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-purple-400 mb-2">{quizData.title}</h2>
            <p className="text-slate-300">{quizData.reference}</p>
            <p className="text-purple-300 text-sm mt-2">
              Drag and drop events into the correct chronological order
            </p>
          </div>

          {/* Time bar */}
          <div className="mb-6">
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timePercent > 50 ? 'bg-green-500' :
                  timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>

          {/* Draggable Events */}
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-purple-500">
            <div className="space-y-3">
              {userOrder.map((event, index) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  className={`bg-slate-700 rounded-xl p-4 cursor-move border-2 transition-all ${
                    draggedItem === index
                      ? 'border-purple-400 opacity-50'
                      : 'border-slate-600 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-purple-400 min-w-[40px] text-center">
                      {index + 1}
                    </div>
                    <div className="text-slate-200 flex-1">{event.text}</div>
                    <div className="text-slate-500">☰</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pack selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="text-purple-400" size={48} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
              Storyline Quizzes
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Put biblical events in chronological order • Test your timeline knowledge
          </p>
        </div>

        {availablePacks.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            No storyline quizzes available for your level yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availablePacks.map(pack => (
              <div
                key={pack.id}
                onClick={() => startQuiz(pack)}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-purple-500 hover:border-purple-400 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-400">{pack.title}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pack.difficulty === 'Beginner' ? 'bg-green-600/30 text-green-300' :
                    pack.difficulty === 'Intermediate' ? 'bg-blue-600/30 text-blue-300' :
                    pack.difficulty === 'Advanced' ? 'bg-orange-600/30 text-orange-300' :
                    'bg-red-600/30 text-red-300'
                  }`}>
                    {pack.difficulty}
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-4">{pack.reference}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-purple-300">
                    {pack.events.length} events
                  </div>
                  <div className="text-slate-400">
                    {pack.tags?.join(', ')}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} />
                  <span>{metadata.difficultyProfiles[pack.difficulty]?.maxTimeSeconds}s</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorylineQuiz;
