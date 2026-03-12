import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Book,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Scroll,
  Trophy,
  ArrowLeft,
  RotateCcw,
  X,
  Zap
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';
import { getLocalChapterRange } from '../services/localBibleProvider';
import LanguageLessonFlow from './LanguageLessonFlow';
import {
  FINAL_EXAM_PASS_PERCENT,
  FINAL_EXAM_NOVEL_RATIO,
  FINAL_EXAM_TOTAL_QUESTIONS,
  buildFinalExamFromCourse
} from '../services/finalExamBuilder';

const DEFAULT_THEME = {
  accentText: 'text-blue-300',
  accentTextStrong: 'text-blue-400',
  accentBorder: 'border-blue-500/50',
  accentBorderSoft: 'border-blue-500/30',
  accentBgSoft: 'from-blue-900/40 to-indigo-900/40',
  accentBgSoftAlt: 'from-blue-900/30 to-indigo-900/30',
  accentBgSolid: 'from-blue-600 to-indigo-600',
  accentBgSolidHover: 'from-blue-500 to-indigo-500',
  quizAccentBg: 'from-blue-600 to-indigo-600',
  examAccentBg: 'from-amber-600 to-orange-600',
  examAccentBgHover: 'from-amber-500 to-orange-500',
  examBorder: 'border-amber-500/50',
  examText: 'text-amber-400',
  badgeLesson: 'text-emerald-400',
  badgeQuiz: 'text-amber-400'
};

const normalizeUnitId = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^\d+$/.test(raw)) return raw.padStart(2, '0');
  return raw;
};

const sanitizeDisplayIcon = (icon) => {
  const raw = String(icon ?? '').trim();
  if (!raw) return '[icon]';
  if (/(?:\u00C3|\u00C2|\u00E2|\u00F0|\u00EF|\uFFFD)/.test(raw)) return '[icon]';
  return raw;
};

const CANONICAL_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

const BOOK_INDEX = new Map(CANONICAL_BOOKS.map((book) => [book.toLowerCase(), book]));
const BOOK_PATTERN = CANONICAL_BOOKS
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((book) => book.replace(/\s+/g, '\\s+'))
  .join('|');
const BOOK_REFERENCE_RE = new RegExp(
  `\\b(${BOOK_PATTERN})\\s+(\\d{1,3}(?::\\d{1,3}(?:\\s*[-]\\s*\\d{1,3}(?::\\d{1,3})?)?)?(?:\\s*[-]\\s*\\d{1,3})?)\\b`,
  'gi'
);
const SHORTHAND_REFERENCE_RE = /\b(\d{1,3}:\d{1,3}(?:\s*-\s*\d{1,3}(?::\d{1,3})?)?)\b/g;

const normalizeBookName = (bookRaw) => {
  const compact = String(bookRaw || '').trim().replace(/\s+/g, ' ').toLowerCase();
  return BOOK_INDEX.get(compact) || null;
};

const normalizeRefToken = (token) => String(token || '')
  .replace(/[\u2013\u2014]/g, '-')
  .replace(/\s*-\s*/g, '-')
  .trim();

const extractScriptureReferences = (text) => {
  if (!text) return [];
  const normalized = String(text).replace(/[\u2013\u2014]/g, '-');
  const found = [];
  let match;

  while ((match = BOOK_REFERENCE_RE.exec(normalized)) !== null) {
    const book = normalizeBookName(match[1]);
    const refToken = normalizeRefToken(match[2]);
    if (!book || !refToken) continue;
    found.push(`${book} ${refToken}`);

    const tail = normalized.slice(match.index + match[0].length, match.index + match[0].length + 80);
    const shorthandMatches = tail.match(SHORTHAND_REFERENCE_RE);
    if (Array.isArray(shorthandMatches)) {
      shorthandMatches.forEach((shortRef) => {
        found.push(`${book} ${normalizeRefToken(shortRef)}`);
      });
    }
  }

  return Array.from(new Set(found));
};

const normalizeProgressPayload = (payload = {}) => {
  const completedLessons = Array.isArray(payload.completedLessons)
    ? Array.from(new Set(payload.completedLessons.map(normalizeUnitId).filter(Boolean)))
    : [];
  const completedQuizzes = Array.isArray(payload.completedQuizzes)
    ? Array.from(new Set(payload.completedQuizzes.map(normalizeUnitId).filter(Boolean)))
    : [];

  return {
    completedLessons,
    completedQuizzes,
    examCompleted: Boolean(payload.examCompleted)
  };
};

const arraysEqual = (a = [], b = []) => (
  a.length === b.length && a.every((value, index) => value === b[index])
);

