import { signUp, signIn, signOut, onAuthChange, resetPassword } from './services/authService';
import { getUserData, addQuizResult } from './services/dbService';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Trophy,
  Book,
  Calendar,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Flame,
  BarChart,
  TrendingUp,
  Sword,
  GraduationCap,
  Lightbulb,
  Lock,
  Unlock,
  BookOpen,
  Scroll,
  Clock,
  Crown,
  RefreshCw,
  Heart,
  HelpCircle,
  Search,
  CheckCircle,
  Users
} from 'lucide-react';
import VerseScrambleQuiz from './components/VerseScrambleQuiz';
import BookOrderQuiz from './components/BookOrderQuiz';
import SwordDrillUltimate from './components/SwordDrillUltimate';
import BiblicalSpellingBee from './components/BiblicalSpellingBee';
import BiblicalBloodlines from './components/BiblicalBloodlines';
import WordsOfJesus from './components/WordsOfJesus';
import CorrectToast from './components/CorrectToast';
import IncorrectToast from './components/IncorrectToast';
import GenericToast from './components/GenericToast';
import KoineGreekCourse from './components/KoineGreekCourse';
import AncientHebrewCourse from './components/AncientHebrewCourse';
import HermeneuticsCourse from './components/HermeneuticsCourse';
import LearningPlan from './components/LearningPlan';
import DualCalendarDisplay from './components/DualCalendarDisplay';
import TutorialHelp from './components/TutorialHelp';
import HebrewCalendarModal from './components/HebrewCalendarModal';
import ActivityCalendarModal from './components/ActivityCalendarModal';
import BibleReader from './components/BibleReader';
import PersonalVerseBank from './components/PersonalVerseBank';
import LoadingScreen from './components/LoadingScreen';
import BibleTrivia from './components/BibleTrivia';
import ChurchHistoryCourse from './components/ChurchHistoryCourse';
import KingsOfIsraelCourse from './components/KingsOfIsraelCourse';
import TextualCriticismCourse from './components/TextualCriticismCourse';
import UnlockableLXX from './components/UnlockableLXX';
import UnlockableSinaiticus from './components/UnlockableSinaiticus';
import UnlockableMasoretic from './components/UnlockableMasoretic';
import UnlockableEliChallenge from './components/UnlockableEliChallenge';
import GreekLexicon from './components/GreekLexicon';
import HebrewLexicon from './components/HebrewLexicon';
import EnhancedReviewModal from './components/EnhancedReviewModal';
import EnhancedReviewMultipleChoice from './components/EnhancedReviewMultipleChoice';
import { getRandomMemoryTip } from './data/memoryTips';
import { getAllReferencesForDifficulty } from './data/versesByDifficulty';
import { DAILY_VERSES_POOL } from './dailyVerses';
import { getLocalVerseByReference, getLocalVersesRange } from './services/localBibleProvider';
import { getVerseByReference as getStaticVerseByReference } from './services/assistant/retrieval/bibleProvider';
import { recordQuizAttempt } from './services/quizTracker';
import PracticeReview from './components/PracticeReview';
import SpiritualGiftsExam from './components/SpiritualGiftsExam';
import SharpAssistant from './services/SharpAssistant';
import CORE from "./core/core/index.js";

const {
  // Achievements
  ACHIEVEMENT_TIERS,
  ACHIEVEMENTS,
  ACHIEVEMENT_CONDITIONS,
  checkForNewAchievements,

  // Points
  POINT_SYSTEM,
  QUIZ_POINTS,
  calculateQuizPoints,
  getBonusPoints,
  getPenaltyPoints,

  // Levels
  LEVEL_REQUIREMENTS,
  checkLevelProgression,
  getLevelRequirements,
  getAllLevels,
  getNextLevel,

  // Quiz
  getQuizDifficulty,
  getTimeThreshold,
  getTimeLimit,
  getFillBlankConfig,
  getMultipleChoiceConfig,
  isTooFast,
  deservesSpeedBonus,
  getTimeScoreMultiplier,

  // Validation
  matchBiblicalReference,
  validateFillBlank,
  validateMultipleFillBlanks,
  validateMultipleChoice,
  calculateSimilarity,
  isCloseAnswer,

  // Verses
  DEFAULT_VERSE_FALLBACK,
  VERSE_DATABASE,
  getDailyVerse,
  getRandomVerse,
  getVerseByReference,
  getRandomVerses,
  verseExists,
  getTotalVerseCount,
  getVersePoolStats
} = CORE;
// Firebase Integration Note:
// In production, you'll need to:
// 1. Install: npm install firebase
// 2. Import Firebase services from './services/firebase'
// 3. Import auth functions from './services/authService'
// 4. Import db functions from './services/dbService'
// For now, this is a demo version with simulated Firebase calls

// Note: DEFAULT_VERSE_FALLBACK, VERSE_DATABASE, and ACHIEVEMENT_TIERS
// are now imported from './core' (private submodule)

// Local date string helper (YYYY-MM-DD in local time, not UTC)
const localDateString = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Note: LEVEL_REQUIREMENTS, ACHIEVEMENTS, POINT_SYSTEM, and QUIZ_POINTS
// are now imported from './core' (private submodule)

// Progress Meters Component
const ProgressMeters = ({ userData, isEliChallenge = false }) => {
  const currentLevel = userData.currentLevel || 'Beginner';
  const requirements = LEVEL_REQUIREMENTS[currentLevel];
  const nextLevel = requirements.nextLevel;
  const progressRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (progressRef.current) {
        observer.unobserve(progressRef.current);
      }
    };
  }, []);

  if (!nextLevel && !isEliChallenge) {
    // Max level reached (but not in Eli Challenge mode)
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-2 border-purple-500/50 rounded-2xl p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
            <Trophy size={28} />
            Elite Master Achieved! 💎
          </h3>
          <p className="text-slate-300">You've reached the highest level!</p>
        </div>
      </div>
    );
  }

  // Special display for Eli Challenge mode
  if (isEliChallenge) {
    return (
      <div className="relative bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border-2 border-amber-500/70 rounded-2xl p-6 overflow-hidden">
        {/* Pulsing amber background effect */}
        <div className="absolute inset-0 bg-amber-500/20 animate-pulse"></div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-amber-300 mb-2 flex items-center justify-center gap-2">
            <Flame size={24} className="text-amber-400 animate-pulse" />
            Eli Challenge Mode
            <Flame size={24} className="text-amber-400 animate-pulse" />
          </h3>
          <p className="text-center text-amber-200 text-sm mb-6 font-semibold">
            Ultimate Biblical Mastery
          </p>

          <div className="space-y-5">
            {/* All three meters filled and pulsing amber */}
            {[
              { icon: Book, label: 'Verses Mastered', color: 'amber' },
              { icon: Trophy, label: 'Quizzes Completed', color: 'amber' },
              { icon: Flame, label: 'Streak Days', color: 'amber' }
            ].map(({ icon: Icon, label, color }, index) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-200 text-sm font-semibold flex items-center gap-2">
                    <Icon size={16} className="text-amber-400" />
                    {label}
                  </span>
                  <span className="text-amber-200 text-sm font-bold">∞</span>
                </div>
                <div className="relative h-8 bg-slate-800/80 rounded-full border-2 border-amber-600/50 overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 rounded-full animate-pulse"
                    style={{
                      width: '100%',
                      boxShadow: '0 0 30px rgba(245, 158, 11, 0.8)',
                      transition: 'none'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-amber-200 text-sm font-bold animate-pulse">
              🔥 ALL LIMITS REMOVED 🔥
            </p>
          </div>
        </div>
      </div>
    );
  }

  const versesProgress = Math.min(userData.versesMemorized, requirements.versesMastered);
  const versesPercent = requirements.versesMastered > 0 ? (versesProgress / requirements.versesMastered) * 100 : 0;

  const quizzesProgress = Math.min(userData.quizzesCompleted, requirements.quizzesCompleted);
  const quizzesPercent = requirements.quizzesCompleted > 0 ? (quizzesProgress / requirements.quizzesCompleted) * 100 : 0;

  const streakProgress = Math.min(userData.currentStreak, requirements.streakDays);
  const streakPercent = requirements.streakDays > 0 ? (streakProgress / requirements.streakDays) * 100 : 0;

  return (
    <div ref={progressRef} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-amber-500/30 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
        <TrendingUp size={24} />
        Progress to {nextLevel}
      </h3>
      <p className="text-center text-slate-400 text-sm mb-6">
        Current Level: <span className="text-amber-400 font-semibold">{currentLevel} {ACHIEVEMENT_TIERS[currentLevel].icon}</span>
      </p>

      <div className="space-y-5">
        {/* Verses Mastered Meter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm font-semibold flex items-center gap-2">
              <Book size={16} className="text-red-400" />
              Verses Mastered
            </span>
            <span className="text-slate-300 text-sm font-bold">
              {versesProgress}/{requirements.versesMastered}
            </span>
          </div>
          <div className="relative h-8 bg-slate-800 rounded-full border-2 border-slate-700 overflow-hidden shadow-inner">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full"
              style={{
                width: isVisible ? `${versesPercent}%` : '0%',
                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: versesPercent > 0 ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Quizzes Completed Meter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm font-semibold flex items-center gap-2">
              <Trophy size={16} className="text-blue-400" />
              Quizzes Completed
            </span>
            <span className="text-slate-300 text-sm font-bold">
              {quizzesProgress}/{requirements.quizzesCompleted}
            </span>
          </div>
          <div className="relative h-8 bg-slate-800 rounded-full border-2 border-slate-700 overflow-hidden shadow-inner">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full"
              style={{
                width: isVisible ? `${quizzesPercent}%` : '0%',
                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                boxShadow: quizzesPercent > 0 ? '0 0 20px rgba(59, 130, 246, 0.6)' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Streak Days Meter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm font-semibold flex items-center gap-2">
              <Flame size={16} className="text-green-400" />
              Streak Days
            </span>
            <span className="text-slate-300 text-sm font-bold">
              {streakProgress}/{requirements.streakDays}
            </span>
          </div>
          <div className="relative h-8 bg-slate-800 rounded-full border-2 border-slate-700 overflow-hidden shadow-inner">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 via-green-500 to-green-400 rounded-full"
              style={{
                width: isVisible ? `${streakPercent}%` : '0%',
                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
                boxShadow: streakPercent > 0 ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Message */}
      {versesPercent === 100 && quizzesPercent === 100 && streakPercent === 100 && (
        <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 rounded-lg p-3 text-center">
          <p className="text-amber-400 font-bold text-sm animate-pulse">
            🎉 Ready to level up! Complete one more quiz to advance to {nextLevel}!
          </p>
        </div>
      )}
    </div>
  );
};

// Normalize streak data keys to local YYYY-MM-DD
const normalizeStreakData = (raw = {}) => {
  const out = {};
  Object.entries(raw).forEach(([k, v]) => {
    const entry = { ...(v || {}) };
    // Derive marked if missing but quizzes show any correct
    if (entry.marked === undefined && Array.isArray(entry.quizzes)) {
      entry.marked = entry.quizzes.some(q => q?.correct);
    }
    let key = k;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) {
      const d = new Date(k);
      if (!isNaN(d)) {
        key = localDateString(d);
      }
    }
    out[key] = entry;
  });
  return out;
};

// Helper function to calculate current streak from localStorage
// IMPORTANT: Streak only counts days where at least one quiz was answered correctly
// Days are marked as streak days ONLY when a correct quiz answer is submitted
const calculateCurrentStreak = () => {
  const raw = JSON.parse(localStorage.getItem('streakData') || '{}');
  const streakData = normalizeStreakData(raw);
  // Persist normalized/derived data back to storage to avoid future drift
  try { localStorage.setItem('streakData', JSON.stringify(streakData)); } catch (_) {}
  let currentStreak = 0;

  // Get today's date at midnight
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const todayString = localDateString(todayDate);

  // Get yesterday's date
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterdayString = localDateString(yesterdayDate);

  // Check if we have an active streak (today or yesterday must be marked)
  const todayMarked = streakData[todayString]?.marked;
  const yesterdayMarked = streakData[yesterdayString]?.marked;

  if (!todayMarked && !yesterdayMarked) {
    return 0; // Streak is broken if neither today nor yesterday is marked
  }

  // Start counting from the most recent marked day
  let startDate = todayMarked ? todayDate : yesterdayDate;

  // Count consecutive days backwards
  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() - i);
    const checkDateString = localDateString(checkDate);

    // Only count days that have been marked with at least one correct quiz
    if (streakData[checkDateString]?.marked) {
      currentStreak++;
    } else {
      break; // Streak ends when we hit a day without quiz activity
    }
  }

  return currentStreak;
};

// Helper function to calculate mastered verses count (requires 4+ quiz types mastered)
const calculateMasteredVerses = (verseProgress) => {
  if (!verseProgress || typeof verseProgress !== 'object') return 0;

  return Object.values(verseProgress).filter(progress => {
    const correctCount = progress.correctCount || 0;
    const incorrectCount = progress.incorrectCount || 0;
    const totalAttempts = correctCount + incorrectCount;
    const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;

    // Count successful quiz types
    const quizTypes = progress.quizTypes || {};
    const successfulQuizTypes = Object.values(quizTypes).filter(qt =>
      qt.correct >= 3 && qt.incorrect === 0
    ).length;

    // Verse is mastered if: 90%+ accuracy, 5+ correct, AND 4+ quiz types mastered
    return accuracy >= 90 && correctCount >= 5 && successfulQuizTypes >= 4;
  }).length;
};

// Helper function to check and apply inactivity penalties
const calculateInactivityPenalty = () => {
  const lastActivityDate = localStorage.getItem('lastActivityDate');
  if (!lastActivityDate) return 0;

  const today = new Date();
  const lastActivity = new Date(lastActivityDate);
  const daysSinceActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

  if (daysSinceActivity > 1 && daysSinceActivity <= 7) {
    return POINT_SYSTEM.PENALTIES.inactiveDay * (daysSinceActivity - 1);
  } else if (daysSinceActivity > 7) {
    return POINT_SYSTEM.PENALTIES.inactiveDay * 7; // Max 7 days penalty
  }

  return 0;
};

// Helper function to award bonus points
const awardBonusPoints = (bonusType, multiplier = 1) => {
  const bonusPoints = POINT_SYSTEM.BONUSES[bonusType];
  return bonusPoints ? bonusPoints * multiplier : 0;
};

// Helper function to check if a course section has been completed and award points (one-time only)
const awardCourseSectionPoints = (userData, setUserData, courseName, sectionId, sectionTitle) => {
  const sectionKey = `${courseName}:${sectionId}`;
  const completedSections = userData.completedCourseSections || {};

  // Check if this section has already been completed
  if (completedSections[sectionKey]) {
    return {
      pointsEarned: 0,
      isFirstCompletion: false,
      message: `📖 ${sectionTitle} Complete!\n\nYou've already earned points for this section.\nYou can repeat it anytime for practice!`
    };
  }

  // First time completing this section - award 100 points
  const pointsEarned = POINT_SYSTEM.BONUSES.courseLesson; // 100 points

  // Mark section as completed
  setUserData(prev => ({
    ...prev,
    completedCourseSections: {
      ...(prev.completedCourseSections || {}),
      [sectionKey]: {
        completedAt: new Date().toISOString(),
        title: sectionTitle
      }
    },
    totalPoints: prev.totalPoints + pointsEarned
  }));

  return {
    pointsEarned,
    isFirstCompletion: true,
    message: `🎓 ${sectionTitle} Complete!\n\n+${pointsEarned} points earned!\n\nGreat work on completing this lesson!\n\n💰 New Balance: ${userData.totalPoints + pointsEarned} points`
  };
};

// Note: checkForNewAchievements now imported from './core' (private submodule)

// Local persistence helpers for guest/offline progress
const PROGRESS_STORAGE_KEY = 'swordDrillProgress';

const saveProgressToLocalStorage = (progress) => {
  try {
    const {
      name,
      versesMemorized,
      quizzesCompleted,
      currentStreak,
      totalPoints,
      achievements,
      selectedTranslation,
      includeApocrypha,
      verseProgress,
      currentLevel,
      unlockables,
      newlyUnlockedAchievements,
      achievementClickHistory
    } = progress;

    const payload = {
      name,
      versesMemorized,
      quizzesCompleted,
      currentStreak,
      totalPoints,
      achievements,
      selectedTranslation,
      includeApocrypha,
      verseProgress,
      currentLevel,
      unlockables,
      newlyUnlockedAchievements,
      achievementClickHistory
    };

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('[LocalStorage] Failed to save progress', error);
  }
};

const loadProgressFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('[LocalStorage] Failed to parse saved progress', error);
    return null;
  }
};

// Merge local (offline/guest) progress with remote (Firebase) progress
const mergeProgressRecords = (localProgress = {}, remoteProgress = {}, localStreakValue = 0) => {
  const normalizeQuizHistory = (arr = []) => {
    return arr.map(q => {
      const ts = q.timestamp || q.ts || q.date;
      const d = ts ? new Date(ts) : null;
      const dateKey = q.dateKey || (d && !isNaN(d) ? localDateString(d) : null);
      return { ...q, dateKey };
    });
  };

  const achievements = Array.from(new Set([
    ...(remoteProgress.achievements || []),
    ...(localProgress.achievements || [])
  ]));

  const newlyUnlockedAchievements = Array.from(new Set([
    ...(remoteProgress.newlyUnlockedAchievements || []),
    ...(localProgress.newlyUnlockedAchievements || [])
  ]));

  const achievementClickHistory = {
    ...(localProgress.achievementClickHistory || {}),
    ...(remoteProgress.achievementClickHistory || {})
  };

  const unlockables = {
    lxx: (localProgress.unlockables?.lxx || remoteProgress.unlockables?.lxx) || false,
    masoretic: (localProgress.unlockables?.masoretic || remoteProgress.unlockables?.masoretic) || false,
    sinaiticus: (localProgress.unlockables?.sinaiticus || remoteProgress.unlockables?.sinaiticus) || false
  };

  // Merge quiz history (local + remote)
  const quizHistory = [
    ...normalizeQuizHistory(localProgress.quizHistory || []),
    ...normalizeQuizHistory(remoteProgress.quizHistory || [])
  ];

  const verseProgress = {
    ...(localProgress.verseProgress || {}),
    ...(remoteProgress.verseProgress || {})
  };

  const currentStreak = Math.max(
    localStreakValue || 0,
    remoteProgress.currentStreak || 0,
    localProgress.currentStreak || 0,
    calculateCurrentStreak()
  );

  return {
    name: remoteProgress.name || localProgress.name || 'Guest',
    versesMemorized: Math.max(localProgress.versesMemorized || 0, remoteProgress.versesMemorized || 0),
    quizzesCompleted: Math.max(localProgress.quizzesCompleted || 0, remoteProgress.quizzesCompleted || 0),
    currentStreak,
    totalPoints: Math.max(localProgress.totalPoints || 0, remoteProgress.totalPoints || 0),
    achievements,
    selectedTranslation: remoteProgress.selectedTranslation || localProgress.selectedTranslation || 'KJV',
    includeApocrypha: remoteProgress.includeApocrypha ?? localProgress.includeApocrypha ?? false,
    verseProgress,
    currentLevel: remoteProgress.currentLevel || localProgress.currentLevel || 'Beginner',
    unlockables,
    newlyUnlockedAchievements,
    achievementClickHistory,
    quizHistory
  };
};

const SwordDrillApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [verseDetectiveData, setVerseDetectiveData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showHebrewCalendar, setShowHebrewCalendar] = useState(false);
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);
  const [showBibleReader, setShowBibleReader] = useState(false);
  const [showPersonalQuizModal, setShowPersonalQuizModal] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasHydratedProgress, setHasHydratedProgress] = useState(false);
  const [bibleStudyPlans, setBibleStudyPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDetail, setShowPlanDetail] = useState(false);
  const [planVerseTexts, setPlanVerseTexts] = useState([]);
  const [planVerseLoading, setPlanVerseLoading] = useState(false);
  const [planVerseError, setPlanVerseError] = useState('');

  // Achievement unlock states
  const [showAchievementUnlock, setShowAchievementUnlock] = useState(null);
  const [hasUnviewedAchievements, setHasUnviewedAchievements] = useState(
    localStorage.getItem('hasUnviewedAchievements') === 'true'
  );
  const [achievementsLastViewed, setAchievementsLastViewed] = useState(
    localStorage.getItem('achievementsLastViewed') || null
  );

  const [userData, setUserData] = useState({
    name: 'Guest',
    versesMemorized: 0,
    quizzesCompleted: 0,
    currentStreak: calculateCurrentStreak(), // Load from localStorage
    totalPoints: 0,
    achievements: [],
    selectedTranslation: 'KJV',
    includeApocrypha: false,
    verseProgress: {}, // NEW: Track progress for each verse
    currentLevel: 'Beginner', // Track user's current level
    completedCourseSections: {}, // Track completed course sections for one-time 100pt rewards
    unlockables: {
      lxx: false,        // Septuagint (Greek OT) - Unlock at 5000 pts
      masoretic: false,  // Masoretic Text (Hebrew OT) - Unlock at 7500 pts
      sinaiticus: false  // Codex Sinaiticus - Unlock at 10000 pts
    },
    newlyUnlockedAchievements: [], // Track achievements unlocked in current session
    achievementClickHistory: {}, // Track when achievements were clicked/viewed
    quizHistory: [], // Track individual quiz attempts (for calendar)
    soundSettings: {
      enabled: true,
      volume: 0.5, // 0 to 1
      musicEnabled: true,
      musicVolume: 0.3 // 0 to 1
    },
    studyPlanProgress: {}, // Track Bible study plan progress: { planId: { started: timestamp, completed: timestamp | null } }
    personalVerseDetectiveCompletions: {}, // Track daily completions: { 'YYYY-MM-DD': count }
    verseDetectiveCompleted: 0, // Total Verse Detective quizzes completed
    verseDetectiveCorrect: 0, // Total Verse Detective quizzes answered correctly
    wordsOfJesusCompleted: 0, // Total Words of Jesus quizzes completed
    wordsOfJesusCorrect: 0 // Total Words of Jesus questions answered correctly
  });

  
  const [quizState, setQuizState] = useState(null);
  const [quizTimer, setQuizTimer] = useState(0);
  const [verseOfDay, setVerseOfDay] = useState(null);
  const [verseOfDayRead, setVerseOfDayRead] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);
  const [showIncorrectToast, setShowIncorrectToast] = useState(false);
  const [toastPoints, setToastPoints] = useState(0);
  const [showGenericToast, setShowGenericToast] = useState(false);
  const [genericToastMessage, setGenericToastMessage] = useState('');
  const [genericToastType, setGenericToastType] = useState('success');
  const timerIntervalRef = useRef(null);

  // Enhanced Review Modal and Memory Tips
  const [showEnhancedReview, setShowEnhancedReview] = useState(false);
  const [failedQuizData, setFailedQuizData] = useState(null);
  const [showMemoryTip, setShowMemoryTip] = useState(false);
  const [memoryTip, setMemoryTip] = useState(null);

  // Stable callbacks for VerseScrambleQuiz - must be declared before any early returns
  const handleVerseScrambleComplete = useCallback((result) => {
    console.log('[handleVerseScrambleComplete] Called with result:', result);
    // Update quiz state with user's answer and time
    // Store the updated state in a variable to pass to submitQuiz
    let updatedState = null;
    setQuizState(prev => {
      console.log('[handleVerseScrambleComplete] Previous state:', prev);
      console.log('[handleVerseScrambleComplete] prev.verse:', prev?.verse);
      if (!prev) return null;
      updatedState = {
        ...prev,
        userAnswer: result.userAnswer,
        timeTaken: result.timeTaken
      };
      console.log('[handleVerseScrambleComplete] Updated state:', updatedState);
      console.log('[handleVerseScrambleComplete] updatedState.verse:', updatedState.verse);
      return updatedState;
    });

    // Call submitQuiz immediately with the result data
    // submitQuiz will use the current quizState from closure, which should still have verse data
    console.log('[handleVerseScrambleComplete] About to call submitQuiz');
    if (typeof submitQuiz === 'function') {
      submitQuiz(result.isCorrect, result.timeTaken);
    }
  }, []);

  const handleVerseScrambleSkip = useCallback(() => {
    setQuizState(null);
    setCurrentView('start');
  }, []);

