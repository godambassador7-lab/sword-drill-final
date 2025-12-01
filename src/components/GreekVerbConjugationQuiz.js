import React, { useState, useEffect } from 'react';
import { verbConjugations } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle, Zap } from 'lucide-react';
import CorrectToast from './CorrectToast';

/**
 * Greek Verb Conjugation Quiz - Tests Present Active Indicative forms
 */
const GreekVerbConjugationQuiz = ({ onComplete, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);

  const totalQuestions = 12;

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const quizQuestions = [];
    const verbs = Object.values(verbConjugations);

    for (let i = 0; i < totalQuestions; i++) {
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const number = Math.random() > 0.5 ? 'singular' : 'plural';
      const persons = ['first', 'second', 'third'];
      const person = persons[Math.floor(Math.random() * persons.length)];

      const questionType = Math.random() > 0.5 ? 'produce' : 'identify';

      if (questionType === 'produce') {
        // Ask for the Greek form
        const correctForm = verb.forms[number][person];
        const question = `Conjugate ${verb.verb} (${verb.meaning}) in ${person} person ${number}:`;
        const correctAnswer = correctForm.greek;

        // Generate wrong answers from other forms of the same verb
        const wrongAnswers = [];
        ['singular', 'plural'].forEach(num => {
          ['first', 'second', 'third'].forEach(pers => {
            const form = verb.forms[num][pers].greek;
            if (form !== correctAnswer && !wrongAnswers.includes(form)) {
              wrongAnswers.push(form);
            }
          });
        });

        const options = [
          correctAnswer,
          ...wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        ].sort(() => Math.random() - 0.5);

        quizQuestions.push({
          question,
          correctAnswer,
          options,
          type: 'produce',
          verb: verb.verb,
          meaning: verb.meaning,
          person,
          number,
          transliteration: correctForm.transliteration,
          english: correctForm.english
        });
      } else {
        // Give Greek form, ask for person/number
        const correctForm = verb.forms[number][person];
        const question = `What person and number is ${correctForm.greek}?`;
        const correctAnswer = `${person} person ${number}`;

        // Generate wrong answers
        const wrongAnswers = [];
        ['singular', 'plural'].forEach(num => {
          ['first', 'second', 'third'].forEach(pers => {
            const answer = `${pers} person ${num}`;
            if (answer !== correctAnswer) {
              wrongAnswers.push(answer);
            }
          });
        });

        const options = [
          correctAnswer,
          ...wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        ].sort(() => Math.random() - 0.5);

        quizQuestions.push({
          question,
          correctAnswer,
          options,
          type: 'identify',
          verb: verb.verb,
          meaning: verb.meaning,
          person,
          number,
          greekForm: correctForm.greek,
          english: correctForm.english
        });
      }
    }

    setQuestions(quizQuestions);
  };

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 100);
      setShowCorrectToast(true);
      setTimeout(() => setShowCorrectToast(false), 1300);
    }

    setTimeout(() => {
      advanceQuestion();
    }, 1500);
  };

  const advanceQuestion = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const percentage = Math.round((score / (totalQuestions * 100)) * 100);
      onComplete({
        score,
        totalQuestions,
        correctAnswers: score / 100,
        percentage,
        quizType: 'verb-conjugation-quiz'
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
      <CorrectToast points={10} show={showCorrectToast} />
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-orange-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-orange-300 flex items-center gap-2">
              <Zap size={28} />
              Verb Conjugation Quiz
            </h2>
            <p className="text-slate-400 text-sm">Present Active Indicative</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Question</div>
            <div className="text-orange-300 text-xl font-bold">
              {currentQuestion + 1}/{totalQuestions}
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Score</div>
            <div className="text-pink-300 text-xl font-bold">{score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-8 mb-6">
          <div className="text-orange-100 text-sm mb-2 uppercase tracking-wide">
            {currentQ.verb} - {currentQ.meaning}
          </div>
          <div className="text-white text-2xl font-bold mb-3">{currentQ.question}</div>
          {currentQ.type === 'produce' && (
            <div className="text-orange-200 text-sm">
              ({currentQ.transliteration}) = {currentQ.english}
            </div>
          )}
          {currentQ.type === 'identify' && (
            <div className="text-orange-200 text-sm">
              Meaning: {currentQ.english}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQ.correctAnswer;

            let buttonClass = "p-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ";

            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonClass += "bg-green-600 text-white border-2 border-green-400";
              } else if (isSelected) {
                buttonClass += "bg-red-600 text-white border-2 border-red-400";
              } else {
                buttonClass += "bg-slate-700 text-slate-400 cursor-not-allowed";
              }
            } else {
              buttonClass += "bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-orange-500";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-center gap-2">
                  {option}
                  {showFeedback && isCorrectAnswer && <CheckCircle size={20} />}
                  {showFeedback && isSelected && !isCorrectAnswer && <XCircle size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
            {isCorrect ? (
              <p className="font-semibold text-lg">
                Excellent! +100 points
              </p>
            ) : (
              <div>
                <p className="font-semibold text-lg mb-2">Incorrect</p>
                <p className="text-sm">
                  Correct answer: <span className="font-bold">{currentQ.correctAnswer}</span>
                  {currentQ.type === 'identify' && ` (${currentQ.english})`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekVerbConjugationQuiz;
