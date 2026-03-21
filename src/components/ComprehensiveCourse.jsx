import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import getCourseBibliography from '../data/courseBibliography';
import applyAssociateProgramRigor from '../data/courses/rigorEnhancer';
import { openReferenceInBibleReader } from '../services/referenceNavigation';
import {
  FINAL_EXAM_PASS_PERCENT,
  FINAL_EXAM_NOVEL_RATIO,
  FINAL_EXAM_TOTAL_QUESTIONS,
  buildFinalExamFromCourse
} from '../services/finalExamBuilder';
import { enqueueRequiredWorkSubmission, findRequiredWorkReview } from '../services/requiredWorkModeration';

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

const normalizeRequiredWorkRecords = (input) => {
  if (!input || typeof input !== 'object') return {};
  const normalized = {};
  Object.entries(input).forEach(([unitId, taskMap]) => {
    const safeUnitId = normalizeUnitId(unitId);
    if (!safeUnitId || !taskMap || typeof taskMap !== 'object') return;
    const normalizedTaskMap = {};
    Object.entries(taskMap).forEach(([taskKey, value]) => {
      const numericTask = Number(taskKey);
      if (!Number.isInteger(numericTask) || numericTask < 0) return;
      const text = String(value?.submissionText || '').trim();
      const rubric = value?.rubric && typeof value.rubric === 'object' ? value.rubric : null;
      normalizedTaskMap[numericTask] = {
        submissionText: text,
        submittedAt: value?.submittedAt || null,
        meta: value?.meta && typeof value.meta === 'object' ? value.meta : null,
        rubric: rubric
          ? {
              textualEvidence: Number(rubric.textualEvidence || 0),
              keyTermIntegration: Number(rubric.keyTermIntegration || 0),
              argumentation: Number(rubric.argumentation || 0),
              depthAndCompleteness: Number(rubric.depthAndCompleteness || 0),
              total: Number(rubric.total || 0),
              passed: Boolean(rubric.passed)
            }
          : null,
        instructorReview: value?.instructorReview && typeof value.instructorReview === 'object'
          ? {
              reviewer: String(value.instructorReview.reviewer || 'Instructor'),
              reviewedAt: value.instructorReview.reviewedAt || null,
              rubric: value.instructorReview.rubric && typeof value.instructorReview.rubric === 'object'
                ? {
                    textualEvidence: Number(value.instructorReview.rubric.textualEvidence || 0),
                    keyTermIntegration: Number(value.instructorReview.rubric.keyTermIntegration || 0),
                    argumentation: Number(value.instructorReview.rubric.argumentation || 0),
                    depthAndCompleteness: Number(value.instructorReview.rubric.depthAndCompleteness || 0),
                    total: Number(value.instructorReview.rubric.total || 0),
                    passed: Boolean(value.instructorReview.rubric.passed)
                  }
                : null,
              feedback: Array.isArray(value.instructorReview.feedback) ? value.instructorReview.feedback.filter(Boolean) : [],
              notes: String(value.instructorReview.notes || ''),
              plagiarismCheck: String(value.instructorReview.plagiarismCheck || 'not-reviewed')
            }
          : null,
        feedback: Array.isArray(value?.feedback) ? value.feedback.filter(Boolean) : [],
        evaluatedAt: value?.evaluatedAt || null
      };
    });
    normalized[safeUnitId] = normalizedTaskMap;
  });
  return normalized;
};

const clampScore = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const hashString = (input = '') => {
  let hash = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
};

