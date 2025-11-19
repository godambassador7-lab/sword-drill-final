import React, { useState, useEffect } from 'react';
import { greekAlphabet, koineVocabulary } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle, Award, Clock } from 'lucide-react';

/**
 * Comprehensive Greek Exam
 * Beginner: Alphabet + 50 vocab + articles + translation
 * Intermediate: 40 parsing + 10 translations + 20 vocab + 5 clause analyses
 * Advanced: 8 passages + 50 parsing + 10 discourse + 5 textual criticism
 */
const GreekExam = ({ level = 'beginner', onComplete, onCancel }) => {
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Generate exam questions based on level
  useEffect(() => {
    generateExam();
  }, [level]);

  const generateExam = () => {
    let questions = [];

    if (level === 'beginner') {
      // Beginner Exam: Alphabet (10) + Vocabulary (50) + Articles (5) + Translation (5)
      questions = [
        ...generateAlphabetQuestions(10),
        ...generateVocabularyQuestions('beginner', 50),
        ...generateArticleQuestions(5),
        ...generateTranslationQuestions('beginner', 5)
      ];
    } else if (level === 'intermediate') {
      // Intermediate Exam: Parsing (40) + Translation (10) + Vocabulary (20) + Clause Analysis (5)
      questions = [
        ...generateParsingQuestions(40),
        ...generateTranslationQuestions('intermediate', 10),
        ...generateVocabularyQuestions('intermediate', 20),
        ...generateClauseQuestions(5)
      ];
    } else if (level === 'advanced') {
      // Advanced Exam: Passages (8) + Parsing (50) + Discourse (10) + Textual Criticism (5)
      questions = [
        ...generatePassageQuestions(8),
        ...generateParsingQuestions(50),
        ...generateDiscourseQuestions(10),
        ...generateTextualCriticismQuestions(5)
      ];
    }

    setExamQuestions(questions);
  };

  // Question generators
  const generateAlphabetQuestions = (count) => {
    const shuffled = [...greekAlphabet].sort(() => Math.random() - 0.5).slice(0, count);
    return shuffled.map((letter, i) => ({
      id: `alphabet-${i}`,
      type: 'alphabet',
      question: `What is the name of the letter ${letter.letter}?`,
      options: [letter.name, ...getRandomLetterNames(letter.name, 3)].sort(() => Math.random() - 0.5),
      correctAnswer: letter.name,
      points: 2
    }));
  };

  const generateVocabularyQuestions = (lvl, count) => {
    const vocab = koineVocabulary[lvl] || koineVocabulary.beginner;
    const shuffled = [...vocab].sort(() => Math.random() - 0.5).slice(0, count);

    return shuffled.map((word, i) => ({
      id: `vocab-${i}`,
      type: 'vocabulary',
      question: `What does ${word.greek} mean?`,
      hint: word.transliteration,
      options: [word.english, ...getRandomEnglishWords(word.english, vocab, 3)].sort(() => Math.random() - 0.5),
      correctAnswer: word.english,
      points: 2
    }));
  };

  const generateArticleQuestions = (count) => {
    const articles = [
      { greek: 'ὁ', meaning: 'the (masculine)', gender: 'masculine', case: 'nominative' },
      { greek: 'ἡ', meaning: 'the (feminine)', gender: 'feminine', case: 'nominative' },
      { greek: 'τό', meaning: 'the (neuter)', gender: 'neuter', case: 'nominative' },
      { greek: 'τόν', meaning: 'the (masculine accusative)', gender: 'masculine', case: 'accusative' },
      { greek: 'τήν', meaning: 'the (feminine accusative)', gender: 'feminine', case: 'accusative' }
    ];

    return articles.slice(0, count).map((article, i) => ({
      id: `article-${i}`,
      type: 'article',
      question: `What gender and case is ${article.greek}?`,
      options: [article.meaning, ...articles.filter(a => a.greek !== article.greek).map(a => a.meaning).slice(0, 3)].sort(() => Math.random() - 0.5),
      correctAnswer: article.meaning,
      points: 3
    }));
  };

  const generateTranslationQuestions = (lvl, count) => {
    const sentences = {
      beginner: [
        { greek: 'ὁ θεὸς ἀγάπη ἐστίν', english: 'God is love', reference: '1 John 4:8' },
        { greek: 'ὁ λόγος τοῦ θεοῦ', english: 'the word of God', reference: '' },
        { greek: 'ἐν ἀρχῇ ἦν ὁ λόγος', english: 'In the beginning was the Word', reference: 'John 1:1' },
        { greek: 'ἡ ἀγάπη τοῦ Χριστοῦ', english: 'the love of Christ', reference: '' },
        { greek: 'τὸ εὐαγγέλιον τῆς χάριτος', english: 'the gospel of grace', reference: '' }
      ],
      intermediate: [
        { greek: 'ὁ πιστεύων εἰς τὸν υἱὸν ἔχει ζωὴν αἰώνιον', english: 'The one believing in the Son has eternal life', reference: 'John 3:36' },
        { greek: 'ἡ χάρις τοῦ κυρίου μεθ\' ὑμῶν', english: 'The grace of the Lord be with you', reference: '' }
      ]
    };

    const levelSentences = sentences[lvl] || sentences.beginner;
    const selected = levelSentences.slice(0, count);

    return selected.map((sent, i) => ({
      id: `translation-${i}`,
      type: 'translation',
      question: `Translate: ${sent.greek}`,
      reference: sent.reference,
      options: [sent.english, ...getRandomTranslations(sent.english, 3)].sort(() => Math.random() - 0.5),
      correctAnswer: sent.english,
      points: 5
    }));
  };

  const generateParsingQuestions = (count) => {
    // Sample parsing questions (would be expanded with real data)
    const samples = [
      { word: 'λόγος', parsing: 'Nominative Singular Masculine', category: 'noun' },
      { word: 'λέγω', parsing: 'Present Active Indicative 1st Person Singular', category: 'verb' }
    ];

    return Array(count).fill(null).map((_, i) => {
      const sample = samples[i % samples.length];
      return {
        id: `parsing-${i}`,
        type: 'parsing',
        question: `Parse: ${sample.word}`,
        options: [sample.parsing, 'Genitive Plural Feminine', 'Aorist Middle Participle', 'Dative Singular Neuter'].sort(() => Math.random() - 0.5),
        correctAnswer: sample.parsing,
        points: 3
      };
    });
  };

  const generateClauseQuestions = (count) => {
    return Array(count).fill(null).map((_, i) => ({
      id: `clause-${i}`,
      type: 'clause',
      question: 'Identify the clause type: ἵνα + subjunctive',
      options: ['Purpose clause', 'Result clause', 'Causal clause', 'Temporal clause'].sort(() => Math.random() - 0.5),
      correctAnswer: 'Purpose clause',
      points: 4
    }));
  };

  const generatePassageQuestions = (count) => {
    return Array(count).fill(null).map((_, i) => ({
      id: `passage-${i}`,
      type: 'passage',
      question: 'Translate the passage from John 1:1-5',
      userInput: true,
      correctAnswer: 'Sample translation',
      points: 10
    }));
  };

  const generateDiscourseQuestions = (count) => {
    return Array(count).fill(null).map((_, i) => ({
      id: `discourse-${i}`,
      type: 'discourse',
      question: 'Identify the theme development in Romans 8',
      userInput: true,
      correctAnswer: 'Life in the Spirit',
      points: 8
    }));
  };

  const generateTextualCriticismQuestions = (count) => {
    return Array(count).fill(null).map((_, i) => ({
      id: `textual-${i}`,
      type: 'textual',
      question: 'Which manuscript family does Codex Sinaiticus belong to?',
      options: ['Alexandrian', 'Byzantine', 'Western', 'Caesarean'].sort(() => Math.random() - 0.5),
      correctAnswer: 'Alexandrian',
      points: 5
    }));
  };

  // Helper functions
  const getRandomLetterNames = (exclude, count) => {
    return greekAlphabet
      .filter(l => l.name !== exclude)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(l => l.name);
  };

  const getRandomEnglishWords = (exclude, vocab, count) => {
    return vocab
      .filter(w => w.english !== exclude)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(w => w.english);
  };

  const getRandomTranslations = (exclude, count) => {
    const wrong = [
      'The Word was with God',
      'Love never fails',
      'Faith, hope, and love',
      'The grace of God'
    ];
    return wrong.filter(t => t !== exclude).slice(0, count);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmitExam = () => {
    let totalScore = 0;
    let correctCount = 0;

    examQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += q.points;
        correctCount++;
      }
    });

    setScore(totalScore);
    setIsSubmitted(true);
  };

  const handleCompleteExam = () => {
    const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70;

    onComplete({
      score,
      maxScore,
      percentage,
      passed,
      correctCount: Object.values(answers).filter((a, i) => a === examQuestions[i]?.correctAnswer).length,
      totalQuestions: examQuestions.length,
      timeElapsed,
      level
    });
  };

  if (examQuestions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Preparing exam...</div>
      </div>
    );
  }

  const currentQ = examQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;
  const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);

  // Results Screen
  if (isSubmitted) {
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70;

    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-indigo-500/30">
          <div className="text-center">
            <div className={`inline-flex p-6 rounded-full mb-6 ${passed ? 'bg-green-600/20' : 'bg-orange-600/20'}`}>
              <Award size={64} className={passed ? 'text-green-400' : 'text-orange-400'} />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Exam Complete!</h2>
            <p className="text-slate-400 mb-6 capitalize">{level} Level Exam</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-6">
                <div className="text-slate-400 text-sm mb-2">Final Score</div>
                <div className="text-4xl font-bold text-indigo-300">{score}/{maxScore}</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-6">
                <div className="text-slate-400 text-sm mb-2">Percentage</div>
                <div className={`text-4xl font-bold ${passed ? 'text-green-400' : 'text-orange-400'}`}>
                  {percentage}%
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-6 ${passed ? 'bg-green-600/20 text-green-300' : 'bg-orange-600/20 text-orange-300'}`}>
              <p className="font-semibold">
                {passed ? '🎉 Congratulations! You passed!' : '📚 Keep studying and try again!'}
              </p>
              <p className="text-sm mt-1">
                Time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
              </p>
            </div>

            <button
              onClick={handleCompleteExam}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Complete Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Question Screen
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-3xl w-full border-2 border-purple-500/30 my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-300">Greek Exam</h2>
            <p className="text-slate-400 text-sm capitalize">{level} Level</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={16} />
              <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Question {currentQuestion + 1} of {examQuestions.length}</span>
            <span className="capitalize">{currentQ.type}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xl text-white font-semibold flex-1">{currentQ.question}</p>
            <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm ml-4">
              {currentQ.points} pts
            </span>
          </div>
          {currentQ.hint && (
            <p className="text-slate-400 text-sm italic">Hint: {currentQ.hint}</p>
          )}
          {currentQ.reference && (
            <p className="text-indigo-400 text-sm mt-2">{currentQ.reference}</p>
          )}
        </div>

        {/* Answer Options */}
        {currentQ.userInput ? (
          <textarea
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
            className="w-full h-32 bg-slate-700 text-white rounded-xl p-4 border-2 border-slate-600 focus:border-purple-500 outline-none mb-6"
            placeholder="Type your answer here..."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] === option;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, option)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white border-2 border-purple-400'
                      : 'bg-slate-700 text-white border-2 border-slate-600 hover:border-purple-500'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all"
          >
            Previous
          </button>

          {currentQuestion === examQuestions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Answered Count */}
        <div className="mt-4 text-center text-slate-400 text-sm">
          Answered: {Object.keys(answers).length}/{examQuestions.length}
        </div>
      </div>
    </div>
  );
};

export default GreekExam;
