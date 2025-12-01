import React, { useState, useEffect } from 'react';
import { Trophy, Award, ChevronRight, Star, Zap, Target } from 'lucide-react';
import beginnerQuestions from '../data/Bible_Trivia_3_Levels_750plus_Questions/beginner_trivia.json';
import intermediateQuestions from '../data/Bible_Trivia_3_Levels_750plus_Questions/intermediate_trivia.json';
import advancedQuestions from '../data/Bible_Trivia_3_Levels_750plus_Questions/advanced_trivia.json';

const BibleTrivia = ({ onComplete, userLevel = 'Beginner' }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionsToAsk, setQuestionsToAsk] = useState([]);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [fastAnswers, setFastAnswers] = useState(0);

  const QUESTIONS_PER_ROUND = 10;
  const FAST_ANSWER_THRESHOLD = 5000; // 5 seconds

  const difficultyLevels = {
    beginner: {
      label: 'Beginner',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      questions: beginnerQuestions,
      bonusMultiplier: 1.0,
      description: '250 questions - Perfect for getting started!'
    },
    intermediate: {
      label: 'Intermediate',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      questions: intermediateQuestions,
      bonusMultiplier: 1.5,
      description: '250 questions - Test your Bible knowledge!'
    },
    advanced: {
      label: 'Advanced',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      questions: advancedQuestions,
      bonusMultiplier: 2.0,
      description: '250+ questions - Challenge yourself!'
    }
  };

  const selectDifficulty = (level) => {
    setDifficulty(level);
    const questions = difficultyLevels[level].questions;
    // Shuffle and select random questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestionsToAsk(shuffled.slice(0, QUESTIONS_PER_ROUND));
    setQuizStarted(true);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const currentQuestion = questionsToAsk[currentQuestionIndex];

  const handleAnswer = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.answer;
    const questionTime = Date.now() - questionStartTime;

    if (isCorrect) {
      setScore(score + 1);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));

      if (questionTime < FAST_ANSWER_THRESHOLD) {
        setFastAnswers(fastAnswers + 1);
      }
    } else {
      setCorrectStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsToAsk.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(Date.now());
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalTime = Date.now() - startTime;
    const avgTimePerQuestion = totalTime / questionsToAsk.length;

    const results = {
      score: score,
      total: questionsToAsk.length,
      percentage: Math.round((score / questionsToAsk.length) * 100),
      difficulty: difficulty,
      bonusMultiplier: difficultyLevels[difficulty].bonusMultiplier,
      maxStreak: maxStreak,
      fastAnswers: fastAnswers,
      totalTime: totalTime,
      avgTimePerQuestion: avgTimePerQuestion,
      isPerfect: score === questionsToAsk.length
    };

    onComplete(results);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Bible Trivia Challenge
            </h1>
            <p className="text-xl text-blue-200">
              Earn BONUS POINTS by testing your Bible knowledge!
            </p>
            <div className="mt-4 bg-blue-800/30 rounded-lg p-4 inline-block">
              <p className="text-lg">
                <span className="text-yellow-400 font-bold">750+ Questions</span> across 3 difficulty levels
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(difficultyLevels).map(([key, level]) => (
              <button
                key={key}
                onClick={() => selectDifficulty(key)}
                className={`${level.color} ${level.hoverColor} rounded-xl p-8 transform transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="flex justify-center mb-4">
                  {level.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2">{level.label}</h2>
                <p className="text-sm mb-4 opacity-90">{level.description}</p>
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold">Bonus Multiplier</p>
                  <p className="text-3xl font-bold">{level.bonusMultiplier}x</p>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <span>Start Challenge</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-400" />
              How Bonus Points Work
            </h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Base points awarded for each correct answer</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Difficulty multiplier increases your score (1x, 1.5x, or 2x)</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Perfect score bonus: +50% points for 100% correct</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Speed bonus: Extra points for quick answers</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Streak bonus: Bonus for consecutive correct answers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-6 flex items-center justify-center">
      <div className="text-2xl">Loading questions...</div>
    </div>;
  }

  const isMultipleChoice = currentQuestion.type === 'multiple_choice';
  const progress = ((currentQuestionIndex + 1) / questionsToAsk.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {difficultyLevels[difficulty].icon}
                <span className="ml-2">{difficultyLevels[difficulty].label} Trivia</span>
              </h2>
              <p className="text-blue-200">Question {currentQuestionIndex + 1} of {questionsToAsk.length}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">{score}</div>
              <div className="text-sm text-blue-200">Score</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-blue-800/30 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Streak indicator */}
          {correctStreak > 1 && (
            <div className="mt-4 bg-orange-500/20 border border-orange-500 rounded-lg p-3 text-center">
              <p className="text-orange-300 font-bold">
                🔥 {correctStreak} Correct in a Row! 🔥
              </p>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-xl p-8 mb-6 backdrop-blur-sm border border-blue-500/30">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{currentQuestion.question}</h3>
            {currentQuestion.reference && (
              <p className="text-blue-300 text-sm">Reference: {currentQuestion.reference}</p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {isMultipleChoice ? (
              currentQuestion.choices.map((choice, index) => {
                const isSelected = selectedAnswer === choice;
                const isCorrect = choice === currentQuestion.answer;

                let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";

                if (showResult) {
                  if (isCorrect) {
                    buttonClass += "bg-green-500/30 border-green-500 text-white";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "bg-red-500/30 border-red-500 text-white";
                  } else {
                    buttonClass += "bg-blue-800/30 border-blue-700/50 text-gray-300";
                  }
                } else {
                  buttonClass += "bg-blue-800/30 border-blue-700 hover:bg-blue-700/50 hover:border-blue-500";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{choice}</span>
                      {showResult && isCorrect && <span className="text-2xl">✓</span>}
                      {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                    </div>
                  </button>
                );
              })
            ) : (
              // True/False questions
              <div className="grid grid-cols-2 gap-4">
                {['True', 'False'].map((choice) => {
                  const isSelected = selectedAnswer === choice;
                  const isCorrect = choice === currentQuestion.answer;

                  let buttonClass = "p-6 rounded-lg border-2 transition-all duration-200 text-xl font-bold ";

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "bg-green-500/30 border-green-500 text-white";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-500/30 border-red-500 text-white";
                    } else {
                      buttonClass += "bg-blue-800/30 border-blue-700/50 text-gray-300";
                    }
                  } else {
                    buttonClass += "bg-blue-800/30 border-blue-700 hover:bg-blue-700/50 hover:border-blue-500";
                  }

                  return (
                    <button
                      key={choice}
                      onClick={() => handleAnswer(choice)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <div className="flex flex-col items-center">
                        <span>{choice}</span>
                        {showResult && isCorrect && <span className="text-2xl mt-2">✓</span>}
                        {showResult && isSelected && !isCorrect && <span className="text-2xl mt-2">✗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Next button */}
          {showResult && (
            <div className="mt-6">
              <button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 flex items-center justify-center"
              >
                {currentQuestionIndex < questionsToAsk.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Stats footer */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-800/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{correctStreak}</div>
            <div className="text-sm text-blue-200">Current Streak</div>
          </div>
          <div className="bg-blue-800/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{maxStreak}</div>
            <div className="text-sm text-blue-200">Best Streak</div>
          </div>
          <div className="bg-blue-800/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{fastAnswers}</div>
            <div className="text-sm text-blue-200">Quick Answers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleTrivia;