const ComprehensiveCourse = ({
  courseData,
  progressKey,
  onCompleteCourseId,
  userId,
  userData,
  setUserData,
  onComplete,
  onCancel
}) => {
  const theme = courseData.theme || DEFAULT_THEME;
  const [currentView, setCurrentView] = useState('list');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examPassed, setExamPassed] = useState(false);
  const [examQuestions, setExamQuestions] = useState(() => buildFinalExamFromCourse(courseData));

  // Interactive lesson state (flashcards + practice)
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [matchingSelectedTerm, setMatchingSelectedTerm] = useState(null);
  const [matchingPairs, setMatchingPairs] = useState({});
  const [matchingSubmitted, setMatchingSubmitted] = useState(false);
  const [sectionScriptures, setSectionScriptures] = useState({});
  const scriptureCacheRef = useRef(new Map());

  // Load progress from userData first, then fallback to individual localStorage entry
  const loadSavedProgress = () => {
    if (userData?.[progressKey]) return normalizeProgressPayload(userData[progressKey]);
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) return normalizeProgressPayload(JSON.parse(saved));
    } catch (e) {
      console.error(`Error parsing ${progressKey} from localStorage:`, e);
    }
    return normalizeProgressPayload({});
  };
  const savedProgress = loadSavedProgress();

  const [completedLessons, setCompletedLessons] = useState(() => {
    return savedProgress.completedLessons || [];
  });
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    return savedProgress.completedQuizzes || [];
  });
  const [examCompleted, setExamCompleted] = useState(() => {
    return savedProgress.examCompleted || false;
  });
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (userData?.[progressKey]) {
      const p = normalizeProgressPayload(userData[progressKey]);
      setCompletedLessons(prev => (arraysEqual(prev, p.completedLessons) ? prev : p.completedLessons));
      setCompletedQuizzes(prev => (arraysEqual(prev, p.completedQuizzes) ? prev : p.completedQuizzes));
      setExamCompleted(prev => (prev === p.examCompleted ? prev : p.examCompleted));
    }
  }, [userData, progressKey]);

  useEffect(() => {
    setExamQuestions(buildFinalExamFromCourse(courseData));
  }, [courseData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const progressPayload = normalizeProgressPayload({ completedLessons, completedQuizzes, examCompleted });
    localStorage.setItem(progressKey, JSON.stringify(progressPayload));
    if (setUserData) setUserData(prev => ({ ...prev, [progressKey]: progressPayload }));
    if (userId) updateUserProgress(userId, { [progressKey]: progressPayload }).catch(err =>
      console.error(`Error saving ${progressKey}:`, err)
    );
  }, [completedLessons, completedQuizzes, examCompleted, userId, setUserData, progressKey]);

  const totalSteps = courseData.units.length * 2 + 1;
  const completedSteps = completedLessons.length + completedQuizzes.length + (examCompleted ? 1 : 0);
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const quizPassScore = courseData.quizPassScore ?? 4;
  const isLanguageCourse = /language course/i.test(courseData.subtitle || '');

  // Generate stable (per-unit-visit) randomised practice questions from keyTerms
  const practiceQuestions = useMemo(() => {
    if (!isLanguageCourse || selectedUnit === null) return [];
    const unit = courseData.units[selectedUnit];
    const keyTerms = unit?.keyTerms;
    if (!Array.isArray(keyTerms) || keyTerms.length < 3) return [];
    return keyTerms.map((kt) => {
      const wrongPool = keyTerms.filter(k => k !== kt);
      const shuffledWrong = [...wrongPool].sort(() => Math.random() - 0.5);
      const wrongOptions = shuffledWrong.slice(0, Math.min(3, shuffledWrong.length)).map(w => w.definition);
      const allOptions = [...wrongOptions, kt.definition].sort(() => Math.random() - 0.5);
      return {
        question: `What does "${kt.term}" mean?`,
        options: allOptions,
        correct: allOptions.indexOf(kt.definition)
      };
    });
  }, [selectedUnit, isLanguageCourse, courseData]);

  // Generate stable shuffled matching pairs from keyTerms
  const matchingData = useMemo(() => {
    if (!isLanguageCourse || selectedUnit === null) return { terms: [], shuffledDefs: [] };
    const unit = courseData.units[selectedUnit];
    const keyTerms = unit?.keyTerms;
    if (!Array.isArray(keyTerms) || keyTerms.length < 3) return { terms: [], shuffledDefs: [] };
    const terms = keyTerms.slice(0, 6);
    const shuffledDefs = [...terms.map((kt, i) => ({ def: kt.definition, originalIdx: i }))].sort(() => Math.random() - 0.5);
    return { terms, shuffledDefs };
  }, [selectedUnit, isLanguageCourse, courseData]);

  // Reset interactive state whenever the user switches to a different unit
  useEffect(() => {
    setFlashcardIndex(0);
    setFlashcardFlipped(false);
    setPracticeAnswers({});
    setPracticeSubmitted(false);
    setMatchingSelectedTerm(null);
    setMatchingPairs({});
    setMatchingSubmitted(false);
  }, [selectedUnit]);

  useEffect(() => {
    if (currentView !== 'lesson' || selectedUnit === null || isLanguageCourse) {
      setSectionScriptures({});
      return;
    }

    const unit = courseData.units[selectedUnit];
    const sections = Array.isArray(unit?.content) ? unit.content : [];
    const refsBySection = sections.map((section) => extractScriptureReferences(section?.text || ''));

    const initial = refsBySection.reduce((acc, refs, index) => {
      if (refs.length > 0) {
        acc[index] = { refs, loading: true, passages: [] };
      }
      return acc;
    }, {});
    setSectionScriptures(initial);

    let cancelled = false;

    const loadAll = async () => {
      const nextState = {};
      for (let i = 0; i < refsBySection.length; i += 1) {
        const refs = refsBySection[i];
        if (!refs.length) continue;

        const passages = [];
        for (const ref of refs) {
          const cacheKey = `${Boolean(userData?.simplifiedMode)}:${ref}`;
          if (scriptureCacheRef.current.has(cacheKey)) {
            const cached = scriptureCacheRef.current.get(cacheKey);
            if (cached) passages.push(cached);
            continue;
          }

          try {
            const data = await getLocalChapterRange('KJV', ref, { simplifiedMode: userData?.simplifiedMode });
            scriptureCacheRef.current.set(cacheKey, data || null);
            if (data) passages.push(data);
          } catch (err) {
            console.error(`Error loading scripture for ${ref}:`, err);
            scriptureCacheRef.current.set(cacheKey, null);
          }
        }

        nextState[i] = { refs, loading: false, passages };
      }

      if (!cancelled) setSectionScriptures(nextState);
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [currentView, selectedUnit, isLanguageCourse, courseData, userData?.simplifiedMode]);

  const examPassScore = useMemo(() => {
    return Math.ceil((FINAL_EXAM_PASS_PERCENT / 100) * examQuestions.length);
  }, [examQuestions.length]);

  useEffect(() => {
    if (completedQuizzes.length === 0) return;
    setCompletedLessons(prev => {
      const merged = Array.from(new Set([...prev, ...completedQuizzes]));
      return merged.length === prev.length ? prev : merged;
    });
  }, [completedQuizzes]);

  const submitQuiz = () => {
    const unit = courseData.units[selectedUnit];
    const unitId = normalizeUnitId(unit.id);
    let correct = 0;
    unit.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++; });
    setQuizScore(correct);
    setQuizSubmitted(true);
    const nextLessons = completedLessons.includes(unitId) ? completedLessons : [...completedLessons, unitId];
    if (!completedLessons.includes(unitId)) {
      setCompletedLessons(nextLessons);
    }
    if (correct >= quizPassScore && !completedQuizzes.includes(unitId)) {
      const nextQuizzes = [...completedQuizzes, unitId];
      setCompletedQuizzes(nextQuizzes);

      // Persist immediately so a parent onComplete navigation cannot lose this quiz update.
      const progressPayload = normalizeProgressPayload({
        completedLessons: nextLessons,
        completedQuizzes: nextQuizzes,
        examCompleted
      });
      localStorage.setItem(progressKey, JSON.stringify(progressPayload));
      if (setUserData) setUserData(prev => ({ ...prev, [progressKey]: progressPayload }));
      if (userId) {
        updateUserProgress(userId, { [progressKey]: progressPayload }).catch(err =>
          console.error(`Error saving ${progressKey} after quiz submit:`, err)
        );
      }

      if (onComplete) onComplete({ type: 'quiz', unitId });
    }
  };

  const submitExam = () => {
    let correct = 0;
    examQuestions.forEach((q, i) => { if (examAnswers[i] === q.correct) correct++; });
    setExamScore(correct);
    setExamSubmitted(true);
    const passed = correct >= examPassScore;
    setExamPassed(passed);
    if (passed && !examCompleted) {
      setExamCompleted(true);
      if (onComplete) onComplete({ type: 'course', courseId: onCompleteCourseId });
    }
  };

  const startQuiz = () => {
    if (selectedUnit !== null) {
      const unit = courseData.units[selectedUnit];
      const unitId = normalizeUnitId(unit?.id);
      if (unit && unitId && !completedLessons.includes(unitId)) {
        setCompletedLessons(prev => [...prev, unitId]);
      }
    }
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentView('quiz');
  };
  const startExam = () => {
    setExamQuestions(buildFinalExamFromCourse(courseData));
    setExamAnswers({});
    setExamSubmitted(false);
    setExamScore(0);
    setExamPassed(false);
    setCurrentView('exam');
  };

  const getLanguageDrills = (courseData, unit) => {
    const id = courseData?.id || '';
    const isHebrew = id === 'hebrewI' || id === 'ancientHebrew' || id === 'paleoHebrew';
    const isAramaic = id === 'aramaic';
    const isGreek = id === 'greekI' || id === 'koineGreek';
    const isGeez = id === 'geez';
    const isAmharic = id === 'amharic';

    if (isHebrew) {
      return [
        {
          heading: 'Unit Drill: Key Forms',
          text: `Write 8 items from "${unit.title}". Format: form — transliteration — gloss (e.g., מלך — melek — king).`
        },
        {
          heading: 'Unit Drill: Parsing',
          text: 'Parse 5 Hebrew forms from this unit. Include root (3 consonants), part of speech, and basic function.'
        },
        {
          heading: 'Unit Drill: Translation',
          text: 'Translate 3 short Hebrew fragments. Do a literal gloss first, then smooth English.'
        },
        {
          heading: 'Unit Drill: Vocabulary',
          text: 'Build a 10-item list. Mark each item as noun/verb/particle; mark final forms where applicable.'
        },
        {
          heading: 'Unit Drill: Reading',
          text: 'Read right-to-left aloud twice, then copy one line from the snippets without looking.'
        }
      ];
    }

    if (isAramaic) {
      return [
        {
          heading: 'Unit Drill: Key Forms',
          text: `Write 8 items from "${unit.title}". Format: form — transliteration — gloss (e.g., מלכא — malka — king).`
        },
        {
          heading: 'Unit Drill: Parsing',
          text: 'Parse 5 Aramaic forms. Include root, part of speech, and basic function (watch suffix pronouns).'
        },
        {
          heading: 'Unit Drill: Translation',
          text: 'Translate 3 short Aramaic fragments. Do a literal gloss first, then smooth English.'
        },
        {
          heading: 'Unit Drill: Vocabulary',
          text: 'Build a 10-item list. Mark noun/verb/particle and note any suffix pronouns.'
        },
        {
          heading: 'Unit Drill: Reading',
          text: 'Read right-to-left aloud twice, then copy one line from the snippets without looking.'
        }
      ];
    }

    if (isGreek) {
      return [
        {
          heading: 'Unit Drill: Key Forms',
          text: `Write 8 items from "${unit.title}". Format: form — transliteration — gloss (e.g., λογος — logos — word).`
        },
        {
          heading: 'Unit Drill: Parsing',
          text: 'Parse 5 Greek forms. Include case (if noun), tense-aspect/voice/mood (if verb), and basic function.'
        },
        {
          heading: 'Unit Drill: Translation',
          text: 'Translate 3 short Greek fragments. Do a literal gloss first, then smooth English.'
        },
        {
          heading: 'Unit Drill: Vocabulary',
          text: 'Build a 10-item list. Mark part of speech and note case or tense-aspect where relevant.'
        },
        {
          heading: 'Unit Drill: Reading',
          text: 'Read left-to-right aloud twice. Then copy one line from the snippets without looking.'
        }
      ];
    }

    if (isGeez || isAmharic) {
      return [
        {
          heading: 'Unit Drill: Key Forms',
          text: `Write 8 forms from "${unit.title}". Format: romanized form — gloss (use fidel series order where relevant).`
        },
        {
          heading: 'Unit Drill: Parsing',
          text: 'Identify 5 forms by series order (1-7) or by role (noun/verb). Note any vowel patterns.'
        },
        {
          heading: 'Unit Drill: Translation',
          text: 'Translate 3 short romanized fragments. Do a literal gloss first, then smooth English.'
        },
        {
          heading: 'Unit Drill: Vocabulary',
          text: 'Build a 10-item list. Mark noun/verb/particle (or series family for script units).'
        },
        {
          heading: 'Unit Drill: Reading',
          text: 'Read the romanized snippets aloud twice, then write one series line from memory.'
        }
      ];
    }

    return [
      {
        heading: 'Unit Drill: Key Forms',
        text: `Write and recite 8 key forms from "${unit.title}". Format each as: form — transliteration — gloss.`
      },
      {
        heading: 'Unit Drill: Parsing',
        text: 'Parse 5 forms from this unit. For each: root, part of speech, and basic function.'
      },
      {
        heading: 'Unit Drill: Translation',
        text: 'Translate 3 short fragments from this unit\'s reading snippets. Aim for a literal gloss first, then smooth English.'
      },
      {
        heading: 'Unit Drill: Vocabulary',
        text: 'Create a 10-item list from this unit. Mark each item as noun/verb/particle (or consonant/vowel for script units).'
      },
      {
        heading: 'Unit Drill: Reading',
        text: 'Read the unit\'s snippets aloud twice. Then write them once from memory and check accuracy.'
      }
    ];
  };

  if (currentView === 'quiz' && selectedUnit !== null) {
    const unit = courseData.units[selectedUnit];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('lesson')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <ArrowLeft size={20} /> Back to Lesson
            </button>
            <h2 className="text-xl font-bold text-white">Unit {unit.id} Quiz</h2>
          </div>
          <div className="space-y-6">
            {unit.quiz.map((q, qi) => (
              <div key={qi} className={`bg-slate-800/50 rounded-xl p-5 border ${quizSubmitted ? (quizAnswers[qi] === q.correct ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-slate-700'}`}>
                <p className="text-white font-semibold mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} disabled={quizSubmitted}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${quizSubmitted ? (oi === q.correct ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : quizAnswers[qi] === oi ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-slate-700/30 border-slate-600 text-slate-400') : quizAnswers[qi] === oi ? 'bg-blue-900/40 border-blue-400 text-white' : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-400'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted && <p className="text-sm text-slate-400 mt-2 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>
          {!quizSubmitted ? (
            <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < unit.quiz.length}
              className={`w-full mt-6 bg-gradient-to-r ${theme.quizAccentBg} hover:${theme.accentBgSolidHover} disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all`}>
              Submit Quiz
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${quizScore >= quizPassScore ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-4xl mb-2">{quizScore >= quizPassScore ? '🎉' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{quizScore}/{unit.quiz.length} Correct</h3>
              <p className="text-slate-300 mb-4">{quizScore >= quizPassScore ? 'You passed! Great understanding of the material.' : `You need ${quizPassScore}/${unit.quiz.length} to pass. Review the lesson and try again.`}</p>
              <div className="flex gap-3 justify-center">
                {quizScore < quizPassScore && <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'exam') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Course</button>
            <h2 className={`text-xl font-bold ${theme.examText} flex items-center gap-2`}><Trophy size={24} /> Final Exam</h2>
          </div>
          {!examSubmitted && (
            <div className={`bg-amber-900/30 border border-amber-500/40 rounded-xl p-4 mb-6 text-amber-300 text-sm`}>
              {examQuestions.length} questions ({Math.round((1 - FINAL_EXAM_NOVEL_RATIO) * 100)}% quiz review, {Math.round(FINAL_EXAM_NOVEL_RATIO * 100)}% new lesson-based). You need {examPassScore}/{examQuestions.length} to pass.
            </div>
          )}
          <div className="space-y-6">
            {examQuestions.map((q, qi) => (
              <div key={qi} className={`bg-slate-800/50 rounded-xl p-5 border ${examSubmitted ? (examAnswers[qi] === q.correct ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-slate-700'}`}>
                <p className="text-white font-semibold mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} disabled={examSubmitted}
                      onClick={() => setExamAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${examSubmitted ? (oi === q.correct ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : examAnswers[qi] === oi ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-slate-700/30 border-slate-600 text-slate-400') : examAnswers[qi] === oi ? 'bg-amber-900/40 border-amber-400 text-white' : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-amber-400'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {examSubmitted && <p className="text-sm text-slate-400 mt-2 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>
          {!examSubmitted ? (
            <button onClick={submitExam} disabled={Object.keys(examAnswers).length < examQuestions.length}
              className={`w-full mt-6 bg-gradient-to-r ${theme.examAccentBg} hover:${theme.examAccentBgHover} disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all`}>
              Submit Final Exam
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${examPassed ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-5xl mb-3">{examPassed ? '🏆' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{examScore}/{examQuestions.length} Correct ({Math.round((examScore / examQuestions.length) * 100)}%)</h3>
              <p className="text-slate-300 mb-4">{examPassed ? `Congratulations! You have completed the ${courseData.title} course!` : `You need ${examPassScore}/${examQuestions.length} to pass. Review the units and try again.`}</p>
              <div className="flex gap-3 justify-center">
                {!examPassed && <button onClick={() => { setExamAnswers({}); setExamSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'lesson' && selectedUnit !== null) {
    const unit = courseData.units[selectedUnit];
    const unitId = normalizeUnitId(unit.id);
    const lessonDone = completedLessons.includes(unitId);
    const quizDone = completedQuizzes.includes(unitId);
    const displayIcon = sanitizeDisplayIcon(unit.icon);

    // Language courses get the Duolingo-style interactive flow
    if (isLanguageCourse) {
      const handleBuyHeart = (cost) => {
        const newPoints = Math.max(0, (userData?.totalPoints || 0) - cost);
        if (setUserData) setUserData(prev => ({ ...prev, totalPoints: newPoints }));
        if (userId) updateUserProgress(userId, { totalPoints: newPoints }).catch(err =>
          console.error('Error saving points after heart purchase:', err)
        );
      };
      return (
        <LanguageLessonFlow
          languageId={courseData.id}
          unit={unit}
          onComplete={startQuiz}
          onBack={() => { setCurrentView('list'); window.scrollTo(0, 0); }}
          userData={userData}
          onBuyHeart={handleBuyHeart}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Course</button>
            <div className="flex items-center gap-2">
              {lessonDone && <span className={`text-sm flex items-center gap-1 ${theme.badgeLesson}`}><CheckCircle size={16} /> Read</span>}
              {quizDone && <span className={`text-sm flex items-center gap-1 ${theme.badgeQuiz}`}><Award size={16} /> Quiz Passed</span>}
            </div>
          </div>
          <div className={`bg-gradient-to-br ${theme.accentBgSoft} rounded-xl p-6 border-2 ${theme.accentBorder} mb-6`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{displayIcon}</span>
              <div>
                <p className="text-blue-300 text-sm font-mono">Unit {unitId}</p>
                <h1 className="text-2xl font-bold text-white">{unit.title}</h1>
                <p className="text-blue-300 text-sm">{unit.duration}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {unit.content.map((section, si) => (
              <div key={si} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className={`text-xl font-bold ${theme.examText} mb-3`}>{section.heading}</h2>
                {section.text.split('\n\n').map((para, pi) => <p key={pi} className="text-slate-300 leading-relaxed mb-3">{para}</p>)}
                {sectionScriptures[si]?.loading && (
                  <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm">Loading scripture passage...</p>
                  </div>
                )}
                {!sectionScriptures[si]?.loading && Array.isArray(sectionScriptures[si]?.passages) && sectionScriptures[si].passages.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {sectionScriptures[si].passages.map((passage) => (
                      <div key={passage.reference} className="bg-slate-900/60 rounded-lg p-4 border border-emerald-500/30">
                        <h4 className="text-sm font-bold text-emerald-300 mb-2">Full Scripture Passage ({passage.reference})</h4>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{passage.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLanguageCourse && getLanguageDrills(courseData, unit).map((section, si) => (
              <div key={`drill-${si}`} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className={`text-xl font-bold ${theme.examText} mb-3`}>{section.heading}</h2>
                {section.text.split('\n\n').map((para, pi) => <p key={pi} className="text-slate-300 leading-relaxed mb-3">{para}</p>)}
              </div>
            ))}
            {unit.keyTerms && unit.keyTerms.length > 0 && !isLanguageCourse && (
              <div className={`bg-gradient-to-br ${theme.accentBgSoftAlt} rounded-xl p-6 border ${theme.accentBorderSoft}`}>
                <h3 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2"><Book size={20} /> Key Terms</h3>
                <div className="space-y-2">
                  {unit.keyTerms.map((kt, ki) => (
                    <div key={ki}><span className="text-amber-300 font-semibold">{kt.term}:</span> <span className="text-slate-300">{kt.definition}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Language-course interactive section ── */}
            {isLanguageCourse && unit.keyTerms && unit.keyTerms.length > 0 && (
              <>
                {/* FLASH CARDS */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/40">
                  <h3 className="text-lg font-bold text-indigo-300 mb-1 flex items-center gap-2">
                    <Book size={20} /> Vocabulary Flash Cards
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {unit.keyTerms.length} term{unit.keyTerms.length !== 1 ? 's' : ''} — click the card to flip
                  </p>
                  <div
                    onClick={() => setFlashcardFlipped(f => !f)}
                    className={`cursor-pointer min-h-[140px] rounded-xl border-2 p-6 text-center flex items-center justify-center transition-all select-none ${
                      flashcardFlipped
                        ? 'bg-emerald-900/20 border-emerald-500/60'
                        : 'bg-indigo-900/20 border-indigo-500/60 hover:border-indigo-400'
                    }`}
                  >
                    {flashcardFlipped ? (
                      <div className="space-y-2">
                        <p className="text-xs text-emerald-400 uppercase tracking-widest">Definition</p>
                        <p className="text-base text-slate-200 leading-relaxed">{unit.keyTerms[flashcardIndex].definition}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-indigo-400 uppercase tracking-widest">Tap to reveal</p>
                        <p className="text-2xl font-bold text-white">{unit.keyTerms[flashcardIndex].term}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => { setFlashcardIndex(i => Math.max(0, i - 1)); setFlashcardFlipped(false); }}
                      disabled={flashcardIndex === 0}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 rounded-lg text-sm transition-all"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-slate-400 text-sm">{flashcardIndex + 1} / {unit.keyTerms.length}</span>
                      <div className="flex gap-1">
                        {unit.keyTerms.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => { setFlashcardIndex(i); setFlashcardFlipped(false); }}
                            className={`w-2 h-2 rounded-full transition-all ${i === flashcardIndex ? 'bg-indigo-400' : 'bg-slate-600 hover:bg-slate-500'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => { setFlashcardIndex(i => Math.min(unit.keyTerms.length - 1, i + 1)); setFlashcardFlipped(false); }}
                      disabled={flashcardIndex === unit.keyTerms.length - 1}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 rounded-lg text-sm transition-all"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* PRACTICE: MULTIPLE CHOICE */}
                {practiceQuestions.length > 0 && (
                  <div className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 rounded-xl p-6 border border-violet-500/40">
                    <h3 className="text-lg font-bold text-violet-300 mb-1 flex items-center gap-2">
                      <Zap size={20} /> Practice: Multiple Choice
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">Answer all questions, then tap Check Answers</p>
                    <div className="space-y-5">
                      {practiceQuestions.map((q, qi) => (
                        <div key={qi} className={`rounded-xl p-4 border ${
                          practiceSubmitted
                            ? practiceAnswers[qi] === q.correct
                              ? 'border-emerald-500/50 bg-emerald-900/10'
                              : 'border-red-500/50 bg-red-900/10'
                            : 'border-slate-700 bg-slate-800/40'
                        }`}>
                          <p className="text-white font-semibold mb-3 text-sm">{qi + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <button
                                key={oi}
                                disabled={practiceSubmitted}
                                onClick={() => setPracticeAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all ${
                                  practiceSubmitted
                                    ? oi === q.correct
                                      ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300'
                                      : practiceAnswers[qi] === oi
                                        ? 'bg-red-900/40 border-red-500 text-red-300'
                                        : 'bg-slate-700/30 border-slate-600 text-slate-400'
                                    : practiceAnswers[qi] === oi
                                      ? 'bg-violet-900/40 border-violet-400 text-white'
                                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-violet-400'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!practiceSubmitted ? (
                      <button
                        onClick={() => setPracticeSubmitted(true)}
                        disabled={Object.keys(practiceAnswers).length < practiceQuestions.length}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all"
                      >
                        Check Answers ({Object.keys(practiceAnswers).length}/{practiceQuestions.length} answered)
                      </button>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <div className={`p-3 rounded-xl text-center border ${
                          practiceQuestions.every((q, i) => practiceAnswers[i] === q.correct)
                            ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800/50 border-slate-600 text-slate-300'
                        }`}>
                          Score: {practiceQuestions.filter((q, i) => practiceAnswers[i] === q.correct).length} / {practiceQuestions.length} correct
                        </div>
                        <button
                          onClick={() => { setPracticeAnswers({}); setPracticeSubmitted(false); }}
                          className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <RotateCcw size={14} /> Try Again
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* PRACTICE: MATCHING */}
                {matchingData.terms.length >= 3 && (
                  <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-xl p-6 border border-teal-500/40">
                    <h3 className="text-lg font-bold text-teal-300 mb-1 flex items-center gap-2">
                      <Scroll size={20} /> Practice: Matching
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {matchingSubmitted
                        ? 'Results — green = correct, red = incorrect'
                        : matchingSelectedTerm !== null
                          ? 'Now click a definition on the right to match it'
                          : 'Click a term to select it, then click its matching definition'}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Terms column */}
                      <div className="space-y-2">
                        <p className="text-xs text-teal-400 uppercase tracking-widest text-center mb-1">Terms</p>
                        {matchingData.terms.map((kt, termIdx) => {
                          const isSelected = matchingSelectedTerm === termIdx;
                          const isPaired = matchingPairs[termIdx] !== undefined;
                          const isCorrect = matchingSubmitted && isPaired && matchingData.shuffledDefs[matchingPairs[termIdx]]?.originalIdx === termIdx;
                          const isWrong = matchingSubmitted && isPaired && !isCorrect;
                          return (
                            <button
                              key={termIdx}
                              onClick={() => { if (!matchingSubmitted) setMatchingSelectedTerm(isSelected ? null : termIdx); }}
                              className={`w-full text-left p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                                isCorrect ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300' :
                                isWrong ? 'bg-red-900/30 border-red-500 text-red-300' :
                                isSelected ? 'bg-teal-900/40 border-teal-400 text-white ring-2 ring-teal-400/20' :
                                isPaired ? 'bg-slate-700/50 border-teal-500/40 text-slate-200' :
                                'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-teal-400'
                              }`}
                            >
                              <span className="text-teal-400 font-bold mr-1">{termIdx + 1}.</span>{kt.term}
                              {isPaired && !matchingSubmitted && <span className="text-slate-500 text-xs ml-1">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                      {/* Definitions column */}
                      <div className="space-y-2">
                        <p className="text-xs text-amber-400 uppercase tracking-widest text-center mb-1">Definitions</p>
                        {matchingData.shuffledDefs.map((defItem, defIdx) => {
                          const pairedTermKey = Object.keys(matchingPairs).find(k => matchingPairs[Number(k)] === defIdx);
                          const isPaired = pairedTermKey !== undefined;
                          const pairedTermIdx = isPaired ? Number(pairedTermKey) : -1;
                          const isCorrect = matchingSubmitted && isPaired && defItem.originalIdx === pairedTermIdx;
                          const isWrong = matchingSubmitted && isPaired && !isCorrect;
                          const canSelect = !matchingSubmitted && matchingSelectedTerm !== null;
                          return (
                            <button
                              key={defIdx}
                              onClick={() => {
                                if (!matchingSubmitted && matchingSelectedTerm !== null) {
                                  setMatchingPairs(prev => ({ ...prev, [matchingSelectedTerm]: defIdx }));
                                  setMatchingSelectedTerm(null);
                                }
                              }}
                              className={`w-full text-left p-2.5 rounded-lg border-2 text-xs leading-snug transition-all ${
                                isCorrect ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300' :
                                isWrong ? 'bg-red-900/30 border-red-500 text-red-300' :
                                isPaired && !matchingSubmitted ? 'bg-slate-700/50 border-amber-500/40 text-slate-200' :
                                canSelect ? 'bg-amber-900/10 border-amber-500/50 text-slate-200 hover:border-amber-400 cursor-pointer' :
                                'bg-slate-700/30 border-slate-600 text-slate-300 cursor-default'
                              }`}
                            >
                              <span className="text-amber-400 font-bold mr-1">{String.fromCharCode(65 + defIdx)}.</span>{defItem.def}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {!matchingSubmitted ? (
                      <button
                        onClick={() => setMatchingSubmitted(true)}
                        disabled={Object.keys(matchingPairs).length < matchingData.terms.length}
                        className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all"
                      >
                        Check Matches ({Object.keys(matchingPairs).length}/{matchingData.terms.length} paired)
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className={`p-3 rounded-xl text-center border ${
                          matchingData.terms.every((_, i) => matchingPairs[i] !== undefined && matchingData.shuffledDefs[matchingPairs[i]]?.originalIdx === i)
                            ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800/50 border-slate-600 text-slate-300'
                        }`}>
                          Score: {matchingData.terms.filter((_, i) => matchingPairs[i] !== undefined && matchingData.shuffledDefs[matchingPairs[i]]?.originalIdx === i).length} / {matchingData.terms.length} correct
                        </div>
                        <button
                          onClick={() => { setMatchingPairs({}); setMatchingSubmitted(false); setMatchingSelectedTerm(null); }}
                          className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={14} /> Try Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={startQuiz} className={`flex-1 bg-gradient-to-r ${theme.accentBgSolid} hover:${theme.accentBgSolidHover} text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${quizDone ? 'opacity-70' : ''}`}>
              <Scroll size={18} /> {quizDone ? 'Retake Quiz' : 'Take Quiz'}
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => { setSelectedUnit(Math.max(0, selectedUnit - 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === 0}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg"><ArrowLeft size={18} /> Previous</button>
            <button onClick={() => { setSelectedUnit(Math.min(courseData.units.length - 1, selectedUnit + 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === courseData.units.length - 1}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg">Next <ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    );
  }

  const allQuizzesDone = courseData.units.every(u => completedQuizzes.includes(normalizeUnitId(u.id)));
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className={theme.accentTextStrong} />
            <div>
              <h1 className="text-2xl font-bold text-white">{courseData.title}</h1>
              <p className="text-slate-400">{courseData.subtitle}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className={`bg-slate-800/50 rounded-xl p-4 border ${theme.accentBorderSoft} mb-6`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Course Progress</span>
            <span className={`${theme.accentTextStrong} font-bold`}>{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.accentBgSolid} h-full transition-all duration-500`} style={{ width: `${progress}%` }} />
          </div>
          <div className="text-slate-400 text-sm mt-2">{completedLessons.length} lessons read | {completedQuizzes.length} quizzes passed | {examCompleted ? 'Exam passed' : 'Exam pending'}</div>
        </div>
        <div className="space-y-3 mb-6">
          {courseData.units.map((unit, idx) => {
            const unitId = normalizeUnitId(unit.id);
            const lessonDone = completedLessons.includes(unitId);
            const quizDone = completedQuizzes.includes(unitId);
            const displayIcon = sanitizeDisplayIcon(unit.icon);
            return (
              <button key={unitId} onClick={() => { setSelectedUnit(idx); setCurrentView('lesson'); window.scrollTo(0, 0); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${lessonDone && quizDone ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50 hover:border-emerald-400' : 'bg-slate-800/50 border-blue-500/30 hover:border-blue-400 hover:bg-slate-800/70'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{displayIcon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-mono">Unit {unitId}</span>
                        {lessonDone && <CheckCircle size={14} className="text-emerald-400" />}
                        {quizDone && <Award size={14} className="text-amber-400" />}
                      </div>
                      <h3 className="text-lg font-bold text-white">{unit.title}</h3>
                      <p className={`${theme.accentText} text-sm`}>{unit.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className={theme.accentTextStrong} />
                </div>
              </button>
            );
          })}
        </div>
        <div className={`rounded-xl p-6 border-2 text-center ${allQuizzesDone ? `bg-gradient-to-r from-amber-900/30 to-orange-900/30 ${theme.examBorder}` : 'bg-slate-800/30 border-slate-700'}`}>
          <Trophy size={32} className={allQuizzesDone ? 'text-amber-400 mx-auto mb-3' : 'text-slate-600 mx-auto mb-3'} />
          <h3 className="text-xl font-bold text-white mb-2">Final Exam</h3>
          <p className="text-slate-400 text-sm mb-4">{allQuizzesDone ? 'All quizzes passed! You are ready for the final exam.' : `Pass all ${courseData.units.length} unit quizzes to unlock the final exam. (${completedQuizzes.length}/${courseData.units.length} complete)`}</p>
          {examCompleted && <p className="text-emerald-400 font-bold mb-3 flex items-center justify-center gap-2"><CheckCircle size={18} /> Exam Passed!</p>}
          <button onClick={startExam} disabled={!allQuizzesDone}
            className={`bg-gradient-to-r ${theme.examAccentBg} hover:${theme.examAccentBgHover} disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-bold py-3 px-8 rounded-lg transition-all`}>
            {examCompleted ? `Retake ${FINAL_EXAM_TOTAL_QUESTIONS}-Question Exam` : `Start ${FINAL_EXAM_TOTAL_QUESTIONS}-Question Final`}
          </button>
        </div>
        <div className={`mt-6 bg-gradient-to-br ${theme.accentBgSoftAlt} rounded-xl p-6 border ${theme.accentBorderSoft}`}>
          <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2"><Scroll size={24} /> About This Course</h2>
          <p className="text-slate-300 mb-3"><strong className="text-blue-300">{courseData.about.level}</strong> - {courseData.about.description}</p>
          <p className="text-slate-300"><strong className="text-blue-300">Credit Equivalent:</strong> {courseData.about.credits} | <strong className="text-blue-300">Prerequisites:</strong> {courseData.about.prerequisites}</p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveCourse;