const createSeededRandom = (seedInt = 1) => {
  let state = seedInt >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const seededShuffle = (items = [], randomFn = Math.random) => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const seededSample = (items = [], count = 1, randomFn = Math.random) => {
  return seededShuffle(items, randomFn).slice(0, Math.max(0, count));
};

const collectUnitReferences = (unit = {}) => {
  const refs = new Set();
  (unit.content || []).forEach((section) => {
    extractScriptureReferences(section?.text || '').forEach((ref) => refs.add(ref));
  });
  (unit.quiz || []).forEach((question) => {
    extractScriptureReferences(`${question?.question || ''} ${question?.explanation || ''}`).forEach((ref) => refs.add(ref));
  });
  (unit.keyTerms || []).forEach((term) => {
    extractScriptureReferences(`${term?.term || ''} ${term?.definition || ''}`).forEach((ref) => refs.add(ref));
  });
  return Array.from(refs);
};

const buildActionAssessmentTasks = (unit = {}, courseSourceRefs = [], variantSeed = 'default') => {
  const rand = createSeededRandom(hashString(`${variantSeed}:${unit?.id || unit?.title || 'unit'}`));
  const keyTerms = (unit.keyTerms || []).map((item) => String(item?.term || '').trim()).filter(Boolean);
  const headings = (unit.content || []).map((item) => String(item?.heading || '').trim()).filter(Boolean);
  const unitRefs = collectUnitReferences(unit);
  const primaryRefs = seededSample(unitRefs, Math.min(3, unitRefs.length), rand);
  const distractorRefs = seededSample(courseSourceRefs.filter((ref) => !unitRefs.includes(ref)), 3, rand);
  const scriptureOptions = seededShuffle(Array.from(new Set([...primaryRefs, ...distractorRefs])).slice(0, 6), rand);
  const doctrinePairs = seededSample(unit.keyTerms || [], 5, rand).map((item) => ({
    term: String(item?.term || '').trim(),
    definition: String(item?.definition || '').trim()
  })).filter((item) => item.term && item.definition);

  const headingPool = headings.length > 0 ? headings : [unit.title || 'this unit'];
  const firstHeading = headingPool[Math.floor(rand() * headingPool.length)] || unit.title || 'this unit';
  const secondHeading = headingPool[Math.floor(rand() * headingPool.length)] || firstHeading;
  const firstTerm = keyTerms[Math.floor(rand() * Math.max(keyTerms.length, 1))] || 'the core doctrine';
  const secondTerm = keyTerms[Math.floor(rand() * Math.max(keyTerms.length, 1))] || 'the supporting evidence';

  const voiceTemplates = [
    `Teach "${firstHeading}" in 60 seconds and include ${firstTerm}${primaryRefs[0] ? ` with at least one reference such as ${primaryRefs[0]}` : ''}.`,
    `Give a concise spoken defense of "${firstHeading}" in 60 seconds. Use ${firstTerm}${primaryRefs[0] ? ` and cite ${primaryRefs[0]} or another unit verse` : ''}.`,
    `Explain "${firstHeading}" as if mentoring a new learner. Speak for ~60 seconds and ground your claim in ${firstTerm}${primaryRefs[0] ? ` plus Scripture (for example ${primaryRefs[0]})` : ''}.`
  ];

  const debateClaims = [
    `${unit.title || 'This topic'} is mostly symbolic and does not require textual grounding.`,
    `Key terms in ${unit.title || 'this unit'} are optional because doctrine can stand without definitions.`,
    `Context is secondary for ${unit.title || 'this unit'}; isolated proof-texts are enough.`
  ];

  const debateOptionPool = [
    {
      text: `Ground interpretation in ${secondHeading} and explicit textual evidence; symbolism must still follow context.`,
      correct: true
    },
    { text: 'Treat all viewpoints as equal and avoid evaluating evidence.', correct: false },
    { text: 'Skip Scripture references and rely only on tradition.', correct: false },
    { text: `Ignore ${secondTerm} because definitions are not necessary.`, correct: false }
  ];
  const shuffledDebateOptions = seededShuffle(debateOptionPool, rand);
  const correctDebateIndex = shuffledDebateOptions.findIndex((item) => item.correct);

  return [
    {
      type: 'voice',
      title: 'Voice-Only Response',
      prompt: voiceTemplates[Math.floor(rand() * voiceTemplates.length)],
      expectedTerms: keyTerms.slice(0, 4),
      expectedReferences: primaryRefs,
      minWords: 30
    },
    {
      type: 'scriptureTap',
      title: 'Tap Scripture Selection (Timed)',
      prompt: `Which references best support ${unit.title || 'this unit'}? Select all that apply.`,
      options: scriptureOptions,
      correctOptions: primaryRefs,
      targetMs: 30000
    },
    {
      type: 'debateTap',
      title: 'Real-Time Debate Counter',
      prompt: `Claim: "${debateClaims[Math.floor(rand() * debateClaims.length)]}" Pick the strongest counter-response.`,
      options: shuffledDebateOptions.map((item) => item.text),
      correctIndex: correctDebateIndex,
      targetMs: 20000
    },
    {
      type: 'doctrineBuilder',
      title: 'Doctrine Builder',
      prompt: 'Match each key term with its correct definition.',
      pairs: doctrinePairs
    }
  ];
};

const scoreActionTask = ({ task, response, elapsedMs }) => {
  if (!task || !task.type) return null;

  if (task.type === 'voice') {
    const transcript = String(response?.transcript || '').trim();
    const words = transcript.split(/\s+/).filter(Boolean);
    const lower = transcript.toLowerCase();
    const references = extractScriptureReferences(transcript);
    const expectedTerms = (task.expectedTerms || []).map((item) => String(item || '').toLowerCase()).filter(Boolean);
    const matchedTerms = expectedTerms.filter((term) => lower.includes(term));
    const sentenceCount = transcript.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length || 1;
    const connectors = (lower.match(/\btherefore\b|\bbecause\b|\bhowever\b|\bthus\b|\bso\b|\bfor\b/g) || []).length;
    const structureScore = words.length >= task.minWords ? 20 : words.length >= Math.floor((task.minWords || 30) * 0.7) ? 14 : 8;
    const keyTermScore = clampScore(Math.round((matchedTerms.length / Math.max(expectedTerms.length, 1)) * 35), 8, 35);
    const referenceScore = references.length >= 2 ? 25 : references.length === 1 ? 17 : 8;
    const clarityScore = (sentenceCount >= 3 && connectors >= 1) ? 20 : sentenceCount >= 2 ? 14 : 8;
    const total = clampScore(structureScore + keyTermScore + referenceScore + clarityScore);
    const confidence = clampScore(Math.round((clarityScore * 0.45) + (structureScore * 0.35) + (keyTermScore * 0.2)));
    const passed = total >= 70;
    const feedback = [];
    if (matchedTerms.length < Math.max(1, Math.min(2, expectedTerms.length))) feedback.push('Use more key terms from this unit in your verbal explanation.');
    if (references.length < 1) feedback.push('Cite at least one explicit Scripture reference while speaking.');
    if (words.length < task.minWords) feedback.push(`Expand your explanation to roughly ${task.minWords}+ words for full depth.`);
    if (feedback.length === 0) feedback.push('Strong spoken explanation with unit terminology and textual grounding.');

    return {
      rubric: {
        textualEvidence: referenceScore,
        keyTermIntegration: keyTermScore,
        argumentation: clarityScore,
        depthAndCompleteness: structureScore,
        total,
        passed
      },
      feedback,
      meta: {
        mode: 'voice',
        confidence,
        referenceCount: references.length,
        matchedTerms: matchedTerms.length,
        elapsedMs: elapsedMs || null,
        transcript
      }
    };
  }

  if (task.type === 'scriptureTap') {
    const selected = Array.isArray(response?.selected) ? response.selected : [];
    const correctSet = new Set(task.correctOptions || []);
    const selectedSet = new Set(selected);
    const correctHits = Array.from(selectedSet).filter((item) => correctSet.has(item)).length;
    const misses = Array.from(correctSet).filter((item) => !selectedSet.has(item)).length;
    const wrongHits = Array.from(selectedSet).filter((item) => !correctSet.has(item)).length;
    const precision = correctHits / Math.max(selectedSet.size, 1);
    const recall = correctHits / Math.max(correctSet.size, 1);
    const accuracyScore = clampScore(Math.round(((precision + recall) / 2) * 60));
    const speedScore = clampScore(Math.round(((task.targetMs || 30000) / Math.max(elapsedMs || task.targetMs || 30000, 1)) * 20), 4, 20);
    const selectionDiscipline = wrongHits === 0 ? 20 : wrongHits === 1 ? 12 : 6;
    const total = clampScore(accuracyScore + speedScore + selectionDiscipline);
    const passed = total >= 70;
    const feedback = [];
    if (misses > 0) feedback.push(`You missed ${misses} supporting reference${misses === 1 ? '' : 's'}.`);
    if (wrongHits > 0) feedback.push(`You selected ${wrongHits} distractor reference${wrongHits === 1 ? '' : 's'}.`);
    if ((elapsedMs || 0) > (task.targetMs || 30000)) feedback.push('Work on faster recognition under the time target.');
    if (feedback.length === 0) feedback.push('Excellent Scripture recognition with strong speed and precision.');

    return {
      rubric: {
        textualEvidence: accuracyScore,
        keyTermIntegration: selectionDiscipline,
        argumentation: speedScore,
        depthAndCompleteness: 20,
        total,
        passed
      },
      feedback,
      meta: {
        mode: 'tap',
        correctHits,
        misses,
        wrongHits,
        elapsedMs: elapsedMs || null
      }
    };
  }

  if (task.type === 'debateTap') {
    const selectedIndex = Number(response?.selectedIndex);
    const correct = selectedIndex === Number(task.correctIndex);
    const speedScore = clampScore(Math.round(((task.targetMs || 20000) / Math.max(elapsedMs || task.targetMs || 20000, 1)) * 25), 6, 25);
    const doctrinalScore = correct ? 55 : 22;
    const total = clampScore(doctrinalScore + speedScore + (correct ? 20 : 8));
    const passed = total >= 70;
    return {
      rubric: {
        textualEvidence: correct ? 22 : 10,
        keyTermIntegration: correct ? 18 : 8,
        argumentation: correct ? 35 : 14,
        depthAndCompleteness: speedScore,
        total,
        passed
      },
      feedback: correct
        ? ['Strong counter-response: your choice aligns with context-first reasoning.']
        : ['Choose the response that anchors the argument in context and textual evidence.'],
      meta: {
        mode: 'tap',
        selectedIndex,
        correctIndex: task.correctIndex,
        elapsedMs: elapsedMs || null
      }
    };
  }

  if (task.type === 'doctrineBuilder') {
    const pairs = Array.isArray(task.pairs) ? task.pairs : [];
    const mapping = response?.mapping && typeof response.mapping === 'object' ? response.mapping : {};
    const correctCount = pairs.filter((_, termIdx) => Number(mapping[termIdx]) === termIdx).length;
    const accuracy = correctCount / Math.max(pairs.length, 1);
    const total = clampScore(Math.round(accuracy * 100));
    const passed = total >= 70;
    return {
      rubric: {
        textualEvidence: clampScore(Math.round(accuracy * 25)),
        keyTermIntegration: clampScore(Math.round(accuracy * 35)),
        argumentation: clampScore(Math.round(accuracy * 20)),
        depthAndCompleteness: clampScore(Math.round(accuracy * 20)),
        total,
        passed
      },
      feedback: passed
        ? ['Doctrine mapping is accurate and shows term-definition fluency.']
        : ['Rebuild the mappings until each term is paired with its exact unit definition.'],
      meta: {
        mode: 'tap',
        correctCount,
        totalPairs: pairs.length,
        elapsedMs: elapsedMs || null
      }
    };
  }

  return null;
};

const normalizeProgressPayload = (payload = {}) => {
  const completedLessons = Array.isArray(payload.completedLessons)
    ? Array.from(new Set(payload.completedLessons.map(normalizeUnitId).filter(Boolean)))
    : [];
  const completedQuizzes = Array.isArray(payload.completedQuizzes)
    ? Array.from(new Set(payload.completedQuizzes.map(normalizeUnitId).filter(Boolean)))
    : [];
  const requiredWorkRecords = normalizeRequiredWorkRecords(payload.requiredWorkRecords);
  const actionVariantAttempts = payload?.actionVariantAttempts && typeof payload.actionVariantAttempts === 'object'
    ? Object.entries(payload.actionVariantAttempts).reduce((acc, [unitId, attempt]) => {
        const safeUnitId = normalizeUnitId(unitId);
        if (!safeUnitId) return acc;
        const parsed = Number(attempt);
        acc[safeUnitId] = Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
        return acc;
      }, {})
    : {};

  return {
    completedLessons,
    completedQuizzes,
    examCompleted: Boolean(payload.examCompleted),
    requiredWorkRecords,
    actionVariantAttempts
  };
};

const arraysEqual = (a = [], b = []) => (
  a.length === b.length && a.every((value, index) => value === b[index])
);

const ComprehensiveCourse = ({
  courseData: rawCourseData,
  progressKey,
  onCompleteCourseId,
  userId,
  userData,
  setUserData,
  onComplete,
  onCancel
}) => {
  const courseData = useMemo(() => applyAssociateProgramRigor(rawCourseData), [rawCourseData]);
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
  const [actionInteractions, setActionInteractions] = useState({});
  const [voiceCaptureState, setVoiceCaptureState] = useState({ activeTaskIndex: null, listening: false, error: '' });
  const scriptureCacheRef = useRef(new Map());
  const recognitionRef = useRef(null);
  const assessmentProfileId = useMemo(() => {
    if (userId) return `uid:${userId}`;
    if (typeof window === 'undefined') return 'anon';
    const storageKey = 'actionAssessmentProfileId';
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) return existing;
      const generated = `anon-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(storageKey, generated);
      return generated;
    } catch (err) {
      return 'anon';
    }
  }, [userId]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // no-op
        }
      }
    };
  }, []);

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
  const [requiredWorkRecords, setRequiredWorkRecords] = useState(() => {
    return savedProgress.requiredWorkRecords || {};
  });
  const [actionVariantAttempts, setActionVariantAttempts] = useState(() => {
    return savedProgress.actionVariantAttempts || {};
  });
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (userData?.[progressKey]) {
      const p = normalizeProgressPayload(userData[progressKey]);
      setCompletedLessons(prev => (arraysEqual(prev, p.completedLessons) ? prev : p.completedLessons));
      setCompletedQuizzes(prev => (arraysEqual(prev, p.completedQuizzes) ? prev : p.completedQuizzes));
      setExamCompleted(prev => (prev === p.examCompleted ? prev : p.examCompleted));
      const nextSerialized = JSON.stringify(p.requiredWorkRecords || {});
      const prevSerialized = JSON.stringify(requiredWorkRecords || {});
      if (nextSerialized !== prevSerialized) setRequiredWorkRecords(p.requiredWorkRecords || {});
      const nextAttemptSerialized = JSON.stringify(p.actionVariantAttempts || {});
      const prevAttemptSerialized = JSON.stringify(actionVariantAttempts || {});
      if (nextAttemptSerialized !== prevAttemptSerialized) setActionVariantAttempts(p.actionVariantAttempts || {});
    }
  }, [userData, progressKey, requiredWorkRecords, actionVariantAttempts]);

  useEffect(() => {
    setExamQuestions(buildFinalExamFromCourse(courseData));
  }, [courseData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const progressPayload = normalizeProgressPayload({ completedLessons, completedQuizzes, examCompleted, requiredWorkRecords, actionVariantAttempts });
    localStorage.setItem(progressKey, JSON.stringify(progressPayload));
    if (setUserData) setUserData(prev => ({ ...prev, [progressKey]: progressPayload }));
    if (userId) updateUserProgress(userId, { [progressKey]: progressPayload }).catch(err =>
      console.error(`Error saving ${progressKey}:`, err)
    );
  }, [completedLessons, completedQuizzes, examCompleted, requiredWorkRecords, actionVariantAttempts, userId, setUserData, progressKey]);

  const requiredWorkUnitCount = useMemo(() => {
    return (courseData.units || []).filter((unit) => Array.isArray(unit?.requiredWork) && unit.requiredWork.length > 0).length;
  }, [courseData.units]);
  const getUnitActionVariantSeed = useCallback((unit) => {
    const unitId = normalizeUnitId(unit?.id);
    const attemptIndex = Number(actionVariantAttempts?.[unitId] || 0);
    return `${assessmentProfileId}:${courseData.id || 'course'}:${unitId}:${unit?.title || 'unit'}:attempt-${attemptIndex}`;
  }, [assessmentProfileId, courseData.id, actionVariantAttempts]);
  const completedRequiredWorkCount = useMemo(() => {
    return (courseData.units || []).filter((unit) => {
      if (!Array.isArray(unit?.requiredWork) || unit.requiredWork.length === 0) return false;
      const unitId = normalizeUnitId(unit.id);
      const unitRecords = requiredWorkRecords[unitId] || {};
      const unitActionTasks = buildActionAssessmentTasks(unit, courseSourceIndex, getUnitActionVariantSeed(unit));
      return unitActionTasks.every((_, taskIndex) => Boolean(unitRecords?.[taskIndex]?.rubric?.passed));
    }).length;
  }, [courseData.units, requiredWorkRecords, courseSourceIndex, getUnitActionVariantSeed]);

  const totalSteps = courseData.units.length * 2 + requiredWorkUnitCount + 1;
  const completedSteps = completedLessons.length + completedQuizzes.length + completedRequiredWorkCount + (examCompleted ? 1 : 0);
  const progress = Math.round((completedSteps / Math.max(totalSteps, 1)) * 100);

  const quizPassPercentage = courseData.quizPassPercentage
    ?? (courseData.quizPassScore ? Math.round((courseData.quizPassScore / 5) * 100) : 80);
  const isLanguageCourse = /language course/i.test(courseData.subtitle || '');
  const bibliography = useMemo(() => getCourseBibliography(courseData), [courseData]);
  const rigorProfile = courseData.rigorProfile || null;
  const openRef = (ref) => openReferenceInBibleReader(ref, onCancel);
  const courseSourceIndex = useMemo(() => {
    const refs = new Set();
    (courseData.units || []).forEach((unit) => {
      (unit.content || []).forEach((section) => {
        extractScriptureReferences(section?.text || '').forEach(ref => refs.add(ref));
      });
      (unit.quiz || []).forEach((question) => {
        extractScriptureReferences(`${question?.question || ''} ${question?.explanation || ''}`).forEach(ref => refs.add(ref));
      });
      (unit.keyTerms || []).forEach((kt) => {
        extractScriptureReferences(`${kt?.term || ''} ${kt?.definition || ''}`).forEach(ref => refs.add(ref));
      });
    });
    return Array.from(refs);
  }, [courseData]);

  const selectedUnitSourceIndex = useMemo(() => {
    if (selectedUnit === null) return [];
    const unit = courseData.units?.[selectedUnit];
    if (!unit) return [];
    const refs = new Set();
    (unit.content || []).forEach((section) => {
      extractScriptureReferences(section?.text || '').forEach(ref => refs.add(ref));
    });
    (unit.quiz || []).forEach((question) => {
      extractScriptureReferences(`${question?.question || ''} ${question?.explanation || ''}`).forEach(ref => refs.add(ref));
    });
    (unit.keyTerms || []).forEach((kt) => {
      extractScriptureReferences(`${kt?.term || ''} ${kt?.definition || ''}`).forEach(ref => refs.add(ref));
    });
    return Array.from(refs);
  }, [selectedUnit, courseData]);

  const actionTasks = useMemo(() => {
    if (selectedUnit === null) return [];
    const unit = courseData.units?.[selectedUnit];
    if (!unit || !Array.isArray(unit.requiredWork) || unit.requiredWork.length === 0) return [];
    return buildActionAssessmentTasks(unit, courseSourceIndex, getUnitActionVariantSeed(unit));
  }, [selectedUnit, courseData, courseSourceIndex, getUnitActionVariantSeed]);

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

  const examPassPercentage = courseData.examPassPercentage || FINAL_EXAM_PASS_PERCENT;
  const examPassScore = useMemo(() => {
    return Math.ceil((examPassPercentage / 100) * examQuestions.length);
  }, [examPassPercentage, examQuestions.length]);

  const getQuizPassScore = (unit) => {
    const questionCount = Array.isArray(unit?.quiz) ? unit.quiz.length : 0;
    if (questionCount <= 0) return 0;
    return Math.ceil((quizPassPercentage / 100) * questionCount);
  };

  const getUnitRecordMap = (unitId) => {
    return requiredWorkRecords[normalizeUnitId(unitId)] || {};
  };

  const getTaskRecord = (unitId, taskIndex) => {
    const recordMap = getUnitRecordMap(unitId);
    return recordMap?.[taskIndex] || null;
  };

  const getEffectiveRubric = (taskRecord, unitId, taskIndex) => {
    const localReview = findRequiredWorkReview({
      userId,
      progressKey,
      unitId: normalizeUnitId(unitId),
      taskIndex
    });
    if (localReview?.instructorReview?.rubric) return localReview.instructorReview.rubric;
    if (taskRecord?.instructorReview?.rubric) return taskRecord.instructorReview.rubric;
    return taskRecord?.rubric || null;
  };

  const getEffectiveTaskRecord = (unitId, taskIndex) => {
    const base = getTaskRecord(unitId, taskIndex);
    const localReview = findRequiredWorkReview({
      userId,
      progressKey,
      unitId: normalizeUnitId(unitId),
      taskIndex
    });
    if (!localReview?.instructorReview) return base;
    return {
      ...base,
      instructorReview: localReview.instructorReview,
      rubric: localReview.instructorReview.rubric || base?.rubric || null,
      feedback: localReview.instructorReview.feedback || base?.feedback || []
    };
  };

  const isUnitRequiredWorkComplete = (unit) => {
    const tasks = Array.isArray(unit?.requiredWork) ? unit.requiredWork : [];
    if (tasks.length === 0) return true;
    const unitActionTasks = buildActionAssessmentTasks(unit, courseSourceIndex, getUnitActionVariantSeed(unit));
    return unitActionTasks.every((_, taskIndex) => {
      const record = getTaskRecord(unit.id, taskIndex);
      const rubric = getEffectiveRubric(record, unit.id, taskIndex);
      return Boolean(rubric?.passed);
    });
  };

  useEffect(() => {
    setActionInteractions({});
    setVoiceCaptureState({ activeTaskIndex: null, listening: false, error: '' });
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // no-op
      }
      recognitionRef.current = null;
    }
  }, [selectedUnit]);

  const stopVoiceCapture = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // no-op
      }
      recognitionRef.current = null;
    }
    setVoiceCaptureState((prev) => ({ ...prev, listening: false, activeTaskIndex: null }));
  };

  const startVoiceCapture = (taskIndex) => {
    const Recognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;
    if (!Recognition) {
      setVoiceCaptureState({ activeTaskIndex: null, listening: false, error: 'Voice capture is not supported in this browser. Use a Chromium-based browser on HTTPS.' });
      return;
    }

    stopVoiceCapture();
    setVoiceCaptureState({ activeTaskIndex: taskIndex, listening: true, error: '' });

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += `${event.results[i][0].transcript} `;
      }
      setActionInteractions((prev) => {
        const current = prev[taskIndex] || {};
        return {
          ...prev,
          [taskIndex]: {
            ...current,
            startedAt: current.startedAt || Date.now(),
            transcript: transcript.trim()
          }
        };
      });
    };
    recognition.onerror = (event) => {
      setVoiceCaptureState({ activeTaskIndex: null, listening: false, error: event?.error || 'Voice capture failed.' });
    };
    recognition.onend = () => {
      setVoiceCaptureState((prev) => ({ ...prev, listening: false, activeTaskIndex: null }));
      recognitionRef.current = null;
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const rotateActionVariant = (unit) => {
    const unitId = normalizeUnitId(unit?.id);
    if (!unitId) return;
    stopVoiceCapture();
    setActionInteractions({});
    setRequiredWorkRecords((prev) => {
      const next = { ...prev };
      delete next[unitId];
      return next;
    });
    setActionVariantAttempts((prev) => ({
      ...prev,
      [unitId]: Number(prev?.[unitId] || 0) + 1
    }));
  };

  const evaluateActionTask = (unit, task, taskIndex) => {
    const unitId = normalizeUnitId(unit.id);
    const variantAttempt = Number(actionVariantAttempts?.[unitId] || 0);
    const taskState = actionInteractions?.[taskIndex] || {};
    const startedAt = Number(taskState.startedAt || Date.now());
    const elapsedMs = Math.max(0, Date.now() - startedAt);
    const response = {
      transcript: taskState.transcript || '',
      selected: taskState.selected || [],
      selectedIndex: taskState.selectedIndex,
      mapping: taskState.mapping || {}
    };
    const evaluation = scoreActionTask({ task, response, elapsedMs });
    if (!evaluation) return;
    const evaluatedAt = new Date().toISOString();
    const summary = JSON.stringify({
      taskType: task.type,
      taskTitle: task.title,
      response,
      elapsedMs,
      meta: { ...(evaluation.meta || {}), variantAttempt }
    });

    setRequiredWorkRecords((prev) => {
      const next = { ...prev };
      const currentUnit = { ...(next[unitId] || {}) };
      currentUnit[taskIndex] = {
        submissionText: summary,
        submittedAt: evaluatedAt,
        meta: { ...(evaluation.meta || {}), variantAttempt },
        rubric: evaluation.rubric,
        feedback: evaluation.feedback,
        evaluatedAt,
        instructorReview: null
      };
      next[unitId] = currentUnit;
      return next;
    });

    enqueueRequiredWorkSubmission({
      userId,
      progressKey,
      courseId: courseData.id,
      courseTitle: courseData.title,
      unitId,
      unitTitle: unit.title,
      taskIndex,
      taskTitle: task.title || `Task ${taskIndex + 1}`,
      submissionText: summary,
      autoRubric: evaluation.rubric,
      autoFeedback: evaluation.feedback,
      submittedAt: evaluatedAt,
      status: 'pending_instructor_review'
    });
  };

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
    const quizPassScore = getQuizPassScore(unit);
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
        examCompleted,
        requiredWorkRecords,
        actionVariantAttempts
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
    const quizPassScore = getQuizPassScore(unit);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('lesson')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <ArrowLeft size={20} /> Back to Lesson
            </button>
            <h2 className="text-xl font-bold text-white">Unit {unit.id} Quiz</h2>
          </div>
          <p className="text-slate-400 mb-4">
            {unit.title} | {unit.quiz.length} questions | pass threshold: {quizPassScore}/{unit.quiz.length} ({quizPassPercentage}%)
          </p>
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
              {examQuestions.length} questions ({Math.round((1 - FINAL_EXAM_NOVEL_RATIO) * 100)}% quiz review, {Math.round(FINAL_EXAM_NOVEL_RATIO * 100)}% new lesson-based). You need {examPassScore}/{examQuestions.length} ({examPassPercentage}%).
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
    const workDone = isUnitRequiredWorkComplete(unit);
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
              {Array.isArray(unit.requiredWork) && unit.requiredWork.length > 0 && workDone && <span className="text-sm flex items-center gap-1 text-indigo-300"><Book size={16} /> Work Passed</span>}
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
          <div className="bg-slate-800/60 rounded-xl p-5 border border-indigo-500/30 mb-6">
            <h3 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
              <Scroll size={16} />
              Unit Outcomes And Sequence
            </h3>
            {Array.isArray(unit.learningObjectives) && unit.learningObjectives.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wide text-indigo-400 mb-2">Learning Objectives</p>
                <ul className="space-y-2">
                  {unit.learningObjectives.map((objective, oi) => (
                    <li key={`obj-${oi}`} className="text-sm text-slate-200">- {objective}</li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(unit.requiredWork) && unit.requiredWork.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-400 mb-2">Unit Flow</p>
                <p className="text-sm text-slate-300 mb-2">1) Lesson material  2) Unit quiz  3) Action assessment</p>
                <p className="text-xs uppercase tracking-wide text-amber-400 mb-2 mt-3">Action Tasks (No Typing)</p>
                <ul className="space-y-2">
                  {actionTasks.map((task, ti) => (
                    <li key={`action-${ti}`} className="text-sm text-slate-200">- {task.title}: {task.prompt}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 mt-3">Action assessment unlocks after quiz pass and appears at the end of this unit page.</p>
              </div>
            )}
          </div>
          {selectedUnitSourceIndex.length > 0 && (
            <div className="bg-slate-800/60 rounded-xl p-4 border border-teal-500/30 mb-6">
              <h3 className="text-sm font-bold text-teal-300 mb-2 flex items-center gap-2">
                <BookOpen size={16} />
                Unit Source Index
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedUnitSourceIndex.slice(0, 24).map((ref) => (
                  <button
                    key={ref}
                    onClick={() => openRef(ref)}
                    className="px-2 py-1 rounded border border-teal-500/30 bg-teal-900/20 text-xs text-teal-200 hover:bg-teal-800/40 transition-colors"
                    title="Open in Bible Reader"
                  >
                    {ref}
                  </button>
                ))}
              </div>
              {selectedUnitSourceIndex.length > 24 && (
                <p className="text-xs text-slate-400 mt-2">
                  Showing 24 of {selectedUnitSourceIndex.length} detected references.
                </p>
              )}
            </div>
          )}
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

            {Array.isArray(unit.requiredWork) && unit.requiredWork.length > 0 && (
              <div className="bg-slate-800/60 rounded-xl p-5 border border-violet-500/30">
                <h3 className="text-sm font-bold text-violet-300 mb-3 flex items-center gap-2">
                  <Book size={16} />
                  Action Assessment (Final Step Of Unit)
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-400">
                    Variant Set: {Number(actionVariantAttempts?.[unitId] || 0) + 1}
                  </p>
                  {quizDone && !workDone && (
                    <button
                      onClick={() => rotateActionVariant(unit)}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                    >
                      Load New Variant
                    </button>
                  )}
                </div>
                {!quizDone ? (
                  <div className="rounded border border-amber-500/40 bg-amber-900/20 p-3 text-sm text-amber-200">
                    Complete and pass the unit quiz first. Action assessment unlocks after quiz pass.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {actionTasks.map((task, taskIndex) => {
                      const record = getEffectiveTaskRecord(unitId, taskIndex);
                      const rubric = record?.rubric || null;
                      const hasPass = Boolean(rubric?.passed);
                      const instructorReview = record?.instructorReview || null;
                      const interaction = actionInteractions?.[taskIndex] || {};
                      const selectedScriptures = Array.isArray(interaction.selected) ? interaction.selected : [];
                      const selectedDebateIndex = Number.isInteger(interaction.selectedIndex) ? interaction.selectedIndex : null;
                      const doctrinePairs = Array.isArray(task.pairs) ? task.pairs : [];
                      const doctrineMapping = interaction.mapping && typeof interaction.mapping === 'object' ? interaction.mapping : {};
                      const voiceTranscript = String(interaction.transcript || '');

                      return (
                        <div key={`submission-${taskIndex}`} className={`rounded-lg border p-4 ${hasPass ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-slate-600 bg-slate-900/40'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-100">Task {taskIndex + 1}: {task.title}</p>
                            {rubric && (
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${hasPass ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'}`}>
                                {rubric.total}% {hasPass ? 'Passed' : 'Needs Revision'}{instructorReview ? ' (Instructor)' : ' (Auto)'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mb-3">{task.prompt}</p>

                          {task.type === 'voice' && (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => startVoiceCapture(taskIndex)}
                                  className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                >
                                  Start Mic
                                </button>
                                <button
                                  onClick={stopVoiceCapture}
                                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                                >
                                  Stop Mic
                                </button>
                                {voiceCaptureState.listening && voiceCaptureState.activeTaskIndex === taskIndex && (
                                  <span className="text-xs text-emerald-300">Listening...</span>
                                )}
                              </div>
                              {voiceCaptureState.error && (
                                <p className="text-xs text-red-300">{voiceCaptureState.error}</p>
                              )}
                              <div className="rounded border border-slate-600 bg-slate-950/60 p-3 min-h-[84px]">
                                <p className="text-xs text-slate-300 whitespace-pre-wrap">
                                  {voiceTranscript || 'Transcript will appear here after speaking.'}
                                </p>
                              </div>
                              {record?.meta?.confidence !== undefined && (
                                <p className="text-xs text-indigo-300">Confidence Score: {record.meta.confidence}%</p>
                              )}
                            </div>
                          )}

                          {task.type === 'scriptureTap' && (
                            <div className="space-y-2">
                              <p className="text-xs text-amber-300">Timed target: {(task.targetMs || 30000) / 1000}s</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(task.options || []).map((refOption) => {
                                  const selected = selectedScriptures.includes(refOption);
                                  return (
                                    <button
                                      key={`${taskIndex}-${refOption}`}
                                      onClick={() => setActionInteractions((prev) => {
                                        const current = prev[taskIndex] || {};
                                        const currentSelected = Array.isArray(current.selected) ? current.selected : [];
                                        const nextSelected = currentSelected.includes(refOption)
                                          ? currentSelected.filter((item) => item !== refOption)
                                          : [...currentSelected, refOption];
                                        return {
                                          ...prev,
                                          [taskIndex]: {
                                            ...current,
                                            startedAt: current.startedAt || Date.now(),
                                            selected: nextSelected
                                          }
                                        };
                                      })}
                                      className={`text-left px-3 py-2 rounded border text-xs transition-all ${selected ? 'bg-indigo-900/40 border-indigo-400 text-indigo-200' : 'bg-slate-900/40 border-slate-600 text-slate-300 hover:border-indigo-400'}`}
                                    >
                                      {refOption}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {task.type === 'debateTap' && (
                            <div className="space-y-2">
                              <p className="text-xs text-amber-300">Timed target: {(task.targetMs || 20000) / 1000}s</p>
                              {(task.options || []).map((optionText, optionIndex) => {
                                const selected = selectedDebateIndex === optionIndex;
                                return (
                                  <button
                                    key={`${taskIndex}-debate-${optionIndex}`}
                                    onClick={() => setActionInteractions((prev) => {
                                      const current = prev[taskIndex] || {};
                                      return {
                                        ...prev,
                                        [taskIndex]: {
                                          ...current,
                                          startedAt: current.startedAt || Date.now(),
                                          selectedIndex: optionIndex
                                        }
                                      };
                                    })}
                                    className={`w-full text-left px-3 py-2 rounded border text-xs transition-all ${selected ? 'bg-indigo-900/40 border-indigo-400 text-indigo-200' : 'bg-slate-900/40 border-slate-600 text-slate-300 hover:border-indigo-400'}`}
                                  >
                                    {optionText}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {task.type === 'doctrineBuilder' && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  {(doctrinePairs || []).map((pair, termIdx) => {
                                    const mapped = doctrineMapping[termIdx];
                                    return (
                                      <div key={`${taskIndex}-term-${termIdx}`} className="rounded border border-slate-600 bg-slate-900/40 p-2">
                                        <p className="text-xs text-amber-200 mb-1">{pair.term}</p>
                                        <select
                                          value={mapped === undefined ? '' : String(mapped)}
                                          onChange={(e) => {
                                            const next = e.target.value === '' ? undefined : Number(e.target.value);
                                            setActionInteractions((prev) => {
                                              const current = prev[taskIndex] || {};
                                              return {
                                                ...prev,
                                                [taskIndex]: {
                                                  ...current,
                                                  startedAt: current.startedAt || Date.now(),
                                                  mapping: { ...(current.mapping || {}), [termIdx]: next }
                                                }
                                              };
                                            });
                                          }}
                                          className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                                        >
                                          <option value="">Select definition</option>
                                          {doctrinePairs.map((defPair, defIdx) => (
                                            <option key={`${taskIndex}-def-${defIdx}`} value={defIdx}>{defPair.definition}</option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="rounded border border-indigo-500/30 bg-indigo-900/10 p-3">
                                  <p className="text-xs font-semibold text-indigo-300 mb-2">Definitions</p>
                                  <ol className="space-y-2">
                                    {doctrinePairs.map((pair, index) => (
                                      <li key={`${taskIndex}-legend-${index}`} className="text-xs text-slate-300">{index + 1}. {pair.definition}</li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-slate-500">
                              Last evaluated: {record?.evaluatedAt ? new Date(record.evaluatedAt).toLocaleString() : 'not yet'}
                            </p>
                            <button
                              onClick={() => evaluateActionTask(unit, task, taskIndex)}
                              className="px-3 py-1.5 text-xs font-semibold rounded bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                            >
                              Evaluate With Rubric
                            </button>
                          </div>
                          {rubric && (
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                              <p>Textual Evidence: <span className="text-violet-300">{rubric.textualEvidence}/25</span></p>
                              <p>Key Terms: <span className="text-violet-300">{rubric.keyTermIntegration}/25</span></p>
                              <p>Argumentation: <span className="text-violet-300">{rubric.argumentation}/25</span></p>
                              <p>Depth: <span className="text-violet-300">{rubric.depthAndCompleteness}/25</span></p>
                            </div>
                          )}
                          {Array.isArray(record?.feedback) && record.feedback.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {record.feedback.map((item, index) => (
                                <li key={`fb-${taskIndex}-${index}`} className="text-xs text-slate-300">- {item}</li>
                              ))}
                            </ul>
                          )}
                          {instructorReview && (
                            <div className="mt-3 rounded border border-indigo-500/40 bg-indigo-900/20 p-3">
                              <p className="text-xs text-indigo-300 font-semibold">
                                Instructor Review: {instructorReview.reviewer || 'Instructor'} {instructorReview.reviewedAt ? `| ${new Date(instructorReview.reviewedAt).toLocaleString()}` : ''}
                              </p>
                              {instructorReview.plagiarismCheck && (
                                <p className="text-xs text-slate-300 mt-1">Plagiarism Check: {instructorReview.plagiarismCheck}</p>
                              )}
                              {instructorReview.notes && (
                                <p className="text-xs text-slate-300 mt-1">Notes: {instructorReview.notes}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <p className={`text-xs font-semibold ${workDone ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {workDone ? 'All action-assessment tasks for this unit are passed.' : 'Pass every action task (70%+) to unlock final exam eligibility.'}
                    </p>
                  </div>
                )}
              </div>
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

  const allUnitsReadyForExam = courseData.units.every((unit) => {
    return completedQuizzes.includes(normalizeUnitId(unit.id));
  });
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
          <div className="text-slate-400 text-sm mt-2">
            {completedLessons.length} lessons read | {completedQuizzes.length} quizzes passed{requiredWorkUnitCount > 0 ? ` | ${completedRequiredWorkCount}/${requiredWorkUnitCount} action-assessment units passed` : ''} | {examCompleted ? 'Exam passed' : 'Exam pending'}
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {courseData.units.map((unit, idx) => {
            const unitId = normalizeUnitId(unit.id);
            const lessonDone = completedLessons.includes(unitId);
            const quizDone = completedQuizzes.includes(unitId);
            const workDone = isUnitRequiredWorkComplete(unit);
            const rowComplete = lessonDone && quizDone && workDone;
            const displayIcon = sanitizeDisplayIcon(unit.icon);
            return (
              <button key={unitId} onClick={() => { setSelectedUnit(idx); setCurrentView('lesson'); window.scrollTo(0, 0); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${rowComplete ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50 hover:border-emerald-400' : 'bg-slate-800/50 border-blue-500/30 hover:border-blue-400 hover:bg-slate-800/70'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{displayIcon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-mono">Unit {unitId}</span>
                        {lessonDone && <CheckCircle size={14} className="text-emerald-400" />}
                        {quizDone && <Award size={14} className="text-amber-400" />}
                        {Array.isArray(unit.requiredWork) && unit.requiredWork.length > 0 && workDone && <Book size={14} className="text-indigo-400" />}
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
        <div className={`rounded-xl p-6 border-2 text-center ${allUnitsReadyForExam ? `bg-gradient-to-r from-amber-900/30 to-orange-900/30 ${theme.examBorder}` : 'bg-slate-800/30 border-slate-700'}`}>
          <Trophy size={32} className={allUnitsReadyForExam ? 'text-amber-400 mx-auto mb-3' : 'text-slate-600 mx-auto mb-3'} />
          <h3 className="text-xl font-bold text-white mb-2">Final Exam</h3>
          <p className="text-slate-400 text-sm mb-4">
            {allUnitsReadyForExam
              ? 'All unit quizzes passed. You are ready for the final exam.'
              : `Pass all ${courseData.units.length} unit quizzes to unlock the final exam.`}
          </p>
          {examCompleted && <p className="text-emerald-400 font-bold mb-3 flex items-center justify-center gap-2"><CheckCircle size={18} /> Exam Passed!</p>}
          <button onClick={startExam} disabled={!allUnitsReadyForExam}
            className={`bg-gradient-to-r ${theme.examAccentBg} hover:${theme.examAccentBgHover} disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-bold py-3 px-8 rounded-lg transition-all`}>
            {examCompleted ? `Retake ${FINAL_EXAM_TOTAL_QUESTIONS}-Question Exam` : `Start ${FINAL_EXAM_TOTAL_QUESTIONS}-Question Final`}
          </button>
        </div>
        <div className={`mt-6 bg-gradient-to-br ${theme.accentBgSoftAlt} rounded-xl p-6 border ${theme.accentBorderSoft}`}>
          <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2"><Scroll size={24} /> About This Course</h2>
          <p className="text-slate-300 mb-3"><strong className="text-blue-300">{courseData.about.level}</strong> - {courseData.about.description}</p>
          <p className="text-slate-300"><strong className="text-blue-300">Credit Equivalent:</strong> {courseData.about.credits} | <strong className="text-blue-300">Prerequisites:</strong> {courseData.about.prerequisites}</p>
        </div>
        {rigorProfile && (
          <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-indigo-500/30">
            <h2 className="text-xl font-bold text-indigo-300 mb-3 flex items-center gap-2">
              <Award size={22} />
              Associate Program Standards
            </h2>
            <p className="text-slate-300 text-sm mb-3">
              Quiz threshold: {quizPassPercentage}% per unit. Final exam threshold: {examPassPercentage}%.
            </p>
            <p className="text-slate-300 text-sm mb-1"><strong className="text-indigo-300">Instructional Time:</strong> {rigorProfile.contactHours}</p>
            <p className="text-slate-300 text-sm mb-1"><strong className="text-indigo-300">Independent Study:</strong> {rigorProfile.studyHours}</p>
            <p className="text-slate-300 text-sm mb-3"><strong className="text-indigo-300">Writing Expectations:</strong> {rigorProfile.writingLoad}</p>
            <ul className="space-y-1">
              {(rigorProfile.standards || []).map((standard, index) => (
                <li key={`standard-${index}`} className="text-sm text-slate-200">- {standard}</li>
              ))}
            </ul>
          </div>
        )}
        {courseSourceIndex.length > 0 && (
          <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-teal-500/30">
            <h2 className="text-xl font-bold text-teal-300 mb-3 flex items-center gap-2">
              <BookOpen size={22} />
              Course Source Index
            </h2>
            <p className="text-slate-300 text-sm mb-3">
              Automatically detected Scripture references used throughout lessons, terms, and quiz explanations.
            </p>
            <div className="flex flex-wrap gap-2">
              {courseSourceIndex.slice(0, 60).map((ref) => (
                <button
                  key={ref}
                  onClick={() => openRef(ref)}
                  className="px-2 py-1 rounded border border-teal-500/30 bg-teal-900/20 text-xs text-teal-200 hover:bg-teal-800/40 transition-colors"
                  title="Open in Bible Reader"
                >
                  {ref}
                </button>
              ))}
            </div>
            {courseSourceIndex.length > 60 && (
              <p className="text-xs text-slate-400 mt-3">
                Showing 60 of {courseSourceIndex.length} detected references.
              </p>
            )}
          </div>
        )}
        {bibliography && (
          <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
              <BookOpen size={22} />
              Bibliography
            </h2>
            <p className="text-slate-300 text-sm mb-4">
              Recommended sources for deeper, citation-grade study.
            </p>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-amber-300 mb-2">Primary Sources</h3>
              <ul className="space-y-1">
                {(bibliography.primary || []).map((item, idx) => (
                  <li key={`p-${idx}`} className="text-sm text-slate-200">- {item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-300 mb-2">Secondary Scholarship</h3>
              <ul className="space-y-1">
                {(bibliography.secondary || []).map((item, idx) => (
                  <li key={`s-${idx}`} className="text-sm text-slate-200">- {item}</li>
                ))}
              </ul>
            </div>

            {(bibliography.furtherReading || []).length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-emerald-300 mb-2">Further Reading</h3>
                <ul className="space-y-1">
                  {bibliography.furtherReading.map((item, idx) => (
                    <li key={`f-${idx}`} className="text-sm text-slate-200">- {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveCourse;

