import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Book, Trophy, Zap, Star, Brain, Target } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const BiblicalOrNah = ({ onBack, userId, userData, setUserData }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  const totalPoints = userData?.totalPoints || 0;

  // Load questions for selected difficulty
  useEffect(() => {
    if (!selectedDifficulty) return;

    const loadQuestions = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.PUBLIC_URL || '';
        const fileName = `biblical_or_nah_${selectedDifficulty}.json`;
        const response = await fetch(`${baseUrl}/biblical_or_nah_full_pack/${fileName}`);
        const data = await response.json();

        // Shuffle questions
        const shuffled = [...data.items].sort(() => Math.random() - 0.5);
        setAllQuestions(shuffled);
        setLoading(false);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
      } catch (error) {
        console.error('Error loading Biblical or Nah questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [selectedDifficulty]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.isBiblical;

    if (isCorrect) {
      // Calculate points based on difficulty and speed
      const questionTime = (Date.now() - questionStartTime) / 1000;
      let points = currentQuestion.xpReward || 10;

      // Time bonus for quick answers (under 5 seconds)
      if (questionTime < 5) {
        points += 5;
      }

      // Difficulty multiplier
      if (selectedDifficulty === 'intermediate') {
        points = Math.floor(points * 1.5);
      } else if (selectedDifficulty === 'advanced') {
        points = Math.floor(points * 2);
      }

      setScore(prevScore => prevScore + points);
      setTotalCorrect(prev => prev + 1);
      setStreak(prevStreak => {
        const newStreak = prevStreak + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setQuestionsAnswered(prev => prev + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    setGameComplete(true);

    // Update user data
    if (userId && setUserData) {
      const newTotalPoints = totalPoints + score;

      setUserData(prev => ({
        ...prev,
        totalPoints: newTotalPoints,
        biblicalOrNahStats: {
          gamesPlayed: (prev.biblicalOrNahStats?.gamesPlayed || 0) + 1,
          bestStreak: Math.max(bestStreak, prev.biblicalOrNahStats?.bestStreak || 0),
          totalScore: (prev.biblicalOrNahStats?.totalScore || 0) + score,
          questionsAnswered: (prev.biblicalOrNahStats?.questionsAnswered || 0) + questionsAnswered,
          totalCorrect: (prev.biblicalOrNahStats?.totalCorrect || 0) + totalCorrect
        }
      }));

      updateUserProgress(userId, {
        totalPoints: newTotalPoints,
        biblicalOrNahStats: {
          gamesPlayed: (userData.biblicalOrNahStats?.gamesPlayed || 0) + 1,
          bestStreak: Math.max(bestStreak, userData.biblicalOrNahStats?.bestStreak || 0),
          totalScore: (userData.biblicalOrNahStats?.totalScore || 0) + score,
          questionsAnswered: (userData.biblicalOrNahStats?.questionsAnswered || 0) + questionsAnswered,
          totalCorrect: (userData.biblicalOrNahStats?.totalCorrect || 0) + totalCorrect
        }
      }).catch(err => console.error('Error saving Biblical or Nah stats:', err));
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuestionsAnswered(0);
    setTotalCorrect(0);
    setGameComplete(false);
    setStreak(0);
    setBestStreak(0);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    // Re-shuffle questions
    setAllQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const backToDifficulty = () => {
    setSelectedDifficulty(null);
    setAllQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuestionsAnswered(0);
    setTotalCorrect(0);
    setGameComplete(false);
    setStreak(0);
    setBestStreak(0);
  };

  // Difficulty selection screen
  if (!selectedDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Bonus Quizzes
          </button>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Biblical or Nah?
            </h1>
            <p className="text-xl text-slate-300">Test your knowledge of what's actually in the Bible!</p>
            <p className="text-sm text-slate-400 mt-2">Choose your difficulty level to begin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Beginner */}
            <button
              onClick={() => setSelectedDifficulty('beginner')}
              className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border-2 border-green-500 hover:border-green-400 rounded-2xl p-6 transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Beginner</h3>
              <p className="text-slate-300 text-sm mb-4">
                Start here! Common phrases and well-known sayings.
              </p>
              <div className="flex items-center justify-center gap-2 text-green-300">
                <Target size={16} />
                <span className="text-xs font-semibold">~70 Questions</span>
              </div>
            </button>

            {/* Intermediate */}
            <button
              onClick={() => setSelectedDifficulty('intermediate')}
              className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 hover:from-yellow-600/30 hover:to-amber-600/30 border-2 border-yellow-500 hover:border-yellow-400 rounded-2xl p-6 transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Intermediate</h3>
              <p className="text-slate-300 text-sm mb-4">
                More challenging. Requires deeper Bible knowledge.
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-300">
                <Target size={16} />
                <span className="text-xs font-semibold">~70 Questions</span>
              </div>
              <div className="mt-2 text-amber-300 text-xs font-bold">1.5x Points</div>
            </button>

            {/* Advanced */}
            <button
              onClick={() => setSelectedDifficulty('advanced')}
              className="bg-gradient-to-br from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 border-2 border-red-500 hover:border-red-400 rounded-2xl p-6 transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Advanced</h3>
              <p className="text-slate-300 text-sm mb-4">
                Expert level. Very tricky phrases and obscure references.
              </p>
              <div className="flex items-center justify-center gap-2 text-red-300">
                <Target size={16} />
                <span className="text-xs font-semibold">~70 Questions</span>
              </div>
              <div className="mt-2 text-orange-300 text-xs font-bold">2x Points</div>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-300 mb-3">How to Play</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Read each phrase carefully and decide if it's actually in the Bible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Answer quickly for bonus points (under 5 seconds)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Build your streak for maximum points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Learn the truth behind each phrase with detailed explanations and scripture references</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const accuracy = questionsAnswered > 0 ? Math.round((totalCorrect / questionsAnswered) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={backToDifficulty}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Difficulty Select
          </button>

          <div className="bg-gradient-to-br from-purple-600/20 to-teal-600/20 border-2 border-purple-500 rounded-2xl p-8 text-center">
            <Trophy size={64} className="text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-purple-300 mb-2">
              {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Complete!
            </h2>
            <p className="text-slate-400 mb-6">Great job testing your Bible knowledge!</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-amber-400 text-3xl font-bold">{score}</div>
                <div className="text-slate-300 text-sm">Points Earned</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-green-400 text-3xl font-bold">{totalCorrect}/{questionsAnswered}</div>
                <div className="text-slate-300 text-sm">Correct Answers</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-purple-400 text-3xl font-bold">{bestStreak}</div>
                <div className="text-slate-300 text-sm">Best Streak</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-blue-400 text-3xl font-bold">{accuracy}%</div>
                <div className="text-slate-300 text-sm">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-bold transition-all"
              >
                Play Again ({selectedDifficulty})
              </button>
              <button
                onClick={backToDifficulty}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-bold transition-all"
              >
                Change Difficulty
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-400">No questions available</p>
          <button
            onClick={backToDifficulty}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: { bg: 'bg-green-600/20', text: 'text-green-300', border: 'border-green-500' },
    intermediate: { bg: 'bg-yellow-600/20', text: 'text-yellow-300', border: 'border-yellow-500' },
    advanced: { bg: 'bg-red-600/20', text: 'text-red-300', border: 'border-red-500' }
  };

  const colors = difficultyColors[selectedDifficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={backToDifficulty}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-600/20 px-4 py-2 rounded-lg border border-amber-500/30">
              <Star size={18} className="text-amber-400" />
              <span className="font-bold text-amber-400">{totalPoints + score} pts</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Biblical or Nah?
          </h1>
          <p className={`text-sm font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text} inline-block`}>
            {selectedDifficulty.toUpperCase()} MODE
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-purple-500/30">
            <div className="text-purple-400 font-bold text-2xl">{score}</div>
            <div className="text-slate-400 text-xs">Score</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-purple-500/30">
            <div className="text-green-400 font-bold text-2xl flex items-center justify-center gap-1">
              <Zap size={20} />
              {streak}
            </div>
            <div className="text-slate-400 text-xs">Streak</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-purple-500/30">
            <div className="text-blue-400 font-bold text-2xl">{currentQuestionIndex + 1}/{allQuestions.length}</div>
            <div className="text-slate-400 text-xs">Question</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-8 border-2 border-purple-500/30 mb-6">
          <div className="flex items-start gap-3 mb-6">
            <Brain className="text-purple-400 flex-shrink-0 mt-1" size={28} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-slate-400 text-sm">Category: {currentQuestion.category}</span>
              </div>
              <p className="text-2xl font-bold text-white leading-relaxed">
                "{currentQuestion.saying}"
              </p>
            </div>
          </div>

          {/* Answer Buttons */}
          {!showExplanation && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                disabled={selectedAnswer !== null}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all border-2 border-green-500 hover:border-green-400 disabled:border-slate-600"
              >
                <CheckCircle size={24} className="inline mr-2" />
                Biblical
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={selectedAnswer !== null}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-700 disabled:to-slate-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all border-2 border-red-500 hover:border-red-400 disabled:border-slate-600"
              >
                <XCircle size={24} className="inline mr-2" />
                Nah
              </button>
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                selectedAnswer === currentQuestion.isBiblical
                  ? 'bg-green-600/20 border-green-500'
                  : 'bg-red-600/20 border-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQuestion.isBiblical ? (
                    <CheckCircle size={24} className="text-green-400" />
                  ) : (
                    <XCircle size={24} className="text-red-400" />
                  )}
                  <span className="font-bold text-lg">
                    {selectedAnswer === currentQuestion.isBiblical ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm">
                  This phrase is <strong>{currentQuestion.isBiblical ? 'BIBLICAL' : 'NOT BIBLICAL'}</strong>
                  {currentQuestion.truthType && ` (${currentQuestion.truthType})`}
                </p>
              </div>

              {/* Detailed Explanation */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Book size={18} className="text-purple-400" />
                  <h4 className="font-bold text-purple-300">Explanation</h4>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                {/* Scripture References - Always show for biblical items */}
                {currentQuestion.isBiblical && currentQuestion.scriptureRefs && currentQuestion.scriptureRefs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="text-xs text-slate-400 mb-1">Scripture References:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.scriptureRefs.map((ref, idx) => (
                        <span key={idx} className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded font-mono">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related context for non-biblical items */}
                {!currentQuestion.isBiblical && currentQuestion.scriptureRefs && currentQuestion.scriptureRefs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="text-xs text-slate-400 mb-1">Related Biblical Concepts:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.scriptureRefs.map((ref, idx) => (
                        <span key={idx} className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded font-mono">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg transition-all"
              >
                {currentQuestionIndex < allQuestions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiblicalOrNah;