// Load guest/local progress on first render before auth resolves
useEffect(() => {
  const savedProgress = loadProgressFromLocalStorage();
  if (savedProgress) {
    const localStreak = calculateCurrentStreak();
    setUserData((prev) => ({
      ...prev,
      ...savedProgress,
      currentStreak: Math.max(localStreak, savedProgress.currentStreak || 0)
    }));
  }
  setHasHydratedProgress(true);
}, []);

useEffect(() => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const verseIndex = dayOfYear % VERSE_DATABASE.length;
  setVerseOfDay(VERSE_DATABASE[verseIndex]);

  // Check if verse of day was already read today
  const todayString = new Date().toISOString().split('T')[0];
  const verseReadData = JSON.parse(localStorage.getItem('verseOfDayRead') || '{}');
  setVerseOfDayRead(verseReadData[todayString] === true);
  
  // Firebase auth listener
  const unsubscribe = onAuthChange(async (user) => {
    if (user) {
      setCurrentUser(user);
      console.log('[App.js] Loading user data from Firebase for user:', user.uid);
      const result = await getUserData(user.uid);
      console.log('[App.js] getUserData result:', result);
    if (result.success && result.user && result.progress) {
      console.log('[App.js] Achievements from Firebase:', result.progress.achievements);

      // Use the higher value between localStorage and Firebase for streak
      const localStreak = calculateCurrentStreak();
      const firebaseStreak = result.progress.currentStreak || 0;
      const mergedStreak = Math.max(localStreak, firebaseStreak);

      const verseProgressData = result.progress.verseProgress || {};
      const loadedUserData = {
        name: result.user.name || 'User',
        versesMemorized: calculateMasteredVerses(verseProgressData),
        quizzesCompleted: result.progress.quizzesCompleted || 0,
        currentStreak: mergedStreak,
        totalPoints: result.progress.totalPoints || 0,
        achievements: Array.isArray(result.progress.achievements) ? result.progress.achievements : [],
        selectedTranslation: result.user.selectedTranslation || 'KJV',
        includeApocrypha: result.user.includeApocrypha || false,
        verseProgress: verseProgressData,
          currentLevel: result.progress.currentLevel || 'Beginner',
          unlockables: result.progress.unlockables || { lxx: false, masoretic: false, sinaiticus: false },
          newlyUnlockedAchievements: result.progress.newlyUnlockedAchievements || [],
          achievementClickHistory: result.progress.achievementClickHistory || {},
          quizHistory: result.progress.quizHistory || []
        };
        const localSavedProgress = loadProgressFromLocalStorage() || {};
        const mergedProgress = mergeProgressRecords(localSavedProgress, loadedUserData, localStreak);
        // Recalculate streak from normalized local storage to avoid drift
        const recalculatedStreak = calculateCurrentStreak();
        mergedProgress.currentStreak = Math.max(mergedProgress.currentStreak || 0, recalculatedStreak);
        // Rebuild streakData from Firebase + quizHistory + existing localStorage and persist
        const existingStreak = normalizeStreakData(JSON.parse(localStorage.getItem('streakData') || '{}'));
        const firebaseStreakData = normalizeStreakData(result.progress.streakData || {});
        const quizHistory = mergedProgress.quizHistory || [];
        // Merge Firebase streakData with local, preferring Firebase data for conflicts
        const rebuilt = { ...existingStreak, ...firebaseStreakData };
        quizHistory.forEach(q => {
          if (q.correct) {
            const ts = q.timestamp || q.ts || q.date;
            if (ts) {
              const d = new Date(ts);
              if (!isNaN(d)) {
                const key = localDateString(d);
                rebuilt[key] = { ...(rebuilt[key] || {}), marked: true };
              }
            }
          }
        });
        localStorage.setItem('streakData', JSON.stringify(rebuilt));
        mergedProgress.currentStreak = calculateCurrentStreak();
        console.log('[App.js] Setting userData with merged achievements:', mergedProgress.achievements);
        setUserData(mergedProgress);
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  });
  
  return () => unsubscribe();
}, []);

// Set loading to false after initial setup
useEffect(() => {
  // Simulate minimum loading time for better UX
  const timer = setTimeout(() => {
    setIsInitialLoading(false);
  }, 2400); // 8 stages × 300ms = 2400ms

  return () => clearTimeout(timer);
}, []);

// Persist progress locally so achievements survive refresh for guest/offline users
useEffect(() => {
  if (!hasHydratedProgress) return;
  saveProgressToLocalStorage(userData);
}, [userData, hasHydratedProgress]);

// Timer effect for quizzes (except verse-scramble which manages its own timer)
useEffect(() => {
  if (currentView === 'quiz' && quizState && quizState.type !== 'verse-scramble') {
    // Start timer
    setQuizTimer(0);
    timerIntervalRef.current = setInterval(() => {
      setQuizTimer(prev => prev + 1);
    }, 1000);
  } else {
    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }

  return () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };
}, [currentView, quizState]);

// Background music effect for Sword Drill Ultimate
useEffect(() => {
  if (currentView === 'sword-drill-ultimate') {
    // Start background music when entering Sword Drill Ultimate
    playBackgroundMusic();
  } else {
    // Fade out music when leaving Sword Drill Ultimate
    if (backgroundMusicRef) {
      fadeOutMusic();
    }
  }

  // Cleanup on unmount
  return () => {
    if (backgroundMusicRef) {
      fadeOutMusic();
    }
  };
}, [currentView]);

// Handle pending Bible reference from lexicon
const [pendingReference, setPendingReference] = useState(null);
useEffect(() => {
  const pendingRef = localStorage.getItem('pendingBibleReference');
  if (pendingRef && currentView === 'home') {
    localStorage.removeItem('pendingBibleReference');
    setPendingReference(pendingRef);
    setShowBibleReader(true);
  }
}, [currentView]);

// Load Bible Study Plans from JSON
useEffect(() => {
  fetch(`${process.env.PUBLIC_URL || ''}/advanced_bible_plans_multiscripture.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Bible study plans loaded:', data.length, 'plans');
      setBibleStudyPlans(data);
    })
    .catch(error => {
      console.error('Error loading bible study plans:', error);
      setBibleStudyPlans([]);
    });
}, []);

// Load verse texts for the currently selected plan
useEffect(() => {
  if (!showPlanDetail || !selectedPlan) return;
  let cancelled = false;

  const loadPlanVerses = async () => {
    setPlanVerseLoading(true);
    setPlanVerseError('');
    try {
      const scriptures = Array.isArray(selectedPlan.scriptures) ? selectedPlan.scriptures : [];
      const results = await Promise.all(scriptures.map(async (scripture) => {
        // Strip any AUTO prefixes or markers from references
        const ref = (scripture.reference || '').replace(/^AUTO[^A-Za-z0-9]*\s*/i, '').trim();
        const resolved = await resolveVerseText(ref, userData.selectedTranslation);
        return {
          reference: ref,
          text: resolved?.text || '',
          translation: resolved?.translation || userData.selectedTranslation,
          note: scripture.note || ''
        };
      }));
      if (!cancelled) setPlanVerseTexts(results);
    } catch (err) {
      console.error('Error loading plan verses', err);
      if (!cancelled) {
        setPlanVerseError('Unable to load verses for this plan right now.');
        setPlanVerseTexts([]);
      }
    } finally {
      if (!cancelled) setPlanVerseLoading(false);
    }
  };

  loadPlanVerses();
  return () => { cancelled = true; };
}, [showPlanDetail, selectedPlan, userData.selectedTranslation]);

// Handle verse of the day read checkbox
const handleVerseOfDayRead = () => {
  if (verseOfDayRead) return; // Already marked as read today

  const todayString = new Date().toISOString().split('T')[0];
  const verseReadData = JSON.parse(localStorage.getItem('verseOfDayRead') || '{}');

  // Mark today as read
  verseReadData[todayString] = true;
  localStorage.setItem('verseOfDayRead', JSON.stringify(verseReadData));
  setVerseOfDayRead(true);

  // Award points
  const pointsEarned = awardBonusPoints('verseOfDayChecked');
  const newTotalPoints = userData.totalPoints + pointsEarned;

  setUserData(prev => ({
    ...prev,
    totalPoints: newTotalPoints
  }));

  showToast(`✅ Verse of the Day marked as read!\n\n+${pointsEarned} points earned!\n\n💰 New Balance: ${newTotalPoints} points`, 'success');
};

const handleSignIn = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  const result = await signIn(email, password);
  if (result.success) {
    const data = await getUserData(result.user.uid);
    if (data.success && data.user && data.progress) {
      // Use the higher value between localStorage and Firebase for streak
      const localStreak = calculateCurrentStreak();
      const firebaseStreak = data.progress.currentStreak || 0;

      const verseProgressData = data.progress.verseProgress || {};

      // Restore streakData from Firebase to localStorage
      const existingStreak = normalizeStreakData(JSON.parse(localStorage.getItem('streakData') || '{}'));
      const firebaseStreakData = normalizeStreakData(data.progress.streakData || {});
      const mergedStreakData = { ...existingStreak, ...firebaseStreakData };
      localStorage.setItem('streakData', JSON.stringify(mergedStreakData));

      const mergedUserData = mergeProgressRecords(
        loadProgressFromLocalStorage() || {},
        {
          name: data.user.name || 'User',
          versesMemorized: calculateMasteredVerses(verseProgressData),
          quizzesCompleted: data.progress.quizzesCompleted || 0,
          currentStreak: Math.max(localStreak, firebaseStreak),
          totalPoints: data.progress.totalPoints || 0,
          achievements: Array.isArray(data.progress.achievements) ? data.progress.achievements : [],
          selectedTranslation: data.user.selectedTranslation || 'KJV',
          includeApocrypha: data.user.includeApocrypha || false,
          verseProgress: verseProgressData,
          currentLevel: data.progress.currentLevel || 'Beginner',
          unlockables: data.progress.unlockables || { lxx: false, masoretic: false, sinaiticus: false },
          newlyUnlockedAchievements: data.progress.newlyUnlockedAchievements || [],
          achievementClickHistory: data.progress.achievementClickHistory || {},
          quizHistory: data.progress.quizHistory || []
        },
        Math.max(localStreak, firebaseStreak)
      );

      // Recalculate streak after merging all data
      mergedUserData.currentStreak = calculateCurrentStreak();

      setUserData(mergedUserData);
      setIsLoggedIn(true);
    }
  } else {
    setError(result.error);
  }
  setLoading(false);
};

  const handleSignUp = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const result = await signUp(email, password, name);
  if (result.success) {
    setUserData({
      name,
      versesMemorized: 0,
      quizzesCompleted: 0,
      currentStreak: 0,
      totalPoints: 0,
      achievements: [],
      selectedTranslation: 'KJV',
      includeApocrypha: false,
      verseProgress: {},
      currentLevel: 'Beginner',
      unlockables: { lxx: false, masoretic: false, sinaiticus: false }
    });
    setIsLoggedIn(true);
  } else {
    setError(result.error);
  }
  setLoading(false);
};

const handlePasswordReset = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const result = await resetPassword(resetEmail);
  if (result.success) {
    setResetSuccess(true);
    setResetEmail('');
  } else {
    setError(result.error);
  }
  setLoading(false);
};

const handleSignOut = async () => {
  await signOut();
  setIsLoggedIn(false);
  setCurrentUser(null);
  setEmail('');
  setPassword('');
  setName('');
};

const shouldReviewVerse = (verseId, verseProgress) => {
  if (!verseProgress[verseId]) return true; // New verse, should review
  
  const progress = verseProgress[verseId];
  const now = Date.now();
  
  // If last review was less than the review interval, skip it
  if (progress.nextReview && now < progress.nextReview) {
    return false;
  }
  
  return true;
};

const calculateNextReview = (correctCount, incorrectCount) => {
  // Spaced repetition intervals (in days)
  const intervals = [1, 3, 7, 14, 30, 90]; // 1 day, 3 days, 1 week, 2 weeks, 1 month, 3 months
  
  const totalCorrect = correctCount;
  const level = Math.min(totalCorrect, intervals.length - 1);
  
  // If any incorrect, reduce level
  const adjustedLevel = incorrectCount > 0 ? Math.max(0, level - 1) : level;
  
  const daysUntilReview = intervals[adjustedLevel];
  return Date.now() + (daysUntilReview * 24 * 60 * 60 * 1000);
};

// Cooldown to avoid seeing the same verse for the same quiz type too soon
const QUIZ_TYPE_COOLDOWN_HOURS = {
  'fill-blank': 12,
  'multiple-choice': 12,
  'reference-recall': 12,
  'verse-scramble': 12,
  'book-order': 12,
  'sword-drill-ultimate': 12
};

const getQuizCooldownMs = (quizType) => {
  const hours = QUIZ_TYPE_COOLDOWN_HOURS[quizType] ?? 12;
  return hours * 60 * 60 * 1000;
};

const isVerseOnCooldown = (verseId, quizType, verseProgress) => {
  const cooldowns = verseProgress?.[verseId]?.quizCooldowns;
  if (!cooldowns || !cooldowns[quizType]) return false;
  return Date.now() < cooldowns[quizType];
};

const levelToDifficulty = (level = 'Beginner') => {
  switch (level) {
    case 'Beginner':
      return 'Beginner';
    case 'Intermediate':
      return 'Intermediate';
    case 'Advanced':
    case 'Elite':
      return 'Advanced';
    case 'Eli Challenge':
      return 'Eli Challenge';
    default:
      return 'Beginner';
  }
};

const resolveVerseText = async (reference, translationPref) => {
  // 1) Try local corpus (handles ranges)
  const localRange = await getLocalVersesRange(translationPref || 'KJV', reference);
  if (localRange) return { text: localRange.text, translation: localRange.translation || translationPref || 'KJV' };
  const local = await getLocalVerseByReference(translationPref || 'KJV', reference);
  if (local) return { text: local.text, translation: local.translation || translationPref || 'KJV' };

  // 2) Try small static sample set
  const staticHit = getStaticVerseByReference(reference, translationPref || 'KJV');
  if (staticHit) return { text: staticHit.text, translation: staticHit.translation || translationPref || 'KJV' };

  // 3) Try daily pool
  const daily = DAILY_VERSES_POOL.find(v => (v.reference || '').toLowerCase() === reference.toLowerCase());
  if (daily) return { text: daily.text, translation: translationPref || 'KJV' };

  // 4) Fallback placeholder to keep UI functional
  return { text: `Verse text for ${reference} (translation ${translationPref || 'KJV'}) not available locally.`, translation: translationPref || 'KJV' };
};

const pickCuratedReference = (quizType, userData, usePersonalVerses = false) => {
  // If using personal verses, pick from personal verse bank
  if (usePersonalVerses) {
    const personalVerses = userData.personalMemoryVerses || [];
    if (personalVerses.length === 0) return DEFAULT_VERSE_FALLBACK.reference;

    // Filter out verses on cooldown
    const eligible = personalVerses.filter(v => !isVerseOnCooldown(v.reference, quizType, userData.verseProgress));
    const pool = eligible.length > 0 ? eligible : personalVerses;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return picked ? picked.reference : DEFAULT_VERSE_FALLBACK.reference;
  }

  const difficulty = levelToDifficulty(userData.currentLevel);
  const refs = getAllReferencesForDifficulty(difficulty);
  if (!refs || refs.length === 0) return DEFAULT_VERSE_FALLBACK.reference;

  // filter out cooldown references for this quiz type
  const eligible = refs.filter(ref => !isVerseOnCooldown(ref, quizType, userData.verseProgress));
  const pool = eligible.length > 0 ? eligible : refs; // if all on cooldown, allow full list
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return picked || DEFAULT_VERSE_FALLBACK.reference;
};
const startQuiz = async (type, usePersonalVerses = false) => {
  setLoading(true);

  try {
    // Pick a curated reference based on level, avoiding quiz-type cooldowns
    const reference = pickCuratedReference(type, userData, usePersonalVerses);
    const verseTextInfo = await resolveVerseText(reference, userData.selectedTranslation || 'KJV');
    let verse = {
      id: reference,
      reference,
      text: verseTextInfo.text,
      translation: verseTextInfo.translation || 'KJV'
    };

    const words = verse.text.split(' ');

    if (type === 'fill-blank') {
      // Calculate difficulty based on quizzes completed
      // 0-20 quizzes: 3 blanks (beginner)
      // 21-50 quizzes: 4 blanks (intermediate)
      // 51-100 quizzes: 5 blanks (advanced)
      // 101-200 quizzes: 6 blanks (expert)
      // 200+ quizzes: 7 blanks (master)
      const quizzesCompleted = userData.quizzesCompleted || 0;
      let numBlanks = 3;
      if (quizzesCompleted > 200) numBlanks = 7;
      else if (quizzesCompleted > 100) numBlanks = 6;
      else if (quizzesCompleted > 50) numBlanks = 5;
      else if (quizzesCompleted > 20) numBlanks = 4;

      // Filter out articles and common words
      const articles = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];

      // Get indices of meaningful words (not articles)
      const meaningfulIndices = [];
      words.forEach((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[.,;:!?]/g, '');
        if (!articles.includes(cleanWord) && cleanWord.length > 2) {
          meaningfulIndices.push(index);
        }
      });

      // Select random meaningful words to blank out
      const actualBlanks = Math.min(numBlanks, meaningfulIndices.length);
      const selectedPairs = [];

      // Shuffle and select indices, keeping word/index pairs together
      const shuffled = [...meaningfulIndices].sort(() => Math.random() - 0.5);
      for (let i = 0; i < actualBlanks; i++) {
        const idx = shuffled[i];
        selectedPairs.push({ idx, word: words[idx] });
      }

      // Sort selections to keep blank order consistent with verse order
      selectedPairs.sort((a, b) => a.idx - b.idx);
      const selectedIndices = selectedPairs.map(p => p.idx);
      const blankAnswers = selectedPairs.map(p => p.word);

      // Create the question with blanks - use placeholder that we'll replace in UI
      const questionWords = [...words];
      selectedIndices.forEach((idx) => {
        questionWords[idx] = '___BLANK___';
      });

      // Create word bank with distractors
      const distractorWords = [];
      const allMeaningfulWords = words.filter((word, idx) => {
        const cleanWord = word.toLowerCase().replace(/[.,;:!?]/g, '');
        return !articles.includes(cleanWord) && cleanWord.length > 2 && !selectedIndices.includes(idx);
      });

      // Add 2-4 distractor words from the verse
      const numDistractors = Math.min(Math.floor(actualBlanks * 0.5) + 2, allMeaningfulWords.length);
      const shuffledDistractors = [...allMeaningfulWords].sort(() => Math.random() - 0.5);
      for (let i = 0; i < numDistractors; i++) {
        distractorWords.push(shuffledDistractors[i]);
      }

      // Create word bank items with unique IDs to handle duplicates
      const wordBankItems = [];
      blankAnswers.forEach((word, idx) => {
        wordBankItems.push({ word, id: `correct-${idx}` });
      });
      distractorWords.forEach((word, idx) => {
        wordBankItems.push({ word, id: `distractor-${idx}` });
      });

      // Shuffle word bank
      const shuffledWordBank = wordBankItems.sort(() => Math.random() - 0.5);

      setQuizState({
        type: 'fill-blank',
        verse: { ...verse, text: verse.text },
        question: questionWords.join(' '),
        answer: blankAnswers.join(', '),
        blankWords: blankAnswers,
        blankIndices: selectedIndices,
        wordBank: shuffledWordBank,
        userAnswers: Array(actualBlanks).fill(null),
        draggedWord: null,
        isPersonalVerse: usePersonalVerses,
      });
    } else if (type === 'multiple-choice') {
      const correctAnswer = verse.reference;

      // Parse the correct reference to get book, chapter, verse
      const parseReference = (ref) => {
        const match = ref.match(/^((?:\d\s)?[A-Za-z]+)\s+(\d+):(\d+)$/);
        if (match) {
          return { book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) };
        }
        return null;
      };

      const correct = parseReference(correctAnswer);
      const wrongAnswers = [];

      // Define book groups
      const GOSPELS = ['Matthew', 'Mark', 'Luke', 'John'];
      const isGospel = correct && GOSPELS.includes(correct.book);

      // NT verses that quote OT (for trick questions)
      const NT_QUOTES_OT = [
        { nt: 'Matthew 4:4', ot: 'Deuteronomy 8:3' },
        { nt: 'Matthew 4:7', ot: 'Deuteronomy 6:16' },
        { nt: 'Matthew 4:10', ot: 'Deuteronomy 6:13' },
        { nt: 'Matthew 21:13', ot: 'Isaiah 56:7' },
        { nt: 'Mark 12:29-30', ot: 'Deuteronomy 6:4-5' },
        { nt: 'Luke 4:18', ot: 'Isaiah 61:1' },
        { nt: 'John 6:31', ot: 'Psalm 78:24' },
        { nt: 'Romans 3:10', ot: 'Psalm 14:1' },
        { nt: 'Hebrews 1:5', ot: 'Psalm 2:7' },
        { nt: 'James 2:8', ot: 'Leviticus 19:18' }
      ];

      if (correct) {
        // Randomly choose answer pattern
        let pattern = Math.random();

        if (isGospel) {
          // GOSPEL PATTERN: All 4 Gospels as options, only one correct
          wrongAnswers.length = 0;
          const otherGospels = GOSPELS.filter(g => g !== correct.book);

          otherGospels.forEach(gospel => {
            const randomChapter = Math.floor(Math.random() * 20) + 1;
            const randomVerse = Math.floor(Math.random() * 30) + 1;
            wrongAnswers.push(`${gospel} ${randomChapter}:${randomVerse}`);
          });
        } else if (pattern < 0.2) {
          // 20% chance: NT-quotes-OT TRICK QUESTION
          // Check if current verse is part of NT-OT pairs
          const quotePair = NT_QUOTES_OT.find(pair =>
            pair.nt === correctAnswer || pair.ot === correctAnswer
          );

          if (quotePair) {
            // Include both NT and OT as options to create confusion
            const pairedRef = correctAnswer === quotePair.nt ? quotePair.ot : quotePair.nt;
            wrongAnswers.push(pairedRef);

            // Add two more from same testament as correct answer
            const sameTestamentBooks = correctAnswer.includes('Matthew') || correctAnswer.includes('Mark') ||
                                       correctAnswer.includes('Luke') || correctAnswer.includes('John') ||
                                       correctAnswer.includes('Acts') || correctAnswer.includes('Romans') ||
                                       correctAnswer.includes('Corinthians') || correctAnswer.includes('Galatians') ||
                                       correctAnswer.includes('Ephesians') || correctAnswer.includes('Philippians') ||
                                       correctAnswer.includes('Colossians') || correctAnswer.includes('Thessalonians') ||
                                       correctAnswer.includes('Timothy') || correctAnswer.includes('Titus') ||
                                       correctAnswer.includes('Philemon') || correctAnswer.includes('Hebrews') ||
                                       correctAnswer.includes('James') || correctAnswer.includes('Peter') ||
                                       correctAnswer.includes('John') || correctAnswer.includes('Jude') ||
                                       correctAnswer.includes('Revelation');

            if (sameTestamentBooks) {
              // NT books for additional options
              const ntBooks = ['Acts 1:8', 'Romans 8:28', '1 Corinthians 13:13', 'Ephesians 2:8', 'Philippians 4:13'];
              const filtered = ntBooks.filter(ref => ref !== correctAnswer && ref !== pairedRef);
              wrongAnswers.push(...filtered.slice(0, 2));
            } else {
              // OT books for additional options
              const otBooks = ['Genesis 1:1', 'Exodus 20:3', 'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 40:31'];
              const filtered = otBooks.filter(ref => ref !== correctAnswer && ref !== pairedRef);
              wrongAnswers.push(...filtered.slice(0, 2));
            }
          } else {
            // Fallback to standard pattern if not a quote pair
            pattern = 0.5; // Use standard pattern
          }
        }

        if (pattern >= 0.2 && pattern < 0.5 && !isGospel) {
          // 30% chance: ODD ONE OUT - Correct answer from different book, 3 wrong from same book
          const wrongBookOptions = ['Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'John', 'Romans', 'Ephesians'];
          const wrongBook = wrongBookOptions.find(book => book !== correct.book) || 'Genesis';

          // Generate 3 references from the same wrong book
          for (let i = 0; i < 3; i++) {
            const randomChapter = Math.floor(Math.random() * 20) + 1;
            const randomVerse = Math.floor(Math.random() * 30) + 1;
            wrongAnswers.push(`${wrongBook} ${randomChapter}:${randomVerse}`);
          }
        } else if (!isGospel && wrongAnswers.length === 0) {
          // 50% chance: STANDARD PATTERN - Varied mix (default behavior)
          // Generate 2 close wrong answers (same book or nearby verses)
          // Close answer 1: Same book, different chapter
          const nearbyChapter = correct.chapter + (Math.random() > 0.5 ? 1 : -1);
          const nearbyVerse = Math.floor(Math.random() * 20) + 1;
          wrongAnswers.push(`${correct.book} ${Math.max(1, nearbyChapter)}:${nearbyVerse}`);

          // Close answer 2: Same book, same chapter, different verse
          const differentVerse = correct.verse + (Math.random() > 0.5 ? 3 : -3);
          wrongAnswers.push(`${correct.book} ${correct.chapter}:${Math.max(1, differentVerse)}`);

          // Far answer: Completely different book
          const farBooks = ['Genesis 1:1', 'Exodus 20:3', 'Leviticus 19:18', 'Deuteronomy 6:5',
                            'Joshua 1:9', '1 Samuel 16:7', 'Job 19:25', 'Psalm 23:1', 'Psalm 119:105',
                            'Proverbs 3:5', 'Isaiah 40:31', 'Jeremiah 29:11', 'Daniel 3:17',
                            'Matthew 5:14', 'Matthew 28:19', 'Mark 10:45', 'Luke 6:31', 'John 1:1', 'John 14:6',
                            'Acts 1:8', 'Romans 3:23', 'Romans 8:28', '1 Corinthians 13:13',
                            'Galatians 5:22', 'Ephesians 6:11', 'Philippians 4:13',
                            'Colossians 3:23', '1 Thessalonians 5:16', 'Hebrews 11:1', 'James 1:2',
                            '1 Peter 5:7', '1 John 4:8', 'Revelation 21:4'];

          const farOptions = farBooks.filter(ref => {
            const farRef = parseReference(ref);
            return farRef && farRef.book !== correct.book;
          });

          if (farOptions.length > 0) {
            wrongAnswers.push(farOptions[Math.floor(Math.random() * farOptions.length)]);
          } else {
            wrongAnswers.push('Genesis 1:1');
          }
        }
      } else {
        // Fallback if parsing fails
        wrongAnswers.push('John 1:1', 'Genesis 1:1', 'Psalm 119:105');
      }

      // Filter out any duplicates or the correct answer
      const uniqueWrongAnswers = [...new Set(wrongAnswers)].filter(r => r !== correctAnswer);
      const allAnswers = [correctAnswer, ...uniqueWrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      setQuizState({
        type: 'multiple-choice',
        verse: { ...verse, text: verse.text },
        question: verse.text,
        correctAnswer,
        // Options remain references; strip verse numbers for display only
        options: allAnswers,
        userAnswer: null,
        isPersonalVerse: usePersonalVerses,
      });
    } else if (type === 'reference-recall') {
      setQuizState({
        type: 'reference-recall',
        verse: { ...verse, text: verse.text },
        question: verse.text,
        answer: verse.reference,
        userAnswer: '',
        isPersonalVerse: usePersonalVerses,
      });
    } else if (type === 'verse-scramble') {
      // Build a stable, pre-shuffled word bank for verse scramble
      const words = (verse.text || '')
        .split(' ')
        .filter(word => !/^\d+[.:,;]?$/u.test(word.trim()));
      const wordObjects = words.map((word, idx) => ({
        id: `word-${idx}`,
        word
      }));
      const scrambled = [...wordObjects].sort(() => Math.random() - 0.5);

      setQuizState({
        type: 'verse-scramble',
        verse: { ...verse, text: verse.text },
        question: verse.text,
        answer: verse.text,
        userAnswer: '',
        scrambledWords: scrambled,
        isPersonalVerse: usePersonalVerses
      });
    }

    setCurrentView('quiz');
  } catch (error) {
    console.error('Error loading verse:', error);
    showToast('Error loading verse. Please try again.', 'error');
  }

  setLoading(false);
};

// Start Verse Detective quiz
const startVerseDetective = async () => {
  setLoading(true);

  try {
    // Pick a curated reference based on level
    const reference = pickCuratedReference('verse-detective', userData, false);
    const verseTextInfo = await resolveVerseText(reference, userData.selectedTranslation || 'KJV');
    const verse = {
      id: reference,
      reference,
      text: verseTextInfo.text,
      translation: verseTextInfo.translation || 'KJV'
    };

    // Generate wrong references using advanced multiple-choice logic
    const parseReference = (ref) => {
      const match = ref.match(/^((?:\d\s)?[A-Za-z]+)\s+(\d+):(\d+)$/);
      if (match) {
        return { book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) };
      }
      return null;
    };

    const correctAnswer = verse.reference;
    const correct = parseReference(correctAnswer);
    const wrongReferences = [];

    // Define book groups
    const GOSPELS = ['Matthew', 'Mark', 'Luke', 'John'];
    const isGospel = correct && GOSPELS.includes(correct.book);

    // NT verses that quote OT (for trick questions)
    const NT_QUOTES_OT = [
      { nt: 'Matthew 4:4', ot: 'Deuteronomy 8:3' },
      { nt: 'Matthew 4:7', ot: 'Deuteronomy 6:16' },
      { nt: 'Matthew 4:10', ot: 'Deuteronomy 6:13' },
      { nt: 'Matthew 21:13', ot: 'Isaiah 56:7' },
      { nt: 'Mark 12:29-30', ot: 'Deuteronomy 6:4-5' },
      { nt: 'Luke 4:18', ot: 'Isaiah 61:1' },
      { nt: 'John 6:31', ot: 'Psalm 78:24' },
      { nt: 'Romans 3:10', ot: 'Psalm 14:1' },
      { nt: 'Hebrews 1:5', ot: 'Psalm 2:7' },
      { nt: 'James 2:8', ot: 'Leviticus 19:18' }
    ];

    if (correct) {
      // Randomly choose answer pattern
      let pattern = Math.random();

      if (isGospel) {
        // GOSPEL PATTERN: All 4 Gospels as options, only one correct
        wrongReferences.length = 0;
        const otherGospels = GOSPELS.filter(g => g !== correct.book);

        otherGospels.forEach(gospel => {
          const randomChapter = Math.floor(Math.random() * 20) + 1;
          const randomVerse = Math.floor(Math.random() * 30) + 1;
          wrongReferences.push(`${gospel} ${randomChapter}:${randomVerse}`);
        });
      } else if (pattern < 0.2) {
        // 20% chance: NT-quotes-OT TRICK QUESTION
        const quotePair = NT_QUOTES_OT.find(pair =>
          pair.nt === correctAnswer || pair.ot === correctAnswer
        );

        if (quotePair) {
          // Include both NT and OT as options to create confusion
          const pairedRef = correctAnswer === quotePair.nt ? quotePair.ot : quotePair.nt;
          wrongReferences.push(pairedRef);

          // Add two more from same testament as correct answer
          const sameTestamentBooks = correctAnswer.includes('Matthew') || correctAnswer.includes('Mark') ||
                                     correctAnswer.includes('Luke') || correctAnswer.includes('John') ||
                                     correctAnswer.includes('Acts') || correctAnswer.includes('Romans') ||
                                     correctAnswer.includes('Corinthians') || correctAnswer.includes('Galatians') ||
                                     correctAnswer.includes('Ephesians') || correctAnswer.includes('Philippians') ||
                                     correctAnswer.includes('Colossians') || correctAnswer.includes('Thessalonians') ||
                                     correctAnswer.includes('Timothy') || correctAnswer.includes('Titus') ||
                                     correctAnswer.includes('Philemon') || correctAnswer.includes('Hebrews') ||
                                     correctAnswer.includes('James') || correctAnswer.includes('Peter') ||
                                     correctAnswer.includes('John') || correctAnswer.includes('Jude') ||
                                     correctAnswer.includes('Revelation');

          if (sameTestamentBooks) {
            // NT books for additional options
            const ntBooks = ['Acts 1:8', 'Romans 8:28', '1 Corinthians 13:13', 'Ephesians 2:8', 'Philippians 4:13'];
            const filtered = ntBooks.filter(ref => ref !== correctAnswer && ref !== pairedRef);
            wrongReferences.push(...filtered.slice(0, 2));
          } else {
            // OT books for additional options
            const otBooks = ['Genesis 1:1', 'Exodus 20:3', 'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 40:31'];
            const filtered = otBooks.filter(ref => ref !== correctAnswer && ref !== pairedRef);
            wrongReferences.push(...filtered.slice(0, 2));
          }
        } else {
          // Fallback to standard pattern if not a quote pair
          pattern = 0.5; // Use standard pattern
        }
      }

      if (pattern >= 0.2 && pattern < 0.5 && !isGospel) {
        // 30% chance: ODD ONE OUT - Correct answer from different book, 3 wrong from same book
        const wrongBookOptions = ['Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'John', 'Romans', 'Ephesians'];
        const wrongBook = wrongBookOptions.find(book => book !== correct.book) || 'Genesis';

        // Generate 3 references from the same wrong book
        for (let i = 0; i < 3; i++) {
          const randomChapter = Math.floor(Math.random() * 20) + 1;
          const randomVerse = Math.floor(Math.random() * 30) + 1;
          wrongReferences.push(`${wrongBook} ${randomChapter}:${randomVerse}`);
        }
      } else if (!isGospel && wrongReferences.length === 0) {
        // 50% chance: STANDARD PATTERN - Varied mix (default behavior)
        // Generate 2 close wrong answers (same book or nearby verses)
        // Close answer 1: Same book, different chapter
        const nearbyChapter = correct.chapter + (Math.random() > 0.5 ? 1 : -1);
        const nearbyVerse = Math.floor(Math.random() * 20) + 1;
        wrongReferences.push(`${correct.book} ${Math.max(1, nearbyChapter)}:${nearbyVerse}`);

        // Close answer 2: Same book, same chapter, different verse
        const differentVerse = correct.verse + (Math.random() > 0.5 ? 3 : -3);
        wrongReferences.push(`${correct.book} ${correct.chapter}:${Math.max(1, differentVerse)}`);

        // Far answer: Completely different book
        const farBooks = ['Genesis 1:1', 'Exodus 20:3', 'Leviticus 19:18', 'Deuteronomy 6:5',
                          'Joshua 1:9', '1 Samuel 16:7', 'Job 19:25', 'Psalm 23:1', 'Psalm 119:105',
                          'Proverbs 3:5', 'Isaiah 40:31', 'Jeremiah 29:11', 'Daniel 3:17',
                          'Matthew 5:14', 'Matthew 28:19', 'Mark 10:45', 'Luke 6:31', 'John 1:1', 'John 14:6',
                          'Acts 1:8', 'Romans 3:23', 'Romans 8:28', '1 Corinthians 13:13',
                          'Galatians 5:22', 'Ephesians 6:11', 'Philippians 4:13',
                          'Colossians 3:23', '1 Thessalonians 5:16', 'Hebrews 11:1', 'James 1:2',
                          '1 Peter 5:7', '1 John 4:8', 'Revelation 21:4'];

        const farOptions = farBooks.filter(ref => {
          const farRef = parseReference(ref);
          return farRef && farRef.book !== correct.book;
        });

        if (farOptions.length > 0) {
          wrongReferences.push(farOptions[Math.floor(Math.random() * farOptions.length)]);
        } else {
          wrongReferences.push('Genesis 1:1');
        }
      }
    } else {
      // Fallback if parsing fails
      wrongReferences.push('John 1:1', 'Genesis 1:1', 'Psalm 119:105');
    }

    // Filter out duplicates and correct answer
    const uniqueWrongReferences = [...new Set(wrongReferences)].filter(r => r !== verse.reference).slice(0, 3);

    // Set verse detective data and switch to view
    setVerseDetectiveData({
      verse,
      wrongReferences: uniqueWrongReferences
    });

    setCurrentView('verse-detective');
  } catch (error) {
    console.error('Error loading Verse Detective:', error);
    showToast('Error loading Verse Detective. Please try again.', 'error');
  }

  setLoading(false);
};

// Start Personal Verse Detective quiz
const startPersonalVerseDetective = async () => {
  setLoading(true);

  try {
    const personalVerses = userData.personalMemoryVerses || [];

    if (personalVerses.length === 0) {
      showToast('No personal memory verses found. Please add verses to your Personal Verse Bank first.', 'warning');
      setLoading(false);
      return;
    }

    // Check daily completion limit (3 per day with points)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const completionsToday = userData.personalVerseDetectiveCompletions?.[today] || 0;
    const canEarnPoints = completionsToday < 3;

    // Pick a random personal verse
    const randomVerse = personalVerses[Math.floor(Math.random() * personalVerses.length)];
    const reference = randomVerse.reference;

    const verseTextInfo = await resolveVerseText(reference, randomVerse.translation || 'KJV');
    const verse = {
      id: reference,
      reference,
      text: verseTextInfo.text,
      translation: verseTextInfo.translation || randomVerse.translation || 'KJV'
    };

    // Generate wrong references using advanced multiple-choice logic
    const parseReference = (ref) => {
      const match = ref.match(/^((?:\d\s)?[A-Za-z]+)\s+(\d+):(\d+)$/);
      if (match) {
        return { book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) };
      }
      return null;
    };

    const correctAnswer = verse.reference;
    const correct = parseReference(correctAnswer);
    const wrongReferences = [];

    // Define book groups
    const GOSPELS = ['Matthew', 'Mark', 'Luke', 'John'];
    const isGospel = correct && GOSPELS.includes(correct.book);

    // NT verses that quote OT (for trick questions)
    const NT_QUOTES_OT = [
      { nt: 'Matthew 4:4', ot: 'Deuteronomy 8:3' },
      { nt: 'Matthew 4:7', ot: 'Deuteronomy 6:16' },
      { nt: 'Matthew 4:10', ot: 'Deuteronomy 6:13' },
      { nt: 'Matthew 21:13', ot: 'Isaiah 56:7' },
      { nt: 'Mark 12:29-30', ot: 'Deuteronomy 6:4-5' },
      { nt: 'Luke 4:18', ot: 'Isaiah 61:1' },
      { nt: 'John 6:31', ot: 'Psalm 78:24' },
      { nt: 'Romans 3:10', ot: 'Psalm 14:1' },
      { nt: 'Hebrews 1:5', ot: 'Psalm 2:7' },
      { nt: 'James 2:8', ot: 'Leviticus 19:18' }
    ];

    if (correct) {
      // Randomly choose answer pattern
      let pattern = Math.random();

      if (isGospel) {
        // GOSPEL PATTERN: All 4 Gospels as options, only one correct
        wrongReferences.length = 0;
        const otherGospels = GOSPELS.filter(g => g !== correct.book);

        otherGospels.forEach(gospel => {
          const randomChapter = Math.floor(Math.random() * 20) + 1;
          const randomVerse = Math.floor(Math.random() * 30) + 1;
          wrongReferences.push(`${gospel} ${randomChapter}:${randomVerse}`);
        });
      } else if (pattern < 0.2) {
        // 20% chance: NT-quotes-OT TRICK QUESTION
        const quotePair = NT_QUOTES_OT.find(pair =>
          pair.nt === correctAnswer || pair.ot === correctAnswer
        );

        if (quotePair) {
          // Include both NT and OT as options to create confusion
          const pairedRef = correctAnswer === quotePair.nt ? quotePair.ot : quotePair.nt;
          wrongReferences.push(pairedRef);

          // Add two more from same testament as correct answer
          const sameTestamentBooks = correctAnswer.includes('Matthew') || correctAnswer.includes('Mark') ||
                                     correctAnswer.includes('Luke') || correctAnswer.includes('John') ||
                                     correctAnswer.includes('Acts') || correctAnswer.includes('Romans') ||
                                     correctAnswer.includes('Corinthians') || correctAnswer.includes('Galatians') ||
                                     correctAnswer.includes('Ephesians') || correctAnswer.includes('Philippians') ||
                                     correctAnswer.includes('Colossians') || correctAnswer.includes('Thessalonians') ||
                                     correctAnswer.includes('Timothy') || correctAnswer.includes('Titus') ||
                                     correctAnswer.includes('Philemon') || correctAnswer.includes('Hebrews') ||
                                     correctAnswer.includes('James') || correctAnswer.includes('Peter') ||
                                     correctAnswer.includes('John') || correctAnswer.includes('Jude') ||
                                     correctAnswer.includes('Revelation');

          if (sameTestamentBooks) {
            // NT books for additional options
            const ntBooks = ['Acts 1:8', 'Romans 8:28', '1 Corinthians 13:13', 'Ephesians 2:8', 'Philippians 4:13'];
            const filtered = ntBooks.filter(ref => ref !== correctAnswer && ref !== pairedRef);
            wrongReferences.push(...filtered.slice(0, 2));
          } else {
            // OT books for additional options
            const otBooks = ['Genesis 1:1', 'Exodus 20:3', 'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 40:31'];
            const filtered = otBooks.filter(ref => ref !== correctAnswer && ref !== pairedRef);
            wrongReferences.push(...filtered.slice(0, 2));
          }
        } else {
          // Fallback to standard pattern if not a quote pair
          pattern = 0.5; // Use standard pattern
        }
      }

      if (pattern >= 0.2 && pattern < 0.5 && !isGospel) {
        // 30% chance: ODD ONE OUT - Correct answer from different book, 3 wrong from same book
        const wrongBookOptions = ['Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'John', 'Romans', 'Ephesians'];
        const wrongBook = wrongBookOptions.find(book => book !== correct.book) || 'Genesis';

        // Generate 3 references from the same wrong book
        for (let i = 0; i < 3; i++) {
          const randomChapter = Math.floor(Math.random() * 20) + 1;
          const randomVerse = Math.floor(Math.random() * 30) + 1;
          wrongReferences.push(`${wrongBook} ${randomChapter}:${randomVerse}`);
        }
      } else if (!isGospel && wrongReferences.length === 0) {
        // 50% chance: STANDARD PATTERN - Varied mix (default behavior)
        // Generate 2 close wrong answers (same book or nearby verses)
        // Close answer 1: Same book, different chapter
        const nearbyChapter = correct.chapter + (Math.random() > 0.5 ? 1 : -1);
        const nearbyVerse = Math.floor(Math.random() * 20) + 1;
        wrongReferences.push(`${correct.book} ${Math.max(1, nearbyChapter)}:${nearbyVerse}`);

        // Close answer 2: Same book, same chapter, different verse
        const differentVerse = correct.verse + (Math.random() > 0.5 ? 3 : -3);
        wrongReferences.push(`${correct.book} ${correct.chapter}:${Math.max(1, differentVerse)}`);

        // Far answer: Completely different book
        const farBooks = ['Genesis 1:1', 'Exodus 20:3', 'Leviticus 19:18', 'Deuteronomy 6:5',
                          'Joshua 1:9', '1 Samuel 16:7', 'Job 19:25', 'Psalm 23:1', 'Psalm 119:105',
                          'Proverbs 3:5', 'Isaiah 40:31', 'Jeremiah 29:11', 'Daniel 3:17',
                          'Matthew 5:14', 'Matthew 28:19', 'Mark 10:45', 'Luke 6:31', 'John 1:1', 'John 14:6',
                          'Acts 1:8', 'Romans 3:23', 'Romans 8:28', '1 Corinthians 13:13',
                          'Galatians 5:22', 'Ephesians 6:11', 'Philippians 4:13',
                          'Colossians 3:23', '1 Thessalonians 5:16', 'Hebrews 11:1', 'James 1:2',
                          '1 Peter 5:7', '1 John 4:8', 'Revelation 21:4'];

        const farOptions = farBooks.filter(ref => {
          const farRef = parseReference(ref);
          return farRef && farRef.book !== correct.book;
        });

        if (farOptions.length > 0) {
          wrongReferences.push(farOptions[Math.floor(Math.random() * farOptions.length)]);
        } else {
          wrongReferences.push('Genesis 1:1');
        }
      }
    } else {
      // Fallback if parsing fails
      wrongReferences.push('John 1:1', 'Genesis 1:1', 'Psalm 119:105');
    }

    // Filter out duplicates and correct answer
    const uniqueWrongReferences = [...new Set(wrongReferences)].filter(r => r !== verse.reference).slice(0, 3);

    // Set verse detective data with personal verse flag
    setVerseDetectiveData({
      verse,
      wrongReferences: uniqueWrongReferences,
      isPersonalVerse: true,
      canEarnPoints,
      completionsToday
    });

    setCurrentView('verse-detective');
  } catch (error) {
    console.error('Error loading Personal Verse Detective:', error);
    showToast('Error loading Personal Verse Detective. Please try again.', 'error');
  }

  setLoading(false);
};

// Background music reference for Sword Drill Ultimate
let backgroundMusicRef = null;

// Play sound effect
const playSound = (soundType) => {
  try {
    const soundSettings = userData?.soundSettings || { enabled: true, volume: 0.5 };

    // Check if sounds are enabled
    if (!soundSettings.enabled) return;

    let soundPath = '';
    if (soundType === 'correct') {
      soundPath = `${process.env.PUBLIC_URL}/ytmp3free.cc_correct-answer-sound-effect-no-copyright-youtubemp3free.org.mp3`;
    } else if (soundType === 'incorrect') {
      soundPath = `${process.env.PUBLIC_URL}/feud buzzer.mp3`;
    }

    if (soundPath) {
      const audio = new Audio(soundPath);
      audio.volume = soundSettings.volume; // Use user's volume setting
      audio.play().catch(err => {
        console.log('Audio play failed:', err);
        // Silent fail - audio is optional
      });
    }
  } catch (error) {
    console.log('Error playing sound:', error);
    // Silent fail - audio is optional
  }
};

// Show generic toast notification
const showToast = (message, type = 'success') => {
  setGenericToastMessage(message);
  setGenericToastType(type);
  setShowGenericToast(true);
  setTimeout(() => {
    setShowGenericToast(false);
  }, 3000);
};

// Play background music for Sword Drill Ultimate
const playBackgroundMusic = () => {
  try {
    const soundSettings = userData?.soundSettings || { musicEnabled: true, musicVolume: 0.3 };

    // Check if music is enabled
    if (!soundSettings.musicEnabled) return;

    // Stop any existing background music
    if (backgroundMusicRef) {
      fadeOutMusic();
      return;
    }

    const musicPath = `${process.env.PUBLIC_URL}/ytmp3free.cc_best-cinematic-action-beats-inspiring-no-copyright-background-music-youtubemp3free.org.mp3`;
    backgroundMusicRef = new Audio(musicPath);
    backgroundMusicRef.volume = soundSettings.musicVolume; // Use user's music volume
    backgroundMusicRef.loop = true; // Loop the music
    backgroundMusicRef.play().catch(err => {
      console.log('Background music play failed:', err);
      backgroundMusicRef = null;
    });
  } catch (error) {
    console.log('Error playing background music:', error);
    backgroundMusicRef = null;
  }
};

// Fade out background music
const fadeOutMusic = () => {
  const audio = backgroundMusicRef;
  if (!audio) return;

  const fadeInterval = 50; // ms between volume decreases
  const fadeStep = 0.05; // amount to decrease volume each step

  const fade = setInterval(() => {
    // Guard against audio being cleared elsewhere
    if (!audio) {
      clearInterval(fade);
      backgroundMusicRef = null;
      return;
    }

    if (audio.volume > fadeStep) {
      audio.volume = Math.max(0, audio.volume - fadeStep);
    } else {
      audio.pause();
      backgroundMusicRef = null;
      clearInterval(fade);
    }
  }, fadeInterval);
};

// Note: matchBiblicalReference now imported from './core' (private submodule)


const submitQuiz = async (isCorrectOverride, timeTakenOverride) => {
  // Guard: if React passes a click event, prevent default and ignore the override
  if (isCorrectOverride && typeof isCorrectOverride === 'object' && 'preventDefault' in isCorrectOverride) {
    try { isCorrectOverride.preventDefault(); } catch (_) {}
    isCorrectOverride = undefined;
  }
  // Only honor boolean overrides; everything else falls back to normal grading
  let isCorrect = typeof isCorrectOverride === 'boolean' ? isCorrectOverride : undefined;
  if (isCorrect === undefined) {
    if (quizState.type === 'fill-blank') {
      // For multiple blanks with word objects
      if (quizState.userAnswers) {
        const correctAnswers = quizState.blankWords.map(w => w.toLowerCase().replace(/[.,;:!?]/g, ''));
        const userAnswersClean = quizState.userAnswers.map(a => {
          if (!a) return '';
          // Handle both string and object formats
          const word = typeof a === 'string' ? a : a.word;
          return word.toLowerCase().trim().replace(/[.,;:!?]/g, '');
        });

        // Check if all answers match
        isCorrect = userAnswersClean.length === correctAnswers.length &&
                    userAnswersClean.every((ans, idx) => ans === correctAnswers[idx]);
      } else {
        // Old single-blank format
        isCorrect = quizState.userAnswer.toLowerCase().trim() === quizState.answer.toLowerCase().trim();
      }
    } else if (quizState.type === 'reference-recall') {
      // Use fuzzy matching for biblical references
      isCorrect = matchBiblicalReference(quizState.userAnswer, quizState.answer);
    } else {
      isCorrect = quizState.userAnswer === quizState.correctAnswer;
    }
  }

  // Calculate points using new point system
  const userLevel = userData.currentLevel || 'Beginner';
  const quizTime = typeof timeTakenOverride === 'number'
    ? timeTakenOverride
    : (typeof quizState?.timeTaken === 'number' ? quizState.timeTaken : quizTimer);
  const isPerfect = isCorrect; // For now, single question = perfect if correct

  // Get current verse progress for penalty calculation
  if (!quizState || !quizState.verse) {
    console.error('[submitQuiz] quizState or quizState.verse is null:', quizState);
    return;
  }
  const verseId = quizState.verse.reference;
  const currentProgress = userData.verseProgress[verseId] || {
    correctCount: 0,
    incorrectCount: 0,
    lastReview: null,
    nextReview: null,
    quizTypes: {}
  };

  let points = calculateQuizPoints(quizState.type, isCorrect, userLevel, quizTime, isPerfect, currentProgress, quizState.isPersonalVerse);

  // Check for first quiz of day bonus (use local date to avoid UTC drift)
  const todayString = localDateString(new Date());
  const lastQuizDate = localStorage.getItem('lastQuizDate');
  const isFirstQuizToday = lastQuizDate !== todayString;

  if (isCorrect && isFirstQuizToday) {
    points += awardBonusPoints('firstQuizOfDay');
    localStorage.setItem('lastQuizDate', todayString);
  }

  // Check for streak bonus (daily streak maintained)
  let currentStreakValue = calculateCurrentStreak();
  // Preserve existing streak on incorrect attempts (don't drop streak until a day passes)
  if (!isCorrect) {
    currentStreakValue = Math.max(userData.currentStreak || 0, currentStreakValue);
  }
  if (isCorrect && currentStreakValue > 0) {
    points += awardBonusPoints('dailyStreakMaintained', Math.min(currentStreakValue, 10)); // Cap at 10x
  }

  // Apply inactivity penalty (only on first quiz after inactivity)
  const inactivityPenalty = calculateInactivityPenalty();
  if (inactivityPenalty < 0 && isFirstQuizToday) {
    points += inactivityPenalty; // Penalty is negative
  }

  // Update last activity date
  localStorage.setItem('lastActivityDate', new Date().toISOString());

  const newQuizzesCompleted = userData.quizzesCompleted + 1;
  const newTotalPoints = Math.max(0, userData.totalPoints + points); // Can't go below 0

  // STREAK TRACKING: Track all quiz attempts (correct and incorrect)
  // Store detailed quiz information for calendar view
  const today = new Date();
  const dateString = localDateString(today);
  const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');

  // Create detailed quiz entry
  const quizEntry = {
    verseReference: quizState.verse.reference,
    type: quizState.type,
    correct: isCorrect,
    points: points,
    timestamp: today.toISOString(),
    dateKey: localDateString(today)
  };

  // Initialize or update day's data
  if (!streakData[dateString]) {
    streakData[dateString] = {
      marked: isCorrect, // Only mark as completed if correct
      quizCount: 1,
      quizzes: [quizEntry],
      timestamp: today.toISOString()
    };
  } else {
    // Update existing day
    streakData[dateString].quizCount = (streakData[dateString].quizCount || 0) + 1;
    if (isCorrect) {
      streakData[dateString].marked = true; // Mark as complete on first correct answer
    }
    // Add quiz to the day's quiz array
    if (!streakData[dateString].quizzes) {
      streakData[dateString].quizzes = [];
    }
    streakData[dateString].quizzes.push(quizEntry);
  }

  // Save to localStorage
  localStorage.setItem('streakData', JSON.stringify(streakData));
  // Also append to local quizHistory for calendar/streak recovery
  if (isCorrect) {
    const updatedQuizHistory = [
      ...(userData.quizHistory || []),
      { ...quizEntry }
    ];
    setUserData(prev => ({ ...prev, quizHistory: updatedQuizHistory }));
  }

  // Recalculate current streak (counts consecutive days with completed quizzes)
  if (isCorrect) {
    currentStreakValue = calculateCurrentStreak();

    // Update userData with new streak (will be synced to Firebase below)
    setUserData(prev => ({
      ...prev,
      currentStreak: currentStreakValue
    }));
  }

  // Update verse progress with spaced repetition
  // Note: verseId and currentProgress already declared above for point calculation

  // Track progress by quiz type
  if (!currentProgress.quizTypes[quizState.type]) {
    currentProgress.quizTypes[quizState.type] = { correct: 0, incorrect: 0 };
  }
  
  if (isCorrect) {
    currentProgress.correctCount++;
    currentProgress.quizTypes[quizState.type].correct++;
  } else {
    currentProgress.incorrectCount++;
    currentProgress.quizTypes[quizState.type].incorrect++;
  }

  // Set quiz-type-specific cooldown to avoid immediate repeats
  if (!currentProgress.quizCooldowns) {
    currentProgress.quizCooldowns = {};
  }
  currentProgress.quizCooldowns[quizState.type] = Date.now() + getQuizCooldownMs(quizState.type);
  
  currentProgress.lastReview = Date.now();
  currentProgress.nextReview = calculateNextReview(
    currentProgress.correctCount,
    currentProgress.incorrectCount
  );
  
  const newVerseProgress = {
    ...userData.verseProgress,
    [verseId]: currentProgress
  };

  // Calculate verses mastered (requires 4+ quiz types mastered)
  const newVersesMastered = calculateMasteredVerses(newVerseProgress);

  // Prepare updated user data for achievement checking
  const updatedUserDataForChecking = {
    ...userData,
    quizzesCompleted: newQuizzesCompleted,
    totalPoints: newTotalPoints,
    versesMemorized: newVersesMastered,
    currentStreak: currentStreakValue
  };

  // Check for new achievements using the new system
  const newlyUnlockedIds = checkForNewAchievements(updatedUserDataForChecking);
  const previousAchievements = Array.isArray(userData.achievements) ? userData.achievements : [];
  const newAchievements = [...previousAchievements, ...newlyUnlockedIds];

  console.log('[Achievement Persistence Debug]');
  console.log('Previous achievements:', previousAchievements);
  console.log('Newly unlocked IDs:', newlyUnlockedIds);
  console.log('Combined achievements:', newAchievements);

  // Auto-unlock translations based on points
  const updatedUnlockables = { ...userData.unlockables };
  if (newTotalPoints >= 5000 && !updatedUnlockables.lxx) {
    updatedUnlockables.lxx = true;
  }
  if (newTotalPoints >= 7500 && !updatedUnlockables.masoretic) {
    updatedUnlockables.masoretic = true;
  }
  if (newTotalPoints >= 10000 && !updatedUnlockables.sinaiticus) {
    updatedUnlockables.sinaiticus = true;
  }

  // Update newly unlocked achievements list
  const updatedNewlyUnlocked = [...(userData.newlyUnlockedAchievements || []), ...newlyUnlockedIds];

  const newQuizData = {
    quizzesCompleted: newQuizzesCompleted,
    totalPoints: newTotalPoints,
    achievements: newAchievements,
    verseProgress: newVerseProgress,
    versesMemorized: newVersesMastered,
    currentStreak: currentStreakValue,
    unlockables: updatedUnlockables,
    newlyUnlockedAchievements: updatedNewlyUnlocked,
    achievementClickHistory: userData.achievementClickHistory || {}
  };

  console.log('[Quiz Data to Save]', newQuizData);

  // Save to Firebase
  if (currentUser) {
    console.log('[Firebase] Saving quiz result with achievements:', newAchievements);
      const saveResult = await addQuizResult(currentUser.uid, {
        verseId: quizState.verse.id,
        verseReference: verseId,
        type: quizState.type,
        correct: isCorrect,
        timestamp: new Date(),
        points: points,
        currentStreak: currentStreakValue,
        streakData: streakData, // Sync streak calendar data to Firebase
        ...newQuizData
      });
    console.log('[Firebase] Save result:', saveResult);
  }

  // Always update all quiz data (quizzes completed, verses mastered, etc.)
  setUserData(prev => ({
    ...prev,
    ...newQuizData
  }));

  // Show achievement unlock notifications
  if (newlyUnlockedIds.length > 0) {
    // Play congratulations sound (only once even if multiple achievements unlocked)
    try {
      const congratsSound = new Audio(`${process.env.PUBLIC_URL}/ytmp3free.cc_congratulations-sound-effects-free-audio-youtubemp3free.org.mp3`);
      const soundSettings = userData.soundSettings || { enabled: true, volume: 0.5 };
      if (soundSettings.enabled) {
        congratsSound.volume = soundSettings.volume || 0.5;
        congratsSound.play().catch(err => console.log('Could not play congratulations sound:', err));
      }
    } catch (err) {
      console.log('Error playing congratulations sound:', err);
    }

    // Find the first achievement to display
    const allAchievements = [];
    Object.entries(ACHIEVEMENTS).forEach(([tier, achievements]) => {
      achievements.forEach(achievement => {
        allAchievements.push({ ...achievement, tier });
      });
    });

    const firstUnlockedAchievement = allAchievements.find(a => a.id === newlyUnlockedIds[0]);
    if (firstUnlockedAchievement) {
      setShowAchievementUnlock(firstUnlockedAchievement);
      setHasUnviewedAchievements(true);
      localStorage.setItem('hasUnviewedAchievements', 'true');

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowAchievementUnlock(null);
      }, 5000);
    }
  }

  // Play sounds immediately based on result
  if (isCorrect) {
    playSound('correct');
  } else {
    playSound('incorrect');
  }

  if (isCorrect) {
    // Build detailed point breakdown message
    let message = `✅ Correct!\n\n`;
    const basePoints = POINT_SYSTEM.BASE_QUIZ_POINTS[quizState.type] || 10;
    const levelMultiplier = POINT_SYSTEM.DIFFICULTY_MULTIPLIERS[userLevel]?.multiplier || 1.0;

    message += `📊 Points Breakdown:\n`;
    message += `  Base: ${basePoints} pts\n`;
    message += `  Level (${userLevel}): ×${levelMultiplier} = ${Math.floor(basePoints * levelMultiplier)} pts\n`;

    if (isFirstQuizToday) {
      message += `  🌅 First Quiz Today: +${POINT_SYSTEM.BONUSES.firstQuizOfDay} pts\n`;
    }

    if (currentStreakValue > 0) {
      const streakBonus = POINT_SYSTEM.BONUSES.dailyStreakMaintained * Math.min(currentStreakValue, 10);
      message += `  🔥 Streak Bonus (${currentStreakValue} days): +${streakBonus} pts\n`;
    }

    if (inactivityPenalty < 0) {
      message += `  ⚠️ Inactivity Penalty: ${inactivityPenalty} pts\n`;
    }

    message += `\n💰 Total: ${points > 0 ? '+' : ''}${points} points`;
    message += `\n🏆 New Balance: ${newTotalPoints} points`;

    const progress = currentProgress.quizTypes[quizState.type];
    if (progress.correct >= 3 && progress.incorrect === 0) {
      message += `\n\n🎯 Mastered this verse! You won't see it again for a while.`;
    }

    // Show toast notification instead of alert
    setToastPoints(points);
    setShowCorrectToast(true);
    setTimeout(() => {
      setShowCorrectToast(false);
      setCurrentView('home');
      setQuizState(null);
    }, 2300);
  } else {
    // Get penalty based on user's current level
    const basePenalty =
      POINT_SYSTEM.PENALTIES?.incorrectAnswer?.[userLevel] ??
      POINT_SYSTEM.PENALTIES?.incorrectAnswer?.Beginner ??
      -10;
    const penalty = Number.isFinite(basePenalty) ? basePenalty : -10;

    // For fill-in-blank quizzes, show Enhanced Review Modal
    if (quizState.type === 'fill-blank' && quizState.verse) {
      setFailedQuizData({
        verse: quizState.verse.text,
        reference: quizState.verse.reference,
        quizType: quizState.type,
        penalty: penalty,
        newBalance: newTotalPoints
      });
      setShowEnhancedReview(true);
    } else {
      // For other quiz types, show incorrect toast and then memory tip
      const tip = getRandomMemoryTip();
      setMemoryTip(tip);

      // Show incorrect toast immediately with penalty amount
      setToastPoints(penalty); // Store penalty to display on toast
      setShowIncorrectToast(true);
      setTimeout(() => {
        setShowIncorrectToast(false);
        // Show memory tip modal after toast
        setShowMemoryTip(true);
        setTimeout(() => {
          setShowMemoryTip(false);
          setCurrentView('home');
          setQuizState(null);
        }, 5000); // Show memory tip for 5 seconds
      }, 2000); // Show incorrect toast for 2 seconds
    }
  }
};

  // Enhanced Review Modal handlers
  const handleEnhancedReviewComplete = (result) => {
    // Award bonus points for completing the enhanced review
    const bonusPoints = result.pointsEarned || 0;
    if (bonusPoints > 0) {
      setUserData(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + bonusPoints
      }));
    }

    // Show memory tip after enhanced review
    const tip = getRandomMemoryTip();
    setMemoryTip(tip);

    setShowEnhancedReview(false);
    setFailedQuizData(null);

    // Show memory tip
    setShowMemoryTip(true);
    setTimeout(() => {
      setShowMemoryTip(false);
      setCurrentView('home');
      setQuizState(null);
    }, 5000);
  };

  const handleEnhancedReviewSkip = () => {
    // Show memory tip after skipping
    const tip = getRandomMemoryTip();
    setMemoryTip(tip);

    setShowEnhancedReview(false);
    setFailedQuizData(null);

    // Show memory tip
    setShowMemoryTip(true);
    setTimeout(() => {
      setShowMemoryTip(false);
      setCurrentView('home');
      setQuizState(null);
    }, 5000);
  };


  const HomeView = () => (
    <div className="space-y-6">
      {verseOfDay && (
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-2 border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-amber-400" size={24} />
              <h2 className="text-xl font-bold text-amber-400">Verse of the Day</h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={verseOfDayRead}
                  onChange={handleVerseOfDayRead}
                  className="w-5 h-5 rounded border-2 border-amber-500 bg-slate-800 checked:bg-amber-500 checked:border-amber-500 cursor-pointer transition-all"
                  disabled={verseOfDayRead}
                />
                <span className={`text-sm font-semibold ${verseOfDayRead ? 'text-green-400' : 'text-amber-400 group-hover:text-amber-300'} transition-colors`}>
                  {verseOfDayRead ? '✓ Read' : 'Mark as Read'}
                </span>
              </label>
            </div>
          </div>
          <p className="text-white text-lg mb-3 leading-relaxed">{verseOfDay.text}</p>
          <p className="text-amber-300 font-semibold">— {verseOfDay.reference}</p>
        </div>
      )}

      {/* Bible Reader Button */}
      <button
        onClick={() => setShowBibleReader(true)}
        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white p-4 rounded-xl border-2 border-amber-500 hover:border-amber-400 transition-all shadow-lg"
      >
        <div className="font-bold text-lg flex items-center justify-center gap-2">
          <span className="text-2xl">📖</span>
          Open Bible Reader
        </div>
        <div className="text-amber-100 text-sm">
          Read Scripture by Chapter • {['KJV', 'ASV', 'WEB', 'ESV', 'NIV', 'NLT', 'YLT'].includes(userData.selectedTranslation?.toUpperCase()) ? userData.selectedTranslation.toUpperCase() : 'KJV'}
        </div>
      </button>

      {/* Personal Verse Bank Button */}
      <button
        onClick={() => setCurrentView('personal-verse-bank')}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white p-4 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 transition-all shadow-lg"
      >
        <div className="font-bold text-lg flex items-center justify-center gap-2">
          <span className="text-2xl">📘</span>
          Personal Verse Bank
        </div>
        <div className="text-cyan-100 text-sm">
          Your Memory Verses • {(userData.personalMemoryVerses || []).length} verses saved
        </div>
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="text-amber-400 text-3xl font-bold">{userData.versesMemorized}</div>
          <div className="text-slate-300 text-sm">Verses Memorized</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="flex items-center gap-2">
            {(() => {
              const currentStreak = userData.currentStreak || 0;

              if (currentStreak === 0) {
                return (
                  <>
                    <span className="shivering-ice text-2xl">🧊</span>
                    <span className="text-cyan-400 text-3xl font-bold">0</span>
                  </>
                );
              }

              // Determine flame colors based on streak milestones
              let outerColor, middleColor, innerColor, textColor;

              if (currentStreak >= 100) {
                // Legendary Purple flame (100+ days)
                outerColor = "#7c3aed"; // violet-600
                middleColor = "#a78bfa"; // violet-400
                innerColor = "#c4b5fd"; // violet-300
                textColor = "text-violet-400";
              } else if (currentStreak >= 50) {
                // Blue flame (50-99 days)
                outerColor = "#2563eb"; // blue-600
                middleColor = "#60a5fa"; // blue-400
                innerColor = "#93c5fd"; // blue-300
                textColor = "text-blue-400";
              } else if (currentStreak >= 30) {
                // Green flame (30-49 days)
                outerColor = "#059669"; // emerald-600
                middleColor = "#34d399"; // emerald-400
                innerColor = "#6ee7b7"; // emerald-300
                textColor = "text-emerald-400";
              } else if (currentStreak >= 14) {
                // Yellow flame (14-29 days)
                outerColor = "#d97706"; // amber-600
                middleColor = "#fbbf24"; // amber-400
                innerColor = "#fde047"; // yellow-300
                textColor = "text-amber-400";
              } else if (currentStreak >= 7) {
                // Orange flame (7-13 days)
                outerColor = "#ea580c"; // orange-600
                middleColor = "#fb923c"; // orange-400
                innerColor = "#fdba74"; // orange-300
                textColor = "text-orange-400";
              } else {
                // Red/Orange flame (1-6 days)
                outerColor = "#dc2626"; // red-600
                middleColor = "#f97316"; // orange-500
                innerColor = "#fbbf24"; // amber-400
                textColor = "text-orange-400";
              }

              return (
                <>
                  <div className="relative inline-block" style={{ width: '24px', height: '32px' }}>
                    {/* Outer layer */}
                    <svg
                      width="24"
                      height="32"
                      viewBox="0 0 24 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0 animate-flame-outer"
                    >
                      <path
                        d="M12 2C10 5 8 8 8 12C8 13.5 8.5 15 9.5 16.5C8 15.5 6.5 13.5 6.5 11C4 14 3 18 3 22C3 27.5 7 32 12 32C17 32 21 27.5 21 22C21 17 19 13 16.5 10C17 13 16.5 16 14.5 18C15 15 14 11 12 2Z"
                        fill={outerColor}
                        opacity="0.9"
                      />
                    </svg>
                    {/* Middle layer */}
                    <svg
                      width="20"
                      height="28"
                      viewBox="0 0 20 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute animate-flame-middle"
                      style={{ left: '2px', top: '2px', animationDelay: '0.1s' }}
                    >
                      <path
                        d="M10 1C8.5 3.5 7 6 7 9C7 10.5 7.5 11.5 8 12.5C7 12 6 10.5 6 9C4 11.5 3 14 3 17.5C3 22 6.5 26 10 26C13.5 26 17 22 17 17.5C17 13.5 15.5 10.5 13.5 8C14 10.5 13.5 12.5 12 14C12.5 11.5 11.5 8 10 1Z"
                        fill={middleColor}
                        opacity="0.85"
                      />
                    </svg>
                    {/* Inner layer */}
                    <svg
                      width="14"
                      height="22"
                      viewBox="0 0 14 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute animate-flame-inner"
                      style={{ left: '5px', top: '6px', animationDelay: '0.2s' }}
                    >
                      <path
                        d="M7 1C6 2.5 5 4.5 5 6.5C5 7.5 5.5 8.5 6 9C5.5 8.5 5 7.5 5 6.5C3.5 8.5 3 10.5 3 13C3 16.866 5.134 20 7 20C8.866 20 12 16.866 12 13C12 10 11 8 9.5 6.5C10 8 9.5 9.5 8.5 10.5C9 8.5 8 5.5 7 1Z"
                        fill={innerColor}
                        opacity="0.95"
                      />
                    </svg>
                  </div>
                  <span className={`text-3xl font-bold ${textColor}`}>{currentStreak}</span>
                </>
              );
            })()}
          </div>
          <div className="text-slate-300 text-sm">Day Streak</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="text-amber-400 text-3xl font-bold">{userData.quizzesCompleted}</div>
          <div className="text-slate-300 text-sm">Quizzes Completed</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="text-amber-400 text-3xl font-bold">{userData.totalPoints}</div>
          <div className="text-slate-300 text-sm">Total Points</div>
        </div>
      </div>

      {/* Memory Meters - Level Progress */}
      <ProgressMeters userData={userData} isEliChallenge={quizState?.mode === 'eli-challenge'} />

      <div>
        <h3 className="text-xl font-bold text-amber-400 mb-4">Start Training</h3>
        <div className="space-y-3">
          <button
  onClick={() => startQuiz('fill-blank')}
  disabled={loading}
  className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl border border-slate-600 hover:border-amber-500 transition-all text-left disabled:opacity-50"
>
  <div className="font-bold text-lg">Fill in the Blank</div>
  <div className="text-slate-300 text-sm">
    Complete verses with {
      userData.quizzesCompleted > 200 ? '7' :
      userData.quizzesCompleted > 100 ? '6' :
      userData.quizzesCompleted > 50 ? '5' :
      userData.quizzesCompleted > 20 ? '4' : '3'
    } missing words
  </div>
</button>
          <button
            onClick={() => startQuiz('multiple-choice')}
            disabled={loading}
  className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl border border-slate-600 hover:border-amber-500 transition-all text-left disabled:opacity-50"
          >
           <div className="font-bold text-lg">{loading ? '⏳ Loading...' : 'Multiple Choice'}</div>
            <div className="text-slate-400 text-sm">Identify the correct reference</div>
          </button>
          <button
            onClick={() => startQuiz('reference-recall')}
            disabled={loading}
  className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl border border-slate-600 hover:border-amber-500 transition-all text-left disabled:opacity-50"
          >
            <div className="font-bold text-lg">Reference Recall</div>
            <div className="text-slate-400 text-sm">Name the verse reference</div>
          </button>
          <button
            onClick={() => startQuiz('verse-scramble')}
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl border border-slate-600 hover:border-amber-500 transition-all text-left disabled:opacity-50"
          >
            <div className="font-bold text-lg">Verse Scramble</div>
            <div className="text-slate-400 text-sm">Unscramble the words of the verse</div>
          </button>
          <button
            onClick={startVerseDetective}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-4 rounded-xl border border-emerald-500 hover:border-emerald-400 transition-all text-left disabled:opacity-50 shadow-lg"
          >
            <div className="font-bold text-lg">🔍 Verse Detective</div>
            <div className="text-emerald-100 text-sm">Uncover the mystery verse through clues</div>
          </button>
          <button
            onClick={() => setCurrentView('book-order-quiz')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-xl border border-purple-500 hover:border-purple-400 transition-all text-left disabled:opacity-50 shadow-lg"
          >
            <div className="font-bold text-lg">📚 Book Order Challenge</div>
            <div className="text-purple-100 text-sm">Name the books before and after • Timed</div>
          </button>
          <button
            onClick={() => {
              // Play sword scrape sound
              try {
                const swordSound = new Audio('/sword_drill/sword scrape.mp3');
                const soundSettings = userData.soundSettings || { enabled: true, volume: 0.5 };
                if (soundSettings.enabled) {
                  swordSound.volume = soundSettings.volume || 0.5;
                  swordSound.play().catch(err => console.log('Could not play sword sound:', err));
                }
              } catch (err) {
                console.log('Error playing sword sound:', err);
              }
              setCurrentView('sword-drill-ultimate');
            }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-slate-900 p-5 rounded-xl border-4 border-amber-400 hover:border-yellow-300 transition-all text-left disabled:opacity-50 shadow-2xl gold-glow"
          >
            <div className="font-bold text-xl flex items-center gap-2">
              <Sword size={24} className="text-amber-900" />
              Sword Drill Ultimate
            </div>
            <div className="text-amber-900 font-semibold text-sm">Book Order + Verse Scramble • Ranked Grading</div>
          </button>
          <button
            onClick={() => setCurrentView('bonus-quizzes')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white p-4 rounded-xl border-2 border-red-600 hover:border-red-500 transition-all text-left disabled:opacity-50 shadow-lg"
          >
            <div className="font-bold text-lg flex items-center gap-2">
              <Trophy size={20} />
              Bonus Quizzes
            </div>
            <div className="text-red-100 text-sm">Spelling Bee • Bible Trivia • Extra Points!</div>
          </button>
        </div>
      </div>
    </div>
  );

  // Drop zone component for drag-and-drop
  const DropZone = React.memo(({ index, value, onDrop, onDragOver, onRemove }) => {
    const handleClick = (e) => {
      e.stopPropagation();
      if (value) {
        onRemove(index);
      }
    };

    return (
      <span className="inline-block relative mx-1">
        <sup className="text-amber-400 text-xs absolute -top-3 left-1">{index + 1}</sup>
        <div
          onDrop={(e) => onDrop(e, index)}
          onDragOver={(e) => onDragOver(e)}
          onClick={handleClick}
          className={`w-32 px-2 py-1 rounded border-2 border-dashed text-center min-h-[2rem] flex items-center justify-center transition-all ${
            value
              ? 'bg-amber-500 border-amber-400 text-slate-900 font-semibold cursor-pointer hover:bg-amber-600'
              : 'bg-slate-700/50 border-slate-500 text-slate-400'
          }`}
        >
          {value ? value.word : '___'}
        </div>
      </span>
    );
  });

  const QuizView = () => {
    // Drag and drop handlers
    const handleDragStart = useCallback((e, wordItem) => {
      console.log('Drag started:', wordItem);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(wordItem));
    }, []);

    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e, index) => {
      e.preventDefault();
      e.stopPropagation();

      const wordItemStr = e.dataTransfer.getData('text/plain');
      if (!wordItemStr) return;

      const wordItem = JSON.parse(wordItemStr);
      console.log('Dropped word:', wordItem, 'at index:', index);

      setQuizState(prev => {
        const newAnswers = [...prev.userAnswers];
        newAnswers[index] = wordItem;

        // Remove this specific item from word bank by ID
        const newWordBank = prev.wordBank.filter(w => w.id !== wordItem.id);

        return {
          ...prev,
          userAnswers: newAnswers,
          wordBank: newWordBank
        };
      });
    }, []);

    const handleRemoveWord = useCallback((index) => {
      setQuizState(prev => {
        const removedWordItem = prev.userAnswers[index];
        if (!removedWordItem) return prev;

        const newAnswers = [...prev.userAnswers];
        newAnswers[index] = null;

        const newWordBank = [...prev.wordBank, removedWordItem].sort(() => Math.random() - 0.5);

        return {
          ...prev,
          userAnswers: newAnswers,
          wordBank: newWordBank
        };
      });
    }, []);

    // Note: Verse Scramble is now rendered at top level to prevent re-render issues

    if (!quizState) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-amber-500/30">
          <div className="flex justify-between items-center mb-4">
            <div className="text-amber-400 font-bold">
              {quizState.type === 'fill-blank' && 'Fill in the Blank'}
              {quizState.type === 'multiple-choice' && 'Multiple Choice'}
              {quizState.type === 'reference-recall' && 'Reference Recall'}
            </div>
            <div className="flex items-center gap-2 text-white bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-600">
              <Clock size={18} className="text-amber-400" />
              <span className="font-mono font-bold">
                {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question with drop zones for fill-blank */}
          {quizState.type === 'fill-blank' && quizState.userAnswers ? (
            <>
              <div className="text-white text-lg mb-6 leading-relaxed">
                {(() => {
                  let blankCounter = 0;
                  return quizState.question.split(' ').map((word, idx) => {
                    if (word === '___BLANK___') {
                      const currentBlankIndex = blankCounter;
                      blankCounter++;
                      return (
                        <DropZone
                          key={`blank-${currentBlankIndex}`}
                          index={currentBlankIndex}
                          value={quizState.userAnswers[currentBlankIndex]}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onRemove={handleRemoveWord}
                        />
                      );
                    }
                    return <span key={`word-${idx}`}>{word} </span>;
                  });
                })()}
              </div>

              {/* Word Bank */}
              {quizState.wordBank && quizState.wordBank.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                  <div className="text-amber-400 text-sm font-semibold mb-3">
                    Word Bank - Drag words to the blanks
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quizState.wordBank.map((wordItem) => (
                      <div
                        key={wordItem.id}
                        draggable={true}
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(e, wordItem);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg cursor-move hover:from-blue-500 hover:to-blue-600 hover:scale-105 transition-all shadow-md border border-blue-500 font-semibold select-none"
                      >
                        {wordItem.word}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placed Words - Click to Remove */}
              {quizState.userAnswers.some(a => a) && (
                <div className="mt-4 text-xs text-slate-400 text-center">
                  Click on a placed word to remove it
                </div>
              )}
            </>
          ) : quizState.type === 'fill-blank' ? (
            <div className="text-white text-lg mb-6 leading-relaxed">
              {quizState.question}
            </div>
          ) : (
            <div className="text-white text-lg mb-6 leading-relaxed">
              {quizState.question}
            </div>
          )}

          {quizState.type === 'reference-recall' && (
            <input
              key="reference-recall-input"
              type="text"
              value={quizState.userAnswer || ''}
              onChange={(e) => setQuizState(prev => ({ ...prev, userAnswer: e.target.value }))}
              placeholder="Type the reference (e.g., John 3:16)..."
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
              autoFocus
            />
          )}

          {quizState.type === 'multiple-choice' && (
            <div className="space-y-3">
              {quizState.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuizState(prev => ({ ...prev, userAnswer: option }))}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    quizState.userAnswer === option
                      ? 'bg-amber-500 border-amber-400 text-slate-900 font-bold'
                      : 'bg-slate-700 border-slate-600 text-white hover:border-amber-500'
                  }`}
                >
                  {option.replace(/:\\d+$/, '')}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={submitQuiz}
          disabled={
            quizState.type === 'fill-blank'
              ? !quizState.userAnswers || quizState.userAnswers.some(a => !a)
              : !quizState.userAnswer
          }
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>

        <button
          onClick={() => {
            setCurrentView('home');
            setQuizState(null);
          }}
          className="w-full bg-slate-600 text-white font-bold py-3 rounded-xl hover:bg-slate-500 transition-all"
        >
          Cancel
        </button>
      </div>
    );
  };

  const AchievementsView = () => {
    const [achievementFilter, setAchievementFilter] = useState('all');
    const [tierFilter, setTierFilter] = useState('all');
    const unlockedAchievements = Array.isArray(userData.achievements) ? userData.achievements : [];
    const newlyUnlocked = userData.newlyUnlockedAchievements || [];
    const clickHistory = userData.achievementClickHistory || {};

    console.log('[AchievementsView] userData.achievements:', userData.achievements);
    console.log('[AchievementsView] unlockedAchievements:', unlockedAchievements);

    // Flatten all achievements with tier info
    const allAchievements = [];
    Object.entries(ACHIEVEMENTS).forEach(([tier, achievements]) => {
      achievements.forEach(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const isNew = newlyUnlocked.includes(achievement.id) && !clickHistory[achievement.id];
        allAchievements.push({
          ...achievement,
          tier,
          isUnlocked,
          isNew
        });
      });
    });

    // Apply filters
    let filteredAchievements = allAchievements;

    if (achievementFilter === 'locked') {
      filteredAchievements = filteredAchievements.filter(a => !a.isUnlocked);
    } else if (achievementFilter === 'unlocked') {
      filteredAchievements = filteredAchievements.filter(a => a.isUnlocked);
    }

    if (tierFilter !== 'all') {
      filteredAchievements = filteredAchievements.filter(a => a.tier === tierFilter);
    }

    // Sort: newly unlocked first, then unlocked, then locked
    filteredAchievements.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      return 0;
    });

    // Count achievements by status
    const totalCount = allAchievements.length;
    const unlockedCount = allAchievements.filter(a => a.isUnlocked).length;
    const lockedCount = totalCount - unlockedCount;

    // Count by tier
    const tierCounts = {};
    Object.keys(ACHIEVEMENTS).forEach(tier => {
      tierCounts[tier] = allAchievements.filter(a => a.tier === tier).length;
    });

    const handleAchievementClick = (achievementId) => {
      if (newlyUnlocked.includes(achievementId) && !clickHistory[achievementId]) {
        const updatedHistory = {
          ...clickHistory,
          [achievementId]: new Date().toISOString()
        };
        setUserData(prev => ({
          ...prev,
          achievementClickHistory: updatedHistory
        }));
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <span className="text-6xl block mb-2">🏆</span>
          <h2 className="text-2xl font-bold text-amber-400">Achievements</h2>
          <p className="text-slate-300">
            Unlocked {unlockedCount} of {totalCount} achievements
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setAchievementFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                achievementFilter === 'all'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setAchievementFilter('unlocked')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                achievementFilter === 'unlocked'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setAchievementFilter('locked')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                achievementFilter === 'locked'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              Locked ({lockedCount})
            </button>
          </div>

          {/* Tier Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                tierFilter === 'all'
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Tiers
            </button>
            {Object.keys(ACHIEVEMENTS).map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tierFilter === tier
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tier} ({tierCounts[tier]})
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              onClick={() => handleAchievementClick(achievement.id)}
              className={`rounded-lg p-4 border-2 transition-all cursor-pointer relative ${
                achievement.isUnlocked
                  ? achievement.isNew
                    ? 'bg-amber-500/20 border-amber-500 animate-pulse-glow'
                    : 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-slate-800/30 border-slate-700 opacity-50'
              }`}
            >
              {achievement.isNew && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NEW!
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`text-4xl ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-lg ${achievement.isUnlocked ? 'text-amber-400' : 'text-slate-400'}`}>
                    {achievement.name}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {achievement.type === 'quiz_count' && `Complete ${achievement.value} quizzes`}
                    {achievement.type === 'streak' && `Reach a ${achievement.value} day streak`}
                    {achievement.type === 'verse_mastered' && `Master ${achievement.value} verses`}
                    {achievement.type === 'points' && `Earn ${achievement.value} points`}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {achievement.tier} • {achievement.id}
                  </div>
                </div>
                <div className={`text-3xl ${achievement.isUnlocked ? 'text-amber-400' : 'text-slate-600'}`}>
                  {achievement.isUnlocked ? '✓' : '🔒'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>No achievements match your filters</p>
          </div>
        )}
      </div>
    );
  };

  const MasteryView = () => {
    const [masteryFilter, setMasteryFilter] = useState('All');

    // Calculate mastery statistics
    const progressData = userData?.verseProgress || {};
    const verseStats = Object.entries(progressData).map(([reference, progress]) => {
      const correctCount = progress.correctCount || 0;
      const incorrectCount = progress.incorrectCount || 0;
      const totalAttempts = correctCount + incorrectCount;
      const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;

      // Count how many different quiz types have been successfully completed for this verse
      const quizTypes = progress.quizTypes || {};
      const successfulQuizTypes = Object.values(quizTypes).filter(qt =>
        qt.correct >= 3 && qt.incorrect === 0
      ).length;

      // Determine mastery level
      let masteryLevel = 'Learning';
      let masteryColor = 'text-slate-400';
      let bgColor = 'bg-slate-700/50';

      // Mastered: 90%+ accuracy, 5+ correct, AND completed 4+ different quiz types successfully
      if (accuracy >= 90 && progress.correctCount >= 5 && successfulQuizTypes >= 4) {
        masteryLevel = 'Mastered';
        masteryColor = 'text-green-400';
        bgColor = 'bg-green-500/10';
      } else if (accuracy >= 70 && progress.correctCount >= 3) {
        masteryLevel = 'Proficient';
        masteryColor = 'text-amber-400';
        bgColor = 'bg-amber-500/10';
      } else if (accuracy < 50 && totalAttempts >= 3) {
        masteryLevel = 'Struggling';
        masteryColor = 'text-red-400';
        bgColor = 'bg-red-500/10';
      }

      return {
        reference,
        accuracy: Math.round(accuracy),
        totalAttempts,
        correct: correctCount,
        incorrect: incorrectCount,
        masteryLevel,
        masteryColor,
        bgColor,
        lastReview: progress.lastReview,
        quizTypes: progress.quizTypes,
        successfulQuizTypes: successfulQuizTypes
      };
    });
    
    // Filter by mastery level
    const filteredStats = masteryFilter === 'All'
      ? verseStats
      : verseStats.filter(v => v.masteryLevel === masteryFilter);

    // Sort by accuracy (struggling first, then learning, then proficient, then mastered)
    const sortedStats = filteredStats.sort((a, b) => a.accuracy - b.accuracy);

    // Calculate overall statistics
    const totalVerses = verseStats.length;
    const masteredCount = verseStats.filter(v => v.masteryLevel === 'Mastered').length;
    const proficientCount = verseStats.filter(v => v.masteryLevel === 'Proficient').length;
    const learningCount = verseStats.filter(v => v.masteryLevel === 'Learning').length;
    const strugglingCount = verseStats.filter(v => v.masteryLevel === 'Struggling').length;
    
    const overallAccuracy = totalVerses > 0 
      ? Math.round(verseStats.reduce((sum, v) => sum + v.accuracy, 0) / totalVerses)
      : 0;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <BarChart className="mx-auto text-amber-400 mb-2" size={48} />
          <h2 className="text-2xl font-bold text-amber-400">Mastery List</h2>
          <p className="text-slate-300">Track your progress on each verse</p>
        </div>

        {/* Filter Buttons */}
        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-3">Filter by Level</h3>
          <div className="grid grid-cols-5 gap-2">
            {['All', 'Mastered', 'Proficient', 'Learning', 'Struggling'].map((filter) => (
              <button
                key={filter}
                onClick={() => setMasteryFilter(filter)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  masteryFilter === filter
                    ? filter === 'All' ? 'bg-amber-500 text-slate-900' :
                      filter === 'Mastered' ? 'bg-green-500 text-white' :
                      filter === 'Proficient' ? 'bg-amber-500 text-slate-900' :
                      filter === 'Struggling' ? 'bg-red-500 text-white' :
                      'bg-slate-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          {masteryFilter !== 'All' && (
            <p className="text-xs text-slate-400 mt-2">
              Showing {sortedStats.length} of {totalVerses} verses
            </p>
          )}
        </div>

        {/* Overall Statistics */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-2 border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Overall Progress</h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-bold">Overall Accuracy</span>
              <span className="text-amber-400 font-bold">{overallAccuracy}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-1000 ease-out"
                style={{
                  width: `${overallAccuracy}%`,
                  animation: 'slideIn 1s ease-out'
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{masteredCount}</div>
              <div className="text-xs text-green-300">Mastered</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-400">{proficientCount}</div>
              <div className="text-xs text-amber-300">Proficient</div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-300">{learningCount}</div>
              <div className="text-xs text-slate-400">Learning</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">{strugglingCount}</div>
              <div className="text-xs text-red-300">Struggling</div>
            </div>
          </div>
        </div>

        {/* Verse List */}
        {totalVerses === 0 ? (
          <div className="bg-slate-700/50 rounded-xl p-8 border border-slate-600 text-center">
            <div className="text-4xl mb-3">📖</div>
            <p className="text-slate-300">Complete some quizzes to see your verse mastery progress!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Your Verses</h3>
            {sortedStats.map((verse) => (
              <div 
                key={verse.reference}
                className={`${verse.bgColor} border border-slate-600 rounded-xl p-4`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{verse.reference}</div>
                    <div className={`text-sm font-semibold ${verse.masteryColor}`}>
                      {verse.masteryLevel}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Quiz Types: {verse.successfulQuizTypes}/4 mastered
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${verse.masteryColor}`}>
                      {verse.accuracy}%
                    </div>
                    <div className="text-xs text-slate-400">
                      {verse.correct}✓ / {verse.incorrect}✗
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      verse.masteryLevel === 'Mastered' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      verse.masteryLevel === 'Proficient' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                      verse.masteryLevel === 'Struggling' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      'bg-gradient-to-r from-slate-500 to-slate-600'
                    }`}
                    style={{ width: `${verse.accuracy}%` }}
                  />
                </div>

                {/* Quiz Type Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(verse.quizTypes || {}).map(([type, stats]) => {
                    const typeAccuracy = stats.correct + stats.incorrect > 0
                      ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
                      : 0;
                    return (
                      <div key={type} className="bg-slate-800/50 rounded px-2 py-1">
                        <div className="text-slate-400 truncate">
                          {type === 'fill-blank' ? '✏️ Fill' : 
                           type === 'multiple-choice' ? '📝 Choice' : 
                           '🔍 Recall'}
                        </div>
                        <div className="text-white font-bold">{typeAccuracy}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AnalyticsView = () => {
    const verseProgress = userData?.verseProgress || {};
    const entries = Object.entries(verseProgress);
    const totals = entries.reduce((acc, [, progress]) => {
      const correct = progress?.correctCount || 0;
      const incorrect = progress?.incorrectCount || 0;
      const attempts = correct + incorrect;
      const masteredVerse =
        attempts > 0 && correct >= 3 && correct / attempts >= 0.9 ? 1 : 0;
      acc.correct += correct;
      acc.incorrect += incorrect;
      acc.mastered += masteredVerse;
      if (attempts > 0) {
        acc.attemptedVerses += 1;
      }

      const quizTypes = progress?.quizTypes || {};
      Object.entries(acc.types).forEach(([type]) => {
        const stats = quizTypes[type] || {};
        acc.types[type] += (stats.correct || 0) + (stats.incorrect || 0);
      });

      return acc;
    }, {
      correct: 0,
      incorrect: 0,
      mastered: 0,
      attemptedVerses: 0,
      types: {
        'fill-blank': 0,
        'multiple-choice': 0,
        'reference-recall': 0
      }
    });

    const totalAttempts = totals.correct + totals.incorrect;
    const accuracy =
      totalAttempts > 0 ? Math.round((totals.correct / totalAttempts) * 100) : 0;
    const trackedVerses = entries.length;
    const masteryRate =
      trackedVerses > 0 ? Math.round((totals.mastered / trackedVerses) * 100) : 0;
    const topVerses = entries
      .map(([reference, progress]) => {
        const correct = progress?.correctCount || 0;
        const incorrect = progress?.incorrectCount || 0;
        const attempts = correct + incorrect;
        const accuracyRate =
          attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
        return {
          reference,
          accuracy: accuracyRate,
          attempts,
          lastReview: progress?.lastReview
        };
      })
      .filter((verse) => verse.attempts > 0)
      .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)
      .slice(0, 4);

    const trendData = entries
      .map(([reference, progress]) => {
        const correct = progress?.correctCount || 0;
        const incorrect = progress?.incorrectCount || 0;
        const attempts = correct + incorrect;
        return {
          reference,
          accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
          lastReview: progress?.lastReview
        };
      })
      .filter((verse) => verse.lastReview)
      .sort((a, b) => new Date(a.lastReview) - new Date(b.lastReview))
      .slice(-6);

    const overallRadius = 48;
    const circumference = 2 * Math.PI * overallRadius;
    const accuracyOffset = Math.max(0, circumference * (1 - accuracy / 100));
    const consistencyRatio = Math.min((userData.currentStreak || 0) / 30, 1);
    const consistencyOffset = circumference * (1 - consistencyRatio);
    const masteryOffset = circumference * (1 - masteryRate / 100);

    const linePoints = trendData.length > 1
      ? trendData
          .map((point, index) => {
            const x = (index / (trendData.length - 1)) * 100;
            const y = 100 - point.accuracy;
            return `${x},${y}`;
          })
          .join(' ')
      : '';

    return (
      <div className="space-y-6">
        <div className="text-center">
          <TrendingUp className="mx-auto text-amber-400 mb-2" size={48} />
          <h2 className="text-2xl font-bold text-amber-400">Analytics</h2>
          <p className="text-slate-300">See how your training compares across all quizzes.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase text-slate-400">Accuracy</p>
                <p className="text-3xl font-bold text-white">{accuracy}%</p>
              </div>
              <BarChart className="text-amber-400" size={32} />
            </div>
            <p className="text-slate-400 text-sm">
              {totalAttempts} attempts logged across {trackedVerses} tracked verse
              {trackedVerses === 1 ? '' : 's'}.
            </p>
            <p className="text-slate-400 text-sm">
              Mastery rate: {masteryRate}% ({totals.mastered} verses mastered)
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase text-slate-400">Quizzes Completed</p>
                <p className="text-3xl font-bold text-white">{userData.quizzesCompleted}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Points</p>
                <p className="text-2xl font-bold text-amber-400">{userData.totalPoints}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              {Object.entries(totals.types).map(([type, value]) => (
                <div key={type} className="flex items-center justify-between">
                  <span>
                    {type === 'fill-blank'
                      ? 'Fill in the Blank'
                      : type === 'multiple-choice'
                        ? 'Multiple Choice'
                        : 'Reference Recall'}
                  </span>
                  <span>{value} attempts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 text-center" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <svg className="mx-auto mb-3" width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={overallRadius}
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={overallRadius}
                stroke="url(#accuracyGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={accuracyOffset}
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{
                  transition: 'stroke-dashoffset 1.5s ease-out',
                  animation: 'drawCircle 1.5s ease-out'
                }}
              />
              <defs>
                <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-sm uppercase tracking-widest text-slate-400">Accuracy</div>
            <div className="text-3xl font-bold text-white" style={{ animation: 'countUp 0.8s ease-out 0.5s both' }}>{accuracy}%</div>
            <p className="text-slate-400 text-xs mt-1">
              {totalAttempts} attempts across {trackedVerses} verses
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 text-center" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
            <svg className="mx-auto mb-3" width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={overallRadius}
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={overallRadius}
                stroke="#34d399"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={consistencyOffset}
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{
                  transition: 'stroke-dashoffset 1.5s ease-out 0.3s',
                  animation: 'drawCircle 1.5s ease-out 0.3s'
                }}
              />
            </svg>
            <div className="text-sm uppercase tracking-widest text-slate-400">Consistency</div>
            <div className="text-3xl font-bold text-white" style={{ animation: 'countUp 0.8s ease-out 0.8s both' }}>{userData.currentStreak || 0}d</div>
            <p className="text-slate-400 text-xs mt-1">Based on 30-day streak goal</p>
          </div>
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 text-center" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
            <svg className="mx-auto mb-3" width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={overallRadius}
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={overallRadius}
                stroke="#a855f7"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={masteryOffset}
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{
                  transition: 'stroke-dashoffset 1.5s ease-out 0.6s',
                  animation: 'drawCircle 1.5s ease-out 0.6s'
                }}
              />
            </svg>
            <div className="text-sm uppercase tracking-widest text-slate-400">Mastery Rate</div>
            <div className="text-3xl font-bold text-white" style={{ animation: 'countUp 0.8s ease-out 1.1s both' }}>{masteryRate}%</div>
            <p className="text-slate-400 text-xs mt-1">{totals.mastered} mastered verses</p>
          </div>
        </div>

        <div className="bg-slate-700/40 border border-slate-600 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">Accuracy Trend</p>
              <p className="text-lg font-semibold text-white">Recent Practice</p>
            </div>
            <span className="text-xs text-slate-400">
              {trendData.length} checkpoints
            </span>
          </div>
          {trendData.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-40">
              {trendData.map((point, index) => {
                const maxAccuracy = Math.max(...trendData.map(p => p.accuracy), 1);
                const heightPercent = (point.accuracy / maxAccuracy) * 100;
                const colorClass =
                  point.accuracy >= 90 ? 'from-green-500 to-emerald-600' :
                  point.accuracy >= 70 ? 'from-amber-500 to-yellow-600' :
                  point.accuracy >= 50 ? 'from-orange-500 to-orange-600' :
                  'from-red-500 to-red-600';

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full flex items-end" style={{ height: '120px' }}>
                      <div
                        className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-500 relative group cursor-pointer`}
                        style={{
                          height: `${heightPercent}%`,
                          animation: `growBar 0.8s ease-out ${index * 0.1}s both`
                        }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {point.accuracy}%
                        </div>
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 truncate w-full text-center">
                      {point.reference.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-slate-400 text-sm">
                Not enough review history yet to show a trend.
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Top Verses</h3>
            <span className="text-slate-400 text-xs">{topVerses.length} tracked</span>
          </div>
          {topVerses.length === 0 ? (
            <p className="text-slate-300 text-sm">
              Complete some quizzes to surface which verses you master the most.
            </p>
          ) : (
            <div className="space-y-3">
              {topVerses.map((verse) => (
                <div
                  key={verse.reference}
                  className="bg-slate-800/60 rounded-lg p-3 border border-slate-700"
                >
                  <div className="font-semibold text-white">{verse.reference}</div>
                  <div className="flex flex-wrap justify-between text-xs text-slate-400">
                    <span>Accuracy {verse.accuracy}%</span>
                    <span>{verse.attempts} attempts</span>
                  </div>
                  {verse.lastReview && (
                    <div className="text-xs text-slate-500 mt-1">
                      Last reviewed {new Date(verse.lastReview).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const CalendarView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const displayedPlans = searchTerm
      ? bibleStudyPlans.filter(plan =>
          plan.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.theme.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : bibleStudyPlans;

    return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calendar className="mx-auto text-amber-400 mb-2" size={48} />
        <h2 className="text-2xl font-bold text-amber-400">Calendar & Plans</h2>
        <p className="text-slate-300">Track your progress, biblical dates, and study plans</p>
      </div>

      {/* Learning Plan and Streak Tracker */}
      <LearningPlan
        userData={userData}
        onUpdatePlan={(plans) => {
          // Handle plan updates
          console.log('Learning plans updated:', plans);
        }}
      />

      {/* Dual Calendar Display */}
      <DualCalendarDisplay
        showHebrewCalendar={true}
        onRomanDateClick={() => setShowActivityCalendar(true)}
        onHebrewDateClick={() => setShowHebrewCalendar(true)}
        className="space-y-3"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="flex items-center gap-2">
            {(() => {
              const currentStreak = userData.currentStreak || 0;

              return currentStreak > 0 ? (
                <>
                  <Flame className="text-orange-500" size={24} />
                  <span className="text-amber-400 text-3xl font-bold">{currentStreak}</span>
                </>
              ) : (
                <>
                  <span className="shivering-ice text-3xl">🧊</span>
                  <span className="text-cyan-400 text-3xl font-bold">0</span>
                </>
              );
            })()}
          </div>
          <div className="text-slate-300 text-sm">Day Streak</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="text-amber-400 text-3xl font-bold">{userData.quizzesCompleted}</div>
          <div className="text-slate-300 text-sm">Total Quizzes</div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-700/50">
        <h3 className="text-lg font-bold text-blue-300 mb-3">Hebrew Calendar</h3>
        <p className="text-slate-300 text-sm mb-3">
          Track biblical feast days and Hebrew dates alongside the Gregorian calendar.
        </p>
        <button
          onClick={() => setShowHebrewCalendar(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
        >
          View Hebrew Calendar
        </button>
      </div>

      <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-xl p-6 border border-amber-700/50">
        <h3 className="text-lg font-bold text-amber-300 mb-3">Activity Tracking</h3>
        <p className="text-slate-300 text-sm mb-3">
          See your quiz activity throughout the month and maintain your streak.
        </p>
        <button
          onClick={() => setShowActivityCalendar(true)}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
        >
          View Activity Calendar
        </button>
      </div>

      {/* Mini Bible Study Plans */}
      <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-6 border border-green-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-green-300 flex items-center gap-2">
            <BookOpen size={24} />
            Mini Bible Study Plans
          </h3>
          <span className="text-green-400 font-bold text-sm">{bibleStudyPlans.length} Plans</span>
        </div>
        <p className="text-slate-300 text-sm mb-4">
          Explore {bibleStudyPlans.length} topical mini Bible study plans with scripture readings, reflection questions, and prayers.
        </p>

        {/* Search and filter */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search topics (e.g., Faith, Prayer, Love...)"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-green-500 focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {displayedPlans.slice(0, 20).map(plan => {
            const planProgress = userData.studyPlanProgress?.[plan.id];
            const isCompleted = planProgress?.completed;
            const isInProgress = planProgress?.started && !planProgress?.completed;

            return (
              <button
                key={plan.id}
                onClick={() => {
                  setPlanVerseTexts([]);
                  setPlanVerseError('');
                  setPlanVerseLoading(true);
                  setSelectedPlan(plan);
                  setShowPlanDetail(true);

                  // Mark as started if not already
                  if (!planProgress?.started) {
                    setUserData(prev => ({
                      ...prev,
                      studyPlanProgress: {
                        ...prev.studyPlanProgress,
                        [plan.id]: {
                          started: Date.now(),
                          completed: null
                        }
                      }
                    }));
                  }
                }}
                className={`bg-slate-700/50 hover:bg-slate-600/50 border ${
                  isCompleted
                    ? 'border-emerald-500/50 hover:border-emerald-400'
                    : isInProgress
                    ? 'border-amber-500/50 hover:border-amber-400'
                    : 'border-green-600/30 hover:border-green-500'
                } rounded-lg p-3 text-left transition-all relative`}
              >
                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                  </div>
                )}
                {isInProgress && !isCompleted && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Clock size={14} className="text-amber-400" />
                  </div>
                )}
                <div className="text-green-400 font-bold text-sm mb-1 pr-6">{plan.topic}</div>
                <div className="text-slate-400 text-xs line-clamp-2">{plan.theme}</div>
                {isCompleted && (
                  <div className="mt-2 text-xs text-emerald-400 font-semibold">✓ Completed</div>
                )}
                {isInProgress && !isCompleted && (
                  <div className="mt-2 text-xs text-amber-400 font-semibold">⏱ In Progress</div>
                )}
              </button>
            );
          })}
        </div>

        {displayedPlans.length > 20 && (
          <div className="text-center text-slate-400 text-sm mt-3">
            +{displayedPlans.length - 20} more plans available
          </div>
        )}
      </div>
    </div>
    );
  };

  const SettingsView = () => {
    const soundSettings = userData.soundSettings || { enabled: true, volume: 0.5, musicEnabled: true, musicVolume: 0.3 };

    const updateSoundSettings = (updates) => {
      setUserData({
        ...userData,
        soundSettings: {
          ...soundSettings,
          ...updates
        }
      });
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-amber-400">Settings</h2>

        {/* Sound Settings */}
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🔊</span>
            Sound Settings
          </h3>

          {/* Enable Sound Effects */}
          <div className="mb-4">
            <label className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Sound Effects</span>
              <input
                type="checkbox"
                checked={soundSettings.enabled}
                onChange={(e) => updateSoundSettings({ enabled: e.target.checked })}
                className="w-6 h-6 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500"
              />
            </label>
            <p className="text-slate-400 text-xs">Play sounds for correct/incorrect answers</p>
          </div>

          {/* Sound Effects Volume */}
          {soundSettings.enabled && (
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">
                Sound Effects Volume: {Math.round(soundSettings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={soundSettings.volume * 100}
                onChange={(e) => updateSoundSettings({ volume: parseInt(e.target.value) / 100 })}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          )}

          {/* Enable Background Music */}
          <div className="mb-4">
            <label className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Background Music</span>
              <input
                type="checkbox"
                checked={soundSettings.musicEnabled}
                onChange={(e) => updateSoundSettings({ musicEnabled: e.target.checked })}
                className="w-6 h-6 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500"
              />
            </label>
            <p className="text-slate-400 text-xs">Play music during Sword Drill Ultimate</p>
          </div>

          {/* Background Music Volume */}
          {soundSettings.musicEnabled && (
            <div>
              <label className="block text-white font-semibold mb-2">
                Music Volume: {Math.round(soundSettings.musicVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={soundSettings.musicVolume * 100}
                onChange={(e) => updateSoundSettings({ musicVolume: parseInt(e.target.value) / 100 })}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <label className="block text-white font-bold mb-3">Bible Translation</label>
          <select
            value={userData.selectedTranslation}
            onChange={(e) => setUserData({...userData, selectedTranslation: e.target.value})}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
          >
            <option value="KJV">King James Version (KJV)</option>
            <option value="ASV">American Standard Version (ASV)</option>
            <option value="WEB">World English Bible (WEB)</option>
            <option value="ESV">English Standard Version (ESV)</option>
            <option value="NIV">New International Version (NIV)</option>
            <option value="NLT">New Living Translation (NLT)</option>
            <option value="YLT">Young's Literal Translation (YLT)</option>
          </select>
          <p className="text-slate-400 text-xs mt-2">All translations are stored locally - no internet connection required</p>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <label className="flex items-center justify-between">
            <span className="text-white font-bold">Include Apocrypha</span>
            <input
              type="checkbox"
              checked={userData.includeApocrypha}
              onChange={(e) => setUserData({...userData, includeApocrypha: e.target.checked})}
              className="w-6 h-6 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500"
            />
          </label>
          <p className="text-slate-400 text-sm mt-2">
            Include verses from the Apocrypha in your training
          </p>
        </div>

       <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
        <h3 className="text-white font-bold mb-2">About</h3>
        <p className="text-slate-400 text-sm">Sword Drill v1.0</p>
        <p className="text-slate-400 text-sm">Gamified Bible Memorization</p>
        <p className="text-slate-400 text-sm mt-2">Firebase & GitHub integration ready</p>
      </div>

      {/* Donation Section */}
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-2 border-amber-500/30 rounded-2xl p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">🙏🏾</div>
          <h3 className="text-2xl font-bold text-amber-400 mb-2">Support This Ministry</h3>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
          <p className="text-slate-200 text-sm leading-relaxed mb-4">
            ✨ <span className="font-bold text-amber-400">Fuel the Fire of the Word</span>
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Every gift given to Sword Drill carries eternal impact. Your donation helps place Bibles into the hands of those seeking the light of God, bring aid to those in need, and keep this app alive for every soul hungry to know His Word.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            When you give, you're not just supporting an app — you're helping to ignite faith, spread hope, and equip believers with the Sword of the Spirit across the world.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Together, we stand as torchbearers for the Kingdom — letting His Word cut through darkness and bring life to those who long for it. 🙏🏾⚔️
          </p>
        </div>

        <a
          href="https://www.paypal.com/paypalme/ychristdonations"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 text-center shadow-lg"
        >
          💝 Donate via PayPal
        </a>
        
        <p className="text-center text-slate-400 text-xs mt-3">
          ychristdonations@gmail.com
        </p>
      </div>

      {/* Made by YGamify */}
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm">Made by YGamify</p>
      </div>
    </div>
    );
  };

  const BonusQuizzesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-amber-400">Bonus Quizzes</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-5xl mb-3">🎁</div>
          <h3 className="text-xl font-bold text-pink-400 mb-2">Earn Extra Points!</h3>
          <p className="text-slate-300 text-sm">
            Challenge yourself with these special quizzes and earn bonus points toward your progression!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setCurrentView('spelling-bee')}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-4 rounded-xl border-2 border-indigo-400 hover:border-indigo-300 transition-all text-left disabled:opacity-50 shadow-lg"
        >
          <div className="font-bold text-lg">🐝 Biblical Spelling Bee</div>
          <div className="text-indigo-100 text-sm">Unscramble biblical words • Timed • Hints available</div>
        </button>
        <button
          onClick={() => setCurrentView('bible-trivia')}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-4 rounded-xl border-2 border-yellow-400 hover:border-yellow-300 transition-all text-left disabled:opacity-50 shadow-lg animate-pulse hover:animate-none"
        >
          <div className="font-bold text-lg flex items-center gap-2">
            <Trophy size={20} />
            Bible Trivia Challenge - BONUS POINTS!
          </div>
          <div className="text-yellow-50 text-sm font-semibold">750+ Questions • 3 Levels • Extra Points!</div>
        </button>
        <button
          onClick={() => setCurrentView('words-of-jesus')}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white p-4 rounded-xl border-2 border-purple-400 hover:border-purple-300 transition-all text-left disabled:opacity-50 shadow-lg"
        >
          <div className="font-bold text-lg flex items-center gap-2">
            ✝️ Words of Jesus or Not?
            <span className="text-purple-200 text-sm">⚡ FAST-PACED</span>
          </div>
          <div className="text-purple-100 text-sm">Time-based quiz • 30 seconds • Can you identify Jesus' words?</div>
        </button>
      </div>
    </div>
  );


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap');

          .sword-drill-title {
            font-family: 'Cinzel', serif;
            font-weight: 900;
            letter-spacing: 4px;
            text-transform: uppercase;
            position: relative;
            display: inline-block;
            background: linear-gradient(180deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.3)) drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.8));
          }

        `}</style>
        <div className="bg-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-500/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚔️</div>
            <div className="mb-2">
              <h1 className="text-5xl font-bold sword-drill-title">
                Sword Drill
              </h1>
            </div>
            <p className="text-amber-200">Gamified Bible Memorization</p>
          </div>
          
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
            />
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="w-full bg-slate-600 text-white font-bold py-3 rounded-lg hover:bg-slate-500 transition-all"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </form>

          {!isSignUp && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                  setResetSuccess(false);
                }}
                className="text-amber-400 hover:text-amber-300 text-sm underline transition-all"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            Demo mode: Any email/password will work
          </p>
          <p className="text-center text-slate-400 text-xs mt-2">
            Firebase authentication ready for production
          </p>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => !resetSuccess && setShowForgotPassword(false)}>
            <div className="bg-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-500/20" onClick={(e) => e.stopPropagation()}>
              {!resetSuccess ? (
                <>
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🔑</div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-2">Reset Password</h2>
                    <p className="text-slate-300 text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
                    />

                    {error && (
                      <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                        setError('');
                      }}
                      className="w-full bg-slate-600 text-white font-bold py-3 rounded-lg hover:bg-slate-500 transition-all"
                    >
                      Cancel
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-emerald-400 mb-3">Email Sent!</h2>
                    <p className="text-slate-300 mb-6">
                      We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetSuccess(false);
                        setError('');
                      }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show loading screen on initial load
  if (isInitialLoading) {
    return <LoadingScreen onComplete={() => setIsInitialLoading(false)} />;
  }

  // Prepare data for SharpAssistant
  const verseHistory = userData.quizHistory || [];
  const currentQuizStats = {
    correct: userData.quizzesCompleted || 0,
    total: userData.quizzesCompleted > 0 ? Math.ceil(userData.quizzesCompleted * 0.8) : 0,
    accuracy: 0,
  };
  const todaysQuizzesCount = 0; // TODO: Track this properly

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-0">
      <CorrectToast points={toastPoints} show={showCorrectToast} />
      <IncorrectToast show={showIncorrectToast} points={toastPoints} />
      <GenericToast show={showGenericToast} message={genericToastMessage} type={genericToastType} onClose={() => setShowGenericToast(false)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap');

        .sword-drill-title {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          letter-spacing: 4px;
          text-transform: uppercase;
          position: relative;
          display: inline-block;
          background: linear-gradient(180deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.3)) drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.8));
        }
      `}</style>

      <div className="bg-slate-900/80 backdrop-blur border-b border-amber-500/20 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold sword-drill-title">
                Sword Drill
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            {showMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20" onClick={() => setShowMenu(false)}>
          <div className="absolute left-0 top-0 h-full w-80 bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto shadow-2xl" style={{scrollbarWidth: 'thin', scrollbarColor: '#2d2d2d #0a0a0a'}} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700">
              <User className="text-amber-400" size={32} />
              <div>
                <div className="font-bold text-white">{userData.name}</div>
                <div className="text-sm text-slate-400">{userData.totalPoints} points</div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all flex items-center gap-3"
              >
                <Book size={20} /> Home
              </button>
              <button
                onClick={() => {
                  setCurrentView('practice-review');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-orange-600/20 hover:to-red-600/20 transition-all flex items-center gap-3"
              >
                <RefreshCw size={20} className="text-orange-400" /> Practice Review
              </button>
              <button
                onClick={() => {
                  setCurrentView('calendar');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all flex items-center gap-3"
              >
                <Calendar size={20} /> Calendar & Plans
              </button>
              <button
                onClick={() => {
                  setCurrentView('achievements');
                  setShowMenu(false);
                  setHasUnviewedAchievements(false);
                  localStorage.setItem('hasUnviewedAchievements', 'false');
                  localStorage.setItem('achievementsLastViewed', new Date().toISOString());
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all flex items-center gap-3 relative"
              >
                <Trophy size={20} /> Achievements
                {hasUnviewedAchievements && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                    NEW
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentView('analytics');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all flex items-center gap-3"
              >
                <TrendingUp size={20} /> Analytics
              </button>
              <button
                onClick={() => {
                  setCurrentView('mastery');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all flex items-center gap-3"
              >
                <BarChart size={20} /> Mastery List
              </button>
            </nav>

            {/* Learning & Study Section */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-3 px-4">Learning & Study</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('greek-course');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 transition-all flex items-center gap-3"
                >
                  <GraduationCap size={20} className="text-indigo-400" />
                  <div>
                    <div className="font-semibold">Κοινή Greek</div>
                    <div className="text-xs text-slate-400">Biblical Greek Course • 100pts per section</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('hebrew-course');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-orange-600/20 transition-all flex items-center gap-3"
                >
                  <GraduationCap size={20} className="text-amber-400" />
                  <div>
                    <div className="font-semibold">עברית עתיקה</div>
                    <div className="text-xs text-slate-400">Ancient Hebrew Course • 100pts per section</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('hermeneutics-course');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20 transition-all flex items-center gap-3"
                >
                  <Lightbulb size={20} className="text-teal-400" />
                  <div>
                    <div className="font-semibold">Hermeneutics</div>
                    <div className="text-xs text-slate-400">Biblical Interpretation • 100pts per section</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('church-history-course');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all flex items-center gap-3"
                >
                  <Book size={20} className="text-purple-400" />
                  <div>
                    <div className="font-semibold">Church History & Bible Culture</div>
                    <div className="text-xs text-slate-400">From Genesis to Early Church • 100pts per section</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('kings-of-israel-course');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-indigo-600/20 transition-all flex items-center gap-3"
                >
                  <Crown size={20} className="text-blue-400" />
                  <div>
                    <div className="font-semibold">Kings of Israel</div>
                    <div className="text-xs text-slate-400">Learn the chronology of Israel's kings • 100pts per section</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('textual-criticism-course');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 transition-all flex items-center gap-3"
                >
                  <Search size={20} className="text-indigo-400" />
                  <div>
                    <div className="font-semibold">Understanding Textual Criticism</div>
                    <div className="text-xs text-slate-400">Biblical manuscript analysis • 100pts per section</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Study Tools Section */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-3 px-4">Study Tools</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('biblical-bloodlines');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-orange-600/20 transition-all flex items-center gap-3"
                >
                  <Users size={20} className="text-amber-400" />
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Biblical Bloodlines
                      <span className="text-amber-400 text-xs">✨</span>
                    </div>
                    <div className="text-xs text-slate-400">Interactive Family Trees</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('greek-lexicon');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 transition-all flex items-center gap-3"
                >
                  <BookOpen size={20} className="text-indigo-400" />
                  <div>
                    <div className="font-semibold">Greek Lexicon</div>
                    <div className="text-xs text-slate-400">Strong's Greek Dictionary</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('hebrew-lexicon');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-orange-600/20 transition-all flex items-center gap-3"
                >
                  <BookOpen size={20} className="text-amber-400" />
                  <div>
                    <div className="font-semibold">Hebrew Lexicon</div>
                    <div className="text-xs text-slate-400">Strong's Hebrew Dictionary</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Unlockables Section */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-3 px-4">Unlockables</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    if (userData.totalPoints >= 5000 || userData.unlockables?.lxx) {
                      // Unlock LXX
                      setUserData(prev => ({
                        ...prev,
                        unlockables: { ...prev.unlockables, lxx: true }
                      }));
                      setCurrentView('unlockable-lxx');
                      setShowMenu(false);
                    } else {
                      showToast(`🔒 Septuagint (LXX)\n\nUnlock with 5,000 points\n\nCurrent: ${userData.totalPoints.toLocaleString()} pts\nNeeded: ${(5000 - userData.totalPoints).toLocaleString()} more pts`, 'warning');
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    userData.totalPoints >= 5000 || userData.unlockables?.lxx
                      ? 'text-slate-200 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-teal-600/20'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {userData.totalPoints >= 5000 || userData.unlockables?.lxx ? (
                    <Unlock size={20} className="text-emerald-400" />
                  ) : (
                    <Lock size={20} className="text-slate-600" />
                  )}
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Septuagint (LXX)
                      {!(userData.totalPoints >= 5000 || userData.unlockables?.lxx) && (
                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">5,000 pts</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">Greek Old Testament</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (userData.totalPoints >= 7500 || userData.unlockables?.masoretic) {
                      // Unlock Masoretic
                      setUserData(prev => ({
                        ...prev,
                        unlockables: { ...prev.unlockables, masoretic: true }
                      }));
                      setCurrentView('unlockable-masoretic');
                      setShowMenu(false);
                    } else {
                      showToast(`🔒 Masoretic Text (WLC)\n\nUnlock with 7,500 points\n\nCurrent: ${userData.totalPoints.toLocaleString()} pts\nNeeded: ${(7500 - userData.totalPoints).toLocaleString()} more pts`, 'warning');
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    userData.totalPoints >= 7500 || userData.unlockables?.masoretic
                      ? 'text-slate-200 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-orange-600/20'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {userData.totalPoints >= 7500 || userData.unlockables?.masoretic ? (
                    <Unlock size={20} className="text-amber-400" />
                  ) : (
                    <Lock size={20} className="text-slate-600" />
                  )}
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Masoretic Text (WLC)
                      {!(userData.totalPoints >= 7500 || userData.unlockables?.masoretic) && (
                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">7,500 pts</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">Hebrew Old Testament</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (userData.totalPoints >= 10000 || userData.unlockables?.sinaiticus) {
                      // Unlock Sinaiticus
                      setUserData(prev => ({
                        ...prev,
                        unlockables: { ...prev.unlockables, sinaiticus: true }
                      }));
                      setCurrentView('unlockable-sinaiticus');
                      setShowMenu(false);
                    } else {
                      showToast(`🔒 Codex Sinaiticus\n\nUnlock with 10,000 points\n\nCurrent: ${userData.totalPoints.toLocaleString()} pts\nNeeded: ${(10000 - userData.totalPoints).toLocaleString()} more pts`, 'warning');
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    userData.totalPoints >= 10000 || userData.unlockables?.sinaiticus
                      ? 'text-slate-200 hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-purple-600/20'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {userData.totalPoints >= 10000 || userData.unlockables?.sinaiticus ? (
                    <Unlock size={20} className="text-violet-400" />
                  ) : (
                    <Lock size={20} className="text-slate-600" />
                  )}
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Codex Sinaiticus
                      {!(userData.totalPoints >= 10000 || userData.unlockables?.sinaiticus) && (
                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">10,000 pts</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">Ancient Greek Bible</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    // Check if all Elite achievements are unlocked
                    const eliteAchievements = ACHIEVEMENT_CONDITIONS.elite;
                    const eliteKeys = Object.keys(eliteAchievements);
                    const allEliteUnlocked = eliteKeys.every(key =>
                      userData.achievements && userData.achievements.includes(eliteAchievements[key].name)
                    );

                    if (allEliteUnlocked) {
                      setCurrentView('unlockable-eli-challenge');
                      setShowMenu(false);
                    } else {
                      const unlockedCount = eliteKeys.filter(key =>
                        userData.achievements && userData.achievements.includes(eliteAchievements[key].name)
                      ).length;
                      showToast(`🔒 Eli Challenge\n\nThe Ultimate Test of Biblical Mastery\n\nUnlock by completing ALL Elite achievements\n\nProgress: ${unlockedCount}/${eliteKeys.length} Elite achievements`, 'warning');
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    (() => {
                      const eliteAchievements = ACHIEVEMENT_CONDITIONS.elite;
                      const eliteKeys = Object.keys(eliteAchievements);
                      const allEliteUnlocked = eliteKeys.every(key =>
                        userData.achievements && userData.achievements.includes(eliteAchievements[key].name)
                      );
                      return allEliteUnlocked
                        ? 'text-slate-200 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-yellow-600/20'
                        : 'text-slate-600 cursor-not-allowed opacity-50';
                    })()
                  }`}
                >
                  {(() => {
                    const eliteAchievements = ACHIEVEMENT_CONDITIONS.elite;
                    const eliteKeys = Object.keys(eliteAchievements);
                    const allEliteUnlocked = eliteKeys.every(key =>
                      userData.achievements && userData.achievements.includes(eliteAchievements[key].name)
                    );
                    return allEliteUnlocked ? (
                      <Unlock size={20} className="text-amber-400" />
                    ) : (
                      <Lock size={20} className="text-slate-600" />
                    );
                  })()}
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Eli Challenge
                      {!(() => {
                        const eliteAchievements = ACHIEVEMENT_CONDITIONS.elite;
                        const eliteKeys = Object.keys(eliteAchievements);
                        return eliteKeys.every(key =>
                          userData.achievements && userData.achievements.includes(eliteAchievements[key].name)
                        );
                      })() && (
                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">All Elite</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">Ultimate Biblical Mastery</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quizzes & Activities Section */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-3 px-4">Quizzes & Activities</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('spiritual-gifts-exam');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-rose-600/20 transition-all flex items-center gap-3"
                >
                  <Heart size={20} className="text-pink-400" />
                  <div>
                    <div className="font-semibold">Spiritual Gifts Exam</div>
                    <div className="text-xs text-slate-400">Discover your spiritual gifts</div>
                  </div>
                </button>
              </div>
            </div>

            {/* System Section */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all flex items-center gap-3"
                >
                  <Settings size={20} /> Settings
                </button>
                <button
                  onClick={() => {
                    setCurrentView('tutorial');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-3"
                >
                  <HelpCircle size={20} /> Tutorial & Help
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <button
                onClick={() => handleSignOut()}
                className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-rose-600/20 transition-all flex items-center gap-3"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'quiz' && quizState?.type === 'verse-scramble' && (
          <VerseScrambleQuiz
            key={`verse-scramble-${quizState.verse.reference}`}
            verse={quizState.verse}
            scramble={quizState.scrambledWords}
            onComplete={handleVerseScrambleComplete}
            onSkip={handleVerseScrambleSkip}
          />
        )}
        {currentView === 'quiz' && quizState?.type !== 'verse-scramble' && <QuizView />}
        {currentView === 'achievements' && <AchievementsView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'mastery' && <MasteryView />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'tutorial' && <TutorialHelp onBack={() => setCurrentView('home')} />}
        {currentView === 'bonus-quizzes' && <BonusQuizzesView />}
        {currentView === 'spelling-bee' && (
          <BiblicalSpellingBee
            onComplete={(results) => {
              // Calculate points for Spelling Bee
              const pointsEarned = results.score;

              // Update user data
              setUserData(prev => ({
                ...prev,
                totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                quizzesCompleted: prev.quizzesCompleted + 1
              }));

              // Save quiz results
              addQuizResult({
                type: 'spelling-bee',
                score: results.score,
                questionsAnswered: results.questionsAnswered,
                bestStreak: results.bestStreak,
                hintsUsed: results.hintsUsed,
                points: pointsEarned,
                timestamp: new Date().toISOString()
              });

              showToast(`🐝 Spelling Bee Complete!\n\nScore: ${results.score}\n+${pointsEarned} points\n\n💰 New Balance: ${userData.totalPoints + pointsEarned} points`, 'success');
              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'words-of-jesus' && (
          <WordsOfJesus
            onComplete={(results) => {
              // Calculate points for Words of Jesus quiz
              const pointsEarned = results.score;

              // Update user data
              setUserData(prev => ({
                ...prev,
                totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                quizzesCompleted: prev.quizzesCompleted + 1,
                wordsOfJesusCompleted: (prev.wordsOfJesusCompleted || 0) + 1,
                wordsOfJesusCorrect: (prev.wordsOfJesusCorrect || 0) + results.correctAnswers
              }));

              // Save quiz results
              addQuizResult({
                type: 'words-of-jesus',
                score: results.score,
                correctAnswers: results.correctAnswers,
                totalQuestions: results.totalQuestions,
                accuracy: results.accuracy,
                timeUsed: results.timeUsed,
                points: pointsEarned,
                timestamp: new Date().toISOString()
              });

              showToast(`✝️ Words of Jesus Quiz Complete!\n\nScore: ${results.score} points\nAccuracy: ${results.accuracy}%\n\n💰 New Balance: ${userData.totalPoints + pointsEarned} points`, 'success');
              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'book-order-quiz' && (
          <BookOrderQuiz
            onComplete={(results) => {
              // Calculate points for Book Order quiz
              const userLevel = userData.currentLevel || 'Beginner';
              const levelMultiplier = POINT_SYSTEM.DIFFICULTY_MULTIPLIERS[userLevel]?.multiplier || 1.0;
              const rawPoints = results.pointsEarned ?? results.score ?? 0;
              const pointsEarned = Math.max(0, Math.floor(rawPoints * levelMultiplier));

              // Update user data
              setUserData(prev => ({
                ...prev,
                totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                quizzesCompleted: prev.quizzesCompleted + 1
              }));

              // Save quiz results
              if (results.score > 0) {
                addQuizResult({
                  type: 'book-order',
                  score: results.score,
                  questionsAnswered: results.questionsAnswered,
                  bestStreak: results.bestStreak,
                  points: pointsEarned,
                  timestamp: new Date().toISOString()
                });
              }

              showToast(`📚 Book Order Quiz Complete!\n\nScore: ${results.score} pts\n+${pointsEarned} points\n\n💰 New Balance: ${userData.totalPoints + pointsEarned} points`, 'success');
              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'sword-drill-ultimate' && (
          <SwordDrillUltimate
            userLevel={userData.currentLevel || 'Beginner'}
            verseProgress={userData.verseProgress || {}}
            getLocalVerseByReference={getLocalVerseByReference}
            onComplete={(results) => {
              // Fade out background music
              fadeOutMusic();

              // Calculate points for Sword Drill Ultimate
              const userLevel = userData.currentLevel || 'Beginner';
              const basePoints = POINT_SYSTEM.BASE_QUIZ_POINTS['sword-drill-ultimate'] || 50;
              const levelMultiplier = POINT_SYSTEM.DIFFICULTY_MULTIPLIERS[userLevel]?.multiplier || 1.0;
              const pointsEarned = Math.floor(basePoints * levelMultiplier * (results.score / 100));

              // Update user data
              setUserData(prev => ({
                ...prev,
                totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                quizzesCompleted: prev.quizzesCompleted + 1
              }));

              // Save quiz results
              if (results.score > 0) {
                addQuizResult({
                  type: 'sword-drill-ultimate',
                  score: results.score,
                  grade: results.grade,
                  details: results.details,
                  points: pointsEarned,
                  timestamp: new Date().toISOString()
                });
              }

              showToast(`⚔️ Sword Drill Ultimate Complete!\n\nGrade: ${results.grade}\nScore: ${results.score}%\n+${pointsEarned} points\n\n💰 New Balance: ${userData.totalPoints + pointsEarned} points`, 'success');
              setCurrentView('home');
            }}
            onCancel={() => {
              // Fade out background music on cancel
              fadeOutMusic();
              setCurrentView('home');
            }}
          />
        )}
        {currentView === 'verse-detective' && verseDetectiveData && (
          <EnhancedReviewMultipleChoice
            verse={verseDetectiveData.verse.text}
            reference={verseDetectiveData.verse.reference}
            correctReference={verseDetectiveData.verse.reference}
            wrongReferences={verseDetectiveData.wrongReferences}
            isPersonalVerse={verseDetectiveData.isPersonalVerse}
            onComplete={(results) => {
              const isPersonal = verseDetectiveData.isPersonalVerse;
              const canEarn = verseDetectiveData.canEarnPoints;
              let pointsEarned = results.pointsEarned || 0;

              // Cap points for personal verses
              if (isPersonal) {
                if (canEarn && results.success) {
                  // Personal verses award max 5 points
                  pointsEarned = Math.min(5, Math.max(0, pointsEarned));
                } else if (!canEarn && results.success) {
                  // Over daily limit - no points
                  pointsEarned = 0;
                } else if (!results.success) {
                  // Wrong answer penalty capped at -10 for personal verses
                  pointsEarned = -10;
                }

                // Update daily completion count
                const today = new Date().toISOString().split('T')[0];
                const updatedCompletions = { ...(userData.personalVerseDetectiveCompletions || {}) };
                updatedCompletions[today] = (updatedCompletions[today] || 0) + 1;

                setUserData(prev => ({
                  ...prev,
                  totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                  quizzesCompleted: prev.quizzesCompleted + 1,
                  personalVerseDetectiveCompletions: updatedCompletions,
                  verseDetectiveCompleted: (prev.verseDetectiveCompleted || 0) + 1,
                  verseDetectiveCorrect: (prev.verseDetectiveCorrect || 0) + (results.success ? 1 : 0)
                }));
              } else {
                // Regular verse detective
                setUserData(prev => ({
                  ...prev,
                  totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                  quizzesCompleted: prev.quizzesCompleted + 1,
                  verseDetectiveCompleted: (prev.verseDetectiveCompleted || 0) + 1,
                  verseDetectiveCorrect: (prev.verseDetectiveCorrect || 0) + (results.success ? 1 : 0)
                }));
              }

              // Save quiz results
              if (results.success || pointsEarned !== 0) {
                addQuizResult({
                  type: isPersonal ? 'personal-verse-detective' : 'verse-detective',
                  reference: results.reference,
                  success: results.success,
                  points: pointsEarned,
                  completionTime: results.completionTime,
                  hintsUsed: results.hintsUsed,
                  timestamp: new Date().toISOString()
                });
              }

              // Show completion message
              let message = `🔍 ${isPersonal ? 'Personal' : ''} Verse Detective Complete!\n\n${results.success ? '✅ Case Solved!' : '❌ Incorrect'}`;
              if (pointsEarned !== 0) {
                message += `\n${pointsEarned > 0 ? '+' : ''}${pointsEarned} points`;
              } else if (isPersonal && !canEarn && results.success) {
                message += `\n📊 Daily limit reached (3/3)\nNo points awarded, but great practice!`;
              }
              message += `\n\n💰 New Balance: ${Math.max(0, userData.totalPoints + pointsEarned)} points`;

              if (isPersonal && canEarn && results.success) {
                const completionsAfter = (verseDetectiveData.completionsToday || 0) + 1;
                message += `\n\n📈 Personal Verse Detective: ${completionsAfter}/3 today`;
              }

              showToast(message, 'success');
              setVerseDetectiveData(null);
              setCurrentView('home');
            }}
            onSkip={() => {
              setVerseDetectiveData(null);
              setCurrentView('home');
            }}
            userPoints={userData.totalPoints}
            isPaidMode={true}
            completionHistory={[]}
            onPurchaseHint={(cost) => {
              setUserData(prev => ({
                ...prev,
                totalPoints: Math.max(0, prev.totalPoints - cost)
              }));
            }}
          />
        )}
        {currentView === 'greek-course' && (
          <KoineGreekCourse
            onComplete={(results) => {
              console.log('Greek course results:', results);

              // Award points for course completion
              let pointsEarned = 0;
              if (results.type === 'lesson') {
                pointsEarned = awardBonusPoints('courseLesson');
                showToast(`🎓 Lesson Complete!\n\n+${pointsEarned} points earned!\n\nGreat work on completing this lesson!`, 'success');

                // Track lesson completion
                recordQuizAttempt({
                  verseReference: results.lessonTitle || 'Greek Lesson',
                  type: 'greek-lesson',
                  correct: true,
                  points: pointsEarned
                });
              } else if (results.type === 'level') {
                pointsEarned = awardBonusPoints('courseLevel');
                showToast(`🏆 Level Complete!\n\n+${pointsEarned} points earned!\n\nYou've mastered this level!`, 'success');

                // Track level completion
                recordQuizAttempt({
                  verseReference: results.levelTitle || 'Greek Level',
                  type: 'greek-level',
                  correct: true,
                  points: pointsEarned
                });
              } else if (results.type === 'course') {
                pointsEarned = awardBonusPoints('courseComplete');
                showToast(`🎉 Course Complete!\n\n+${pointsEarned} points earned!\n\nCongratulations on completing the Greek course!`, 'success');

                // Track course completion
                recordQuizAttempt({
                  verseReference: 'Greek Course',
                  type: 'greek-course',
                  correct: true,
                  points: pointsEarned
                });
              }

              setUserData(prev => ({
                ...prev,
                totalPoints: prev.totalPoints + pointsEarned
              }));

              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'hebrew-course' && (
          <AncientHebrewCourse
            onComplete={(results) => {
              console.log('Hebrew course results:', results);

              // Award points for course completion
              let pointsEarned = 0;
              if (results.type === 'lesson') {
                pointsEarned = awardBonusPoints('courseLesson');
                showToast(`🎓 Lesson Complete!\n\n+${pointsEarned} points earned!\n\nGreat work on completing this lesson!`, 'success');

                // Track lesson completion
                recordQuizAttempt({
                  verseReference: results.lessonTitle || 'Hebrew Lesson',
                  type: 'hebrew-lesson',
                  correct: true,
                  points: pointsEarned
                });
              } else if (results.type === 'level') {
                pointsEarned = awardBonusPoints('courseLevel');
                showToast(`🏆 Level Complete!\n\n+${pointsEarned} points earned!\n\nYou've mastered this level!`, 'success');

                // Track level completion
                recordQuizAttempt({
                  verseReference: results.levelTitle || 'Hebrew Level',
                  type: 'hebrew-level',
                  correct: true,
                  points: pointsEarned
                });
              } else if (results.type === 'course') {
                pointsEarned = awardBonusPoints('courseComplete');
                showToast(`🎉 Course Complete!\n\n+${pointsEarned} points earned!\n\nCongratulations on completing the Hebrew course!`, 'success');

                // Track course completion
                recordQuizAttempt({
                  verseReference: 'Hebrew Course',
                  type: 'hebrew-course',
                  correct: true,
                  points: pointsEarned
                });
              }

              setUserData(prev => ({
                ...prev,
                totalPoints: prev.totalPoints + pointsEarned
              }));

              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'hermeneutics-course' && (
          <HermeneuticsCourse
            onComplete={(results) => {
              console.log('Hermeneutics course results:', results);

              // Award points for course completion
              if (results.type === 'lesson') {
                // Use the new one-time reward system for lessons
                const result = awardCourseSectionPoints(
                  userData,
                  setUserData,
                  'hermeneutics',
                  `${results.level}-${results.lessonId}`,
                  results.lessonTitle
                );
                showToast(result.message, 'success');
              } else if (results.type === 'course-level') {
                const pointsEarned = awardBonusPoints('courseLevel');
                showToast(`🏆 Level Complete!\n\n+${pointsEarned} points earned!\n\nYou've mastered this level!`, 'success');
                setUserData(prev => ({
                  ...prev,
                  totalPoints: prev.totalPoints + pointsEarned
                }));
              } else if (results.type === 'course') {
                const pointsEarned = awardBonusPoints('courseComplete');
                showToast(`🎉 Course Complete!\n\n+${pointsEarned} points earned!\n\nCongratulations on completing the Hermeneutics course!`, 'success');
                setUserData(prev => ({
                  ...prev,
                  totalPoints: prev.totalPoints + pointsEarned
                }));
              }

              // Don't navigate away, stay in the course
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'kings-of-israel-course' && (
          <KingsOfIsraelCourse
            onComplete={(results) => {
              console.log('Kings of Israel course results:', results);

              // Award points for completing kings
              let pointsEarned = 0;
              if (results.type === 'level') {
                pointsEarned = awardBonusPoints('courseLevel');
                const levelName = results.level.charAt(0).toUpperCase() + results.level.slice(1);
                showToast(`👑 ${levelName} Level Complete!\n\n+${pointsEarned} points earned!\n\nYou've learned about ${results.kings} kings of Israel!`, 'success');
              }

              setUserData(prev => ({
                ...prev,
                totalPoints: prev.totalPoints + pointsEarned,
                quizzesCompleted: prev.quizzesCompleted + 1
              }));

              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'church-history-course' && (
          <ChurchHistoryCourse
            onComplete={(results) => {
              console.log('Church History course results:', results);

              // Award points for course completion
              let pointsEarned = 0;
              if (results.type === 'lesson') {
                pointsEarned = awardBonusPoints('courseLesson');
                showToast(`🎓 Lesson Complete!\n\n+${pointsEarned} points earned!\n\nGreat work on completing this lesson!`, 'success');
              } else if (results.type === 'level') {
                pointsEarned = awardBonusPoints('courseLevel');
                showToast(`🏆 Level Complete!\n\n+${pointsEarned} points earned!\n\nYou've mastered this level!`, 'success');
              } else if (results.type === 'course') {
                pointsEarned = awardBonusPoints('courseComplete');
                showToast(`🎉 Course Complete!\n\n+${pointsEarned} points earned!\n\nCongratulations on completing the Church History & Bible Culture course!`, 'success');
              }

              setUserData(prev => ({
                ...prev,
                totalPoints: prev.totalPoints + pointsEarned
              }));

              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'textual-criticism-course' && (
          <TextualCriticismCourse
            onComplete={(results) => {
              console.log('Textual Criticism course results:', results);

              // Award points for course completion
              let pointsEarned = 0;
              if (results.type === 'module') {
                pointsEarned = awardBonusPoints('courseLesson');
                showToast(`🎓 Module Complete!\n\n+${pointsEarned} points earned!\n\nGreat work on completing this module!`, 'success');
              } else if (results.type === 'course') {
                pointsEarned = awardBonusPoints('courseComplete');
                showToast(`🎉 Course Complete!\n\n+${pointsEarned} points earned!\n\nCongratulations on completing the Textual Criticism course!`, 'success');
              }

              setUserData(prev => ({
                ...prev,
                totalPoints: prev.totalPoints + pointsEarned
              }));

              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'practice-review' && (
          <PracticeReview
            onClose={() => setCurrentView('home')}
            userData={userData}
          />
        )}
        {currentView === 'spiritual-gifts-exam' && (
          <SpiritualGiftsExam
            onBack={() => setCurrentView('home')}
          />
        )}
        {currentView === 'bible-trivia' && (
          <BibleTrivia
            userLevel={userData.currentLevel}
            onComplete={(results) => {
              console.log('Bible Trivia results:', results);

              // Calculate bonus points for trivia
              const baseBonusPerCorrect = POINT_SYSTEM.BONUSES.bonusTrivia;
              const difficultyMultiplier = results.bonusMultiplier; // 1.0, 1.5, or 2.0

              // Base points: correct answers * base bonus * difficulty
              let pointsEarned = Math.floor(results.score * baseBonusPerCorrect * difficultyMultiplier);

              // Perfect score bonus: +50% if all correct
              if (results.isPerfect) {
                const perfectBonus = Math.floor(pointsEarned * 0.5);
                pointsEarned += perfectBonus;
              }

              // Streak bonus: +5 points per max streak
              const streakBonus = results.maxStreak * 5;
              pointsEarned += streakBonus;

              // Speed bonus: +10 points per fast answer (answered in under 5 seconds)
              const speedBonus = results.fastAnswers * 10;
              pointsEarned += speedBonus;

              // Update user data
              setUserData(prev => ({
                ...prev,
                totalPoints: Math.max(0, prev.totalPoints + pointsEarned),
                quizzesCompleted: prev.quizzesCompleted + 1
              }));

              // Save quiz results
              if (results.score > 0) {
                addQuizResult({
                  type: 'bible-trivia',
                  difficulty: results.difficulty,
                  score: results.score,
                  total: results.total,
                  percentage: results.percentage,
                  maxStreak: results.maxStreak,
                  fastAnswers: results.fastAnswers,
                  points: pointsEarned,
                  timestamp: new Date().toISOString()
                });

                // Track in calendar
                recordQuizAttempt({
                  verseReference: 'Bible Trivia',
                  type: 'trivia',
                  correct: results.score > 0,
                  points: pointsEarned
                });
              }

              // Create detailed results message
              let message = `🏆 Bible Trivia Complete!\n\n`;
              message += `📊 Results:\n`;
              message += `  Difficulty: ${results.difficulty.charAt(0).toUpperCase() + results.difficulty.slice(1)}\n`;
              message += `  Score: ${results.score}/${results.total} (${results.percentage}%)\n`;
              message += `  Best Streak: ${results.maxStreak}\n`;
              message += `  Fast Answers: ${results.fastAnswers}\n\n`;

              message += `💰 Bonus Points Breakdown:\n`;
              message += `  Base (${results.score} × ${baseBonusPerCorrect} × ${difficultyMultiplier}x): ${Math.floor(results.score * baseBonusPerCorrect * difficultyMultiplier)} pts\n`;

              if (results.isPerfect) {
                message += `  🎯 Perfect Score Bonus: +${Math.floor(results.score * baseBonusPerCorrect * difficultyMultiplier * 0.5)} pts\n`;
              }
              if (streakBonus > 0) {
                message += `  🔥 Streak Bonus: +${streakBonus} pts\n`;
              }
              if (speedBonus > 0) {
                message += `  ⚡ Speed Bonus: +${speedBonus} pts\n`;
              }

              message += `\n💎 Total Bonus: +${pointsEarned} points`;
              message += `\n🏆 New Balance: ${userData.totalPoints + pointsEarned} points`;

              showToast(message, 'success');
              setCurrentView('home');
            }}
          />
        )}
        {currentView === 'biblical-bloodlines' && (
          <BiblicalBloodlines
            onClose={() => setCurrentView('home')}
          />
        )}
        {currentView === 'unlockable-lxx' && (
          <UnlockableLXX onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'unlockable-masoretic' && (
          <UnlockableMasoretic onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'unlockable-sinaiticus' && (
          <UnlockableSinaiticus onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'unlockable-eli-challenge' && (
          <UnlockableEliChallenge
            onBack={() => setCurrentView('home')}
            onStartChallenge={() => {
              setQuizState({
                mode: 'eli-challenge',
                currentVerseIndex: 0,
                score: 0,
                consecutiveCorrect: 0,
                selectedAnswers: []
              });
              setCurrentView('quiz');
            }}
            isUnlocked={(() => {
              // Check if all Elite achievements are unlocked
              const eliteAchievements = ACHIEVEMENT_CONDITIONS.elite;
              const eliteKeys = Object.keys(eliteAchievements);
              const allEliteUnlocked = eliteKeys.every(key =>
                userData.achievements && userData.achievements.includes(eliteAchievements[key].name)
              );
              return allEliteUnlocked;
            })()}
          />
        )}
        {currentView === 'personal-verse-bank' && (
          <PersonalVerseBank
            onBack={() => setCurrentView('home')}
            userData={userData}
            onUpdateUserData={setUserData}
            onStartPersonalQuiz={() => {
              // Show quiz selection modal for personal verses
              setShowPersonalQuizModal(true);
            }}
          />
        )}
        {currentView === 'greek-lexicon' && (
          <GreekLexicon onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'hebrew-lexicon' && (
          <HebrewLexicon onBack={() => setCurrentView('home')} />
        )}
      </div>

      {/* Calendar Modals */}
      {showHebrewCalendar && (
        <HebrewCalendarModal onClose={() => setShowHebrewCalendar(false)} />
      )}
      {showActivityCalendar && (
        <ActivityCalendarModal
          onClose={() => setShowActivityCalendar(false)}
          userData={userData}
        />
      )}

      {/* Bible Study Plan Detail Modal */}
      {showPlanDetail && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPlanDetail(false)}>
          <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-800 pb-4 border-b border-slate-700 z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="text-green-400" size={32} />
                <h2 className="text-2xl font-bold text-green-400">{selectedPlan.topic}</h2>
              </div>
              <button onClick={() => setShowPlanDetail(false)} className="text-white hover:text-green-400 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme & Overview */}
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-700/50">
                <h3 className="text-green-300 font-bold mb-2">Theme</h3>
                <p className="text-slate-300 text-sm">{selectedPlan.theme}</p>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h3 className="text-amber-400 font-bold mb-2">Overview</h3>
                <p className="text-slate-300 text-sm">{selectedPlan.overview}</p>
              </div>

              {/* Scriptures */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  <Scroll size={20} />
                  Scripture Readings
                </h3>
                <div className="space-y-3">
                  {planVerseLoading ? (
                    <p className="text-slate-300 text-sm">Loading verses for this plan...</p>
                  ) : planVerseError ? (
                    <p className="text-rose-300 text-sm">{planVerseError}</p>
                  ) : planVerseTexts.length > 0 ? (
                    planVerseTexts.map((verse, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-blue-300 font-semibold">
                            {(verse.reference || '').replace(/^AUTO[^A-Za-z0-9]*\s*/i, '')}
                          </div>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">{verse.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-300 text-sm">No scriptures listed for this plan.</p>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                  <Lightbulb size={20} />
                  Reflection Questions
                </h3>
                <ul className="space-y-2">
                  {selectedPlan.questions.map((question, index) => (
                    <li key={index} className="text-slate-300 text-sm flex gap-2">
                      <span className="text-purple-400 font-bold">{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reflection */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-700/50">
                <h3 className="text-purple-300 font-bold mb-2">Daily Reflection</h3>
                <p className="text-slate-300 text-sm italic">{selectedPlan.reflection}</p>
              </div>

              {/* Prayer */}
              <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-xl p-4 border border-amber-700/50">
                <h3 className="text-amber-300 font-bold mb-2">Prayer</h3>
                <p className="text-slate-300 text-sm italic">{selectedPlan.prayer}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!userData.studyPlanProgress?.[selectedPlan.id]?.completed && (
                  <button
                    onClick={() => {
                      const updatedProgress = {
                        ...userData.studyPlanProgress,
                        [selectedPlan.id]: {
                          started: userData.studyPlanProgress?.[selectedPlan.id]?.started || Date.now(),
                          completed: Date.now()
                        }
                      };

                      setUserData(prev => ({
                        ...prev,
                        studyPlanProgress: updatedProgress
                      }));

                      // Save to database
                      if (userData && userData.uid) {
                        addQuizResult(userData.uid, {
                          studyPlanProgress: updatedProgress,
                          verseId: 'study-plan',
                          verseReference: `Study Plan: ${selectedPlan.topic}`,
                          type: 'study-plan-complete',
                          correct: true,
                          timestamp: new Date().toISOString(),
                          points: 0,
                          quizzesCompleted: userData.quizzesCompleted,
                          totalPoints: userData.totalPoints
                        });
                      }

                      showToast('✅ Bible study plan marked as complete!', 'success');
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Mark as Complete
                  </button>
                )}
                {userData.studyPlanProgress?.[selectedPlan.id]?.completed && (
                  <button
                    onClick={() => {
                      const updatedProgress = {
                        ...userData.studyPlanProgress,
                        [selectedPlan.id]: {
                          ...userData.studyPlanProgress[selectedPlan.id],
                          completed: null
                        }
                      };

                      setUserData(prev => ({
                        ...prev,
                        studyPlanProgress: updatedProgress
                      }));

                      // Save to database
                      if (userData && userData.uid) {
                        addQuizResult(userData.uid, {
                          studyPlanProgress: updatedProgress,
                          verseId: 'study-plan',
                          verseReference: `Study Plan: ${selectedPlan.topic}`,
                          type: 'study-plan-incomplete',
                          correct: false,
                          timestamp: new Date().toISOString(),
                          points: 0,
                          quizzesCompleted: userData.quizzesCompleted,
                          totalPoints: userData.totalPoints
                        });
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={20} />
                    Mark as Incomplete
                  </button>
                )}
                <button
                  onClick={() => setShowPlanDetail(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bible Reader Modal */}
      {showBibleReader && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setShowBibleReader(false); setPendingReference(null); }}>
          <div className="bg-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-800 pb-4 border-b border-slate-700 z-10">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📖</div>
                <h2 className="text-2xl font-bold text-amber-400">Bible Reader</h2>
              </div>
              <button onClick={() => { setShowBibleReader(false); setPendingReference(null); }} className="text-white hover:text-amber-400 transition-all">
                <X size={24} />
              </button>
            </div>
            <BibleReader
              selectedTranslation={userData.selectedTranslation}
              initialReference={pendingReference}
              userData={userData}
              onUpdateUserData={setUserData}
            />
          </div>
        </div>
      )}

      {/* Personal Quiz Selection Modal */}
      {showPersonalQuizModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPersonalQuizModal(false)}>
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">📘</span>
                  Personal Verse Quiz
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Choose a quiz type to practice with your {(userData.personalMemoryVerses || []).length} personal memory verses
                </p>
              </div>
              <button onClick={() => setShowPersonalQuizModal(false)} className="text-white hover:text-cyan-400 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPersonalQuizModal(false);
                  startQuiz('fill-blank', true);
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white p-4 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 transition-all text-left disabled:opacity-50"
              >
                <div className="font-bold text-lg">Fill in the Blank</div>
                <div className="text-cyan-100 text-sm">Complete missing words from your personal verses</div>
              </button>

              <button
                onClick={() => {
                  setShowPersonalQuizModal(false);
                  startQuiz('multiple-choice', true);
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white p-4 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 transition-all text-left disabled:opacity-50"
              >
                <div className="font-bold text-lg">Multiple Choice</div>
                <div className="text-cyan-100 text-sm">Identify the correct reference for your verses</div>
              </button>

              <button
                onClick={() => {
                  setShowPersonalQuizModal(false);
                  startQuiz('reference-recall', true);
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white p-4 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 transition-all text-left disabled:opacity-50"
              >
                <div className="font-bold text-lg">Reference Recall</div>
                <div className="text-cyan-100 text-sm">Name the verse reference from memory</div>
              </button>

              <button
                onClick={() => {
                  setShowPersonalQuizModal(false);
                  startQuiz('verse-scramble', true);
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white p-4 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 transition-all text-left disabled:opacity-50"
              >
                <div className="font-bold text-lg">Verse Scramble</div>
                <div className="text-cyan-100 text-sm">Unscramble the words to rebuild your verses</div>
              </button>

              <button
                onClick={() => {
                  setShowPersonalQuizModal(false);
                  startPersonalVerseDetective();
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-4 rounded-xl border-2 border-emerald-500 hover:border-emerald-400 transition-all text-left disabled:opacity-50"
              >
                <div className="font-bold text-lg">🔍 Verse Detective</div>
                <div className="text-emerald-100 text-sm">Solve clues to identify your verses • 5 points • -10 penalty • Limited to 3 completions per day</div>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Achievement Unlock Notification */}
      {showAchievementUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="achievement-unlock-notification bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-8 border-4 border-amber-300 shadow-2xl max-w-md animate-achievement-unlock pointer-events-auto">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">{showAchievementUnlock.icon}</div>
              <div className="text-2xl font-bold text-slate-900 mb-2">Achievement Unlocked!</div>
              <div className="text-xl font-semibold text-slate-800">{showAchievementUnlock.name}</div>
              <div className="mt-4 text-sm text-slate-700">
                {showAchievementUnlock.type === 'quiz_count' && `Complete ${showAchievementUnlock.value} quizzes`}
                {showAchievementUnlock.type === 'streak' && `Reach a ${showAchievementUnlock.value} day streak`}
                {showAchievementUnlock.type === 'verse_mastered' && `Master ${showAchievementUnlock.value} verses`}
                {showAchievementUnlock.type === 'points' && `Earn ${showAchievementUnlock.value} points`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Review Modal for Failed Fill-in-Blank Quizzes */}
      {showEnhancedReview && failedQuizData && (
        <EnhancedReviewModal
          verse={failedQuizData.verse}
          reference={failedQuizData.reference}
          onComplete={handleEnhancedReviewComplete}
          onSkip={handleEnhancedReviewSkip}
          userPoints={userData.totalPoints}
          isCommonVerse={false}
          isPaidMode={true}
          completionHistory={[]}
          onPurchaseHint={(cost) => {
            setUserData(prev => ({
              ...prev,
              totalPoints: Math.max(0, prev.totalPoints - cost)
            }));
          }}
        />
      )}

      {/* Memory Tip Modal */}
      {showMemoryTip && memoryTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl max-w-lg w-full animate-fade-in">
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-purple-200 mb-4">Memory Tip</h3>
              <p className="text-white text-lg leading-relaxed mb-2">
                {typeof memoryTip === 'string' ? memoryTip : memoryTip.tip}
              </p>
              {typeof memoryTip === 'object' && memoryTip.example && (
                <p className="text-purple-300 text-sm italic mt-4">Example: {memoryTip.example}</p>
              )}
              <button
                onClick={() => {
                  setShowMemoryTip(false);
                  setCurrentView('home');
                  setQuizState(null);
                }}
                className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* S.H.A.R.P. Assistant - Bottom Right Corner */}
      <SharpAssistant
        userData={userData}
        currentQuizStats={currentQuizStats}
        verseHistory={verseHistory}
        todaysQuizzesCount={todaysQuizzesCount}
        userId={currentUser?.uid}
        onOpenAnalytics={() => {}}
        reloadCounter={0}
      />
    </div>
  );
};

export default SwordDrillApp;
