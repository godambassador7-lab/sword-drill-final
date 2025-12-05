import React, { useState, useEffect, useCallback , useRef } from "react";
import { X, Clock, Trophy, Zap } from "lucide-react";
import CorrectToast from "./CorrectToast";
import StableInput from './StableInput';

// Bible books in order
const BIBLE_BOOKS = [
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const BOOK_ABBREVIATIONS = {
  genesis: ["gen"],
  exodus: ["exo", "ex"],
  leviticus: ["lev"],
  numbers: ["num"],
  deuteronomy: ["deut", "deu", "dt"],
  joshua: ["josh"],
  judges: ["judg", "jdg"],
  ruth: ["rth"],
  samuel: ["sam"],
  kings: ["kgs", "king"],
  chronicles: ["chron", "chr"],
  ezra: ["ezr"],
  nehemiah: ["neh"],
  esther: ["est"],
  job: ["jb"],
  psalms: ["ps", "psa", "psm", "psalm"],
  proverbs: ["prov", "prv", "pr"],
  ecclesiastes: ["ecc", "eccl"],
  "songofsolomon": ["song", "sos", "songofsongs", "sos"],
  isaiah: ["isa"],
  jeremiah: ["jer"],
  lamentations: ["lam"],
  ezekiel: ["ezek", "ezk"],
  daniel: ["dan"],
  hosea: ["hos"],
  joel: ["jl"],
  amos: ["am"],
  obadiah: ["obad", "oba"],
  jonah: ["jon"],
  micah: ["mic"],
  nahum: ["nah"],
  habakkuk: ["hab"],
  zephaniah: ["zeph", "zep"],
  haggai: ["hag"],
  zechariah: ["zech", "zec"],
  malachi: ["mal"],
  matthew: ["matt", "mt"],
  mark: ["mk", "mar", "mrk"],
  luke: ["lk", "luk"],
  john: ["jn", "jhn", "joh"],
  acts: ["ac"],
  romans: ["rom"],
  corinthians: ["cor", "corinth"],
  galatians: ["gal"],
  ephesians: ["eph"],
  philippians: ["phil", "php"],
  colossians: ["col", "colos"],
  thessalonians: ["thess", "thes", "ths"],
  timothy: ["tim"],
  titus: ["tit"],
  philemon: ["philem", "phm"],
  hebrews: ["heb"],
  james: ["jas", "jam"],
  peter: ["pet", "ptr"],
  jude: ["jud"],
  revelation: ["rev", "rv"]
};

const MAX_POINTS_PER_QUESTION = 10;
const PER_BOOK_POINTS = 5;
const ABBREVIATION_POINTS = 4;

const generateQuestion = () => {
  // Don't pick first or last book
  const index = Math.floor(Math.random() * (BIBLE_BOOKS.length - 2)) + 1;
  return {
    currentBook: BIBLE_BOOKS[index],
    before: BIBLE_BOOKS[index - 1],
    after: BIBLE_BOOKS[index + 1],
    index
  };
};

const normalizeAnswer = (answer) => {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ');
};

const normalizeBookSlug = (book) => book.toLowerCase().replace(/[^a-z0-9]/g, '');

const evaluateBookAnswer = (input, canonical) => {
  const inputSlug = normalizeBookSlug(input);
  const canonicalSlug = normalizeBookSlug(canonical);
  if (inputSlug.length < 2) return { accepted: false, exact: false, basePoints: 0 };

  const canonicalNum = canonicalSlug.match(/^([123])/);
  const inputNum = inputSlug.match(/^([123])/);
  if (canonicalNum) {
    if (!inputNum || inputNum[1] !== canonicalNum[1]) {
      return { accepted: false, exact: false, basePoints: 0 };
    }
  } else if (inputNum) {
    return { accepted: false, exact: false, basePoints: 0 };
  }

  const canonicalBase = canonicalNum ? canonicalSlug.slice(1) : canonicalSlug;
  const inputBase = inputNum ? inputSlug.slice(1) : inputSlug;

  // Exact match (full spelling)
  if (canonicalBase === inputBase) {
    return { accepted: true, exact: true, basePoints: PER_BOOK_POINTS };
  }

  // Abbreviation match (prefix or known abbreviation)
  const minLen = 3;
  const abbreviationList = BOOK_ABBREVIATIONS[canonicalBase] || [];
  const isAbbrev =
    (inputBase.length >= minLen && canonicalBase.startsWith(inputBase)) ||
    abbreviationList.includes(inputBase);

  if (isAbbrev) {
    return { accepted: true, exact: false, basePoints: ABBREVIATION_POINTS };
  }

  return { accepted: false, exact: false, basePoints: 0 };
};

const BookOrderQuiz = ({ onComplete, onCancel }) => {
  const [question, setQuestion] = useState(null);
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const beforeAnswerRef = useRef(""); // Using ref instead of state to prevent re-renders
  const afterAnswerRef = useRef(""); // Using ref instead of state to prevent re-renders
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalQuestions] = useState(10);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctDetails, setCorrectDetails] = useState(null);
  const [showCorrectToast, setShowCorrectToast] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const newQuestion = useCallback(() => {
    const q = generateQuestion();
    setQuestion(q);
    beforeAnswerRef.current = "";
    afterAnswerRef.current = "";
    setTimeLeft(20);
    setFeedback(null);
    setCorrectDetails(null);
  }, []);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  useEffect(() => {
    if (gameOver || feedback) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, feedback]);

  const handleTimeout = () => {
    setFeedback("incorrect");
    setCorrectDetails({
      before: question.before,
      after: question.after,
      beforeCorrect: false,
      afterCorrect: false
    });
    setStreak(0);

    setTimeout(() => {
      if (questionsAnswered + 1 >= totalQuestions) {
        endGame();
      } else {
        setQuestionsAnswered((prev) => prev + 1);
        newQuestion();
      }
    }, 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback || gameOver) return;
    if (!beforeAnswerRef.current.trim() || !afterAnswerRef.current.trim()) return;

    const beforeResult = evaluateBookAnswer(beforeAnswerRef.current, question.before);
    const afterResult = evaluateBookAnswer(afterAnswerRef.current, question.after);
    const bothCorrect = beforeResult.accepted && afterResult.accepted;

    setCorrectDetails({
      before: question.before,
      after: question.after,
      beforeCorrect: beforeResult.accepted,
      afterCorrect: afterResult.accepted
    });

    const basePoints = beforeResult.basePoints + afterResult.basePoints;
    const pointsEarned = Math.min(MAX_POINTS_PER_QUESTION, basePoints);

    if (bothCorrect) {
      setScore((prev) => prev + pointsEarned);
      setFeedback("correct");
      setEarnedPoints(pointsEarned);
      setShowCorrectToast(true);

      setTimeout(() => setShowCorrectToast(false), 2300);

      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
    } else {
      // Partial credit
      if (beforeResult.accepted || afterResult.accepted) {
        setScore((prev) => prev + pointsEarned);
        setFeedback("partial");
      } else {
        setFeedback("incorrect");
      }
      setStreak(0);
    }

    setTimeout(() => {
      if (questionsAnswered + 1 >= totalQuestions) {
        endGame();
      } else {
        setQuestionsAnswered((prev) => prev + 1);
        newQuestion();
      }
    }, 2500);
  };

  const endGame = () => {
    setGameOver(true);
    onComplete({
      score,
      pointsEarned: score,
      questionsAnswered: totalQuestions,
      bestStreak,
      type: 'book-order'
    });
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (gameOver) {
    const maxPossibleScore = totalQuestions * MAX_POINTS_PER_QUESTION;
    const accuracy = maxPossibleScore ? Math.round((score / maxPossibleScore) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-purple-500">
          <div className="text-center mb-6">
            <Trophy className="mx-auto text-amber-400 mb-4" size={64} />
            <h2 className="text-3xl font-bold text-white mb-2">
              Quiz Complete!
            </h2>
            <p className="text-slate-300">Great job learning Bible book order!</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-center">
              <div className="text-white text-sm font-semibold uppercase tracking-wide mb-1">
                Final Score
              </div>
              <div className="text-white text-5xl font-bold">{score}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-slate-400 text-xs font-semibold mb-1">
                  Accuracy
                </div>
                <div className="text-white text-2xl font-bold">
                  {accuracy}%
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-slate-400 text-xs font-semibold mb-1">
                  Questions
                </div>
                <div className="text-white text-2xl font-bold">
                  {questionsAnswered}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-slate-400 text-xs font-semibold mb-1">
                  Best Streak
                </div>
                <div className="text-white text-2xl font-bold">
                  {bestStreak}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Play Again
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (questionsAnswered / totalQuestions) * 100;
  const timePercent = (timeLeft / 20) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <CorrectToast points={earnedPoints} show={showCorrectToast} />
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-500">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📚 Book Order Challenge
            </h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-3 text-sm mb-4">
            <div className="bg-amber-500/20 px-4 py-2 rounded-lg border border-amber-500/30">
              <span className="text-amber-400 font-semibold">Score:</span>{" "}
              <span className="text-white font-bold">{score}</span>
            </div>
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <Zap className="inline mr-1" size={16} />
              <span className="text-green-400 font-semibold">Streak:</span>{" "}
              <span className="text-white font-bold">{streak}</span>
            </div>
            <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
              <span className="text-purple-400 font-semibold">Question:</span>{" "}
              <span className="text-white font-bold">
                {questionsAnswered + 1}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Clock size={20} />
              Time Left:
            </span>
            <span
              className={`text-3xl font-bold ${
                timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-green-400"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-blue-500"
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl p-8 mb-6 border-2 border-purple-500/30">
          <div className="text-center mb-6">
            <div className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-3">
              Current Book
            </div>
            <div className="text-white text-4xl font-bold">
              {question.currentBook}
            </div>
          </div>

          <div className="text-center text-slate-300 text-lg mb-4">
            Name the books that come <span className="text-amber-400 font-bold">before</span> and <span className="text-green-400 font-bold">after</span>
          </div>
        </div>

        {/* Answer Form */}
        {!feedback ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-400 font-semibold mb-2">
                📖 Book BEFORE {question.currentBook}:
              </label>
              <StableInput
                defaultValue=""
                onChange={(value) => { beforeAnswerRef.current = value; }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (beforeAnswerRef.current.trim() && afterAnswerRef.current.trim()) {
                      handleSubmit(e);
                    }
                  }
                }}
                placeholder="Type the book name..."
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border-2 border-slate-600 focus:border-amber-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-green-400 font-semibold mb-2">
                📖 Book AFTER {question.currentBook}:
              </label>
              <StableInput
                defaultValue=""
                onChange={(value) => { afterAnswerRef.current = value; }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (beforeAnswerRef.current.trim() && afterAnswerRef.current.trim()) {
                      handleSubmit(e);
                    }
                  }
                }}
                placeholder="Type the book name..."
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border-2 border-slate-600 focus:border-green-500 focus:outline-none text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              Submit Answer
            </button>
          </form>
        ) : (
          <div className={`rounded-xl p-6 border-2 ${
            feedback === 'correct' ? 'bg-green-500/20 border-green-500' :
            feedback === 'partial' ? 'bg-amber-500/20 border-amber-500' :
            'bg-red-500/20 border-red-500'
          }`}>
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold ${
                feedback === 'correct' ? 'text-green-400' :
                feedback === 'partial' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {feedback === 'correct' ? '✓ Correct!' :
                 feedback === 'partial' ? '½ Partially Correct' :
                 '✗ Incorrect'}
              </div>
            </div>

            {correctDetails && (
              <div className="space-y-3 text-white">
                <div className={`p-3 rounded-lg ${correctDetails.beforeCorrect ? 'bg-green-600/30' : 'bg-red-600/30'}`}>
                  <span className="font-semibold">Before: </span>
                  <span className="font-bold">{correctDetails.before}</span>
                  {!correctDetails.beforeCorrect && beforeAnswer && (
                    <span className="text-red-300 ml-2">(You: {beforeAnswer})</span>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${correctDetails.afterCorrect ? 'bg-green-600/30' : 'bg-red-600/30'}`}>
                  <span className="font-semibold">After: </span>
                  <span className="font-bold">{correctDetails.after}</span>
                  {!correctDetails.afterCorrect && afterAnswer && (
                    <span className="text-red-300 ml-2">(You: {afterAnswer})</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookOrderQuiz;