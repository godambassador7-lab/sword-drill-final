import { signUp, signIn, signOut, onAuthChange } from './services/authService';
import { getUserData, addQuizResult } from './services/dbService';
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Book,
  Target,
  Award,
  Calendar,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Flame,
  BarChart,
  TrendingUp
} from 'lucide-react';
import ACHIEVEMENT_NAME_BANK from './data/sword_drill_achievements/achievements.json';
import AnalyticsModal from './services/Analyticsmodal';
import VerseScrambleQuiz from './components/VerseScrambleQuiz';
// Firebase Integration Note:
// In production, you'll need to:
// 1. Install: npm install firebase
// 2. Import Firebase services from './services/firebase'
// 3. Import auth functions from './services/authService'
// 4. Import db functions from './services/dbService'
// For now, this is a demo version with simulated Firebase calls

// Sample verse database (In production, this would be 2000 verses from Firebase)
const VERSE_DATABASE = [
  { id: 1, reference: "John 3:16", text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.", translation: "NKJV", category: "canonical", topic: "salvation" },
  { id: 2, reference: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", translation: "NKJV", category: "canonical", topic: "strength" },
  { id: 3, reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", translation: "NKJV", category: "canonical", topic: "comfort" },
  { id: 4, reference: "Romans 8:28", text: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.", translation: "NKJV", category: "canonical", topic: "hope" },
  { id: 5, reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.", translation: "NKJV", category: "canonical", topic: "guidance" },
];

const ACHIEVEMENT_TIERS = {
  Beginner: { display: 'Beginner', icon: '🌱', tagline: 'Establish the rhythm', reqBase: 1, reqStep: 1 },
  Intermediate: { display: 'Intermediate', icon: '🌿', tagline: 'Increase the intensity', reqBase: 20, reqStep: 2 },
  Advanced: { display: 'Advanced', icon: '🔥', tagline: 'Sharpen your focus', reqBase: 60, reqStep: 4 },
  Elite: { display: 'Elite', icon: '💎', tagline: 'Lead the ranks', reqBase: 140, reqStep: 8 }
};

const parseAchievementEntry = (raw, fallbackName) => {
  if (!raw) return { name: fallbackName, icon: '⭐' };
  const match = raw.match(/^(.*\S)\s+(\S+)$/u);
  if (match) {
    return { name: match[1], icon: match[2] };
  }
  return { name: raw, icon: '⭐' };
};

const ACHIEVEMENTS = Object.fromEntries(
  Object.entries(ACHIEVEMENT_TIERS).map(([tier, meta]) => {
    const tierNames = ACHIEVEMENT_NAME_BANK[tier.toLowerCase()] || [];
    return [
      tier,
      Array.from({ length: 50 }, (_, index) => {
        const raw = tierNames[index] || `${meta.display} Marker ${index + 1}`;
        const { name, icon } = parseAchievementEntry(raw, `${meta.display} Marker ${index + 1}`);
        return {
          id: `${tier[0].toUpperCase()}${index + 1}`,
          name,
          desc: `${meta.tagline} • ${raw}`,
          icon,
          req: meta.reqBase + index * meta.reqStep
        };
      })
    ];
  })
);

const QUIZ_POINTS = {
  'fill-blank': 15,
  'multiple-choice': 5,
  'reference-recall': 10,
  'verse-scramble': 20,
};

const SwordDrillApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  const [userData, setUserData] = useState({
    name: 'Guest',
    versesMemorized: 0,
    quizzesCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
    achievements: [],
    selectedTranslation: 'NKJV',
    includeApocrypha: false,
    verseProgress: {}, // NEW: Track progress for each verse
  });

  
  const [quizState, setQuizState] = useState(null);
  const [verseOfDay, setVerseOfDay] = useState(null);

useEffect(() => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const verseIndex = dayOfYear % VERSE_DATABASE.length;
  setVerseOfDay(VERSE_DATABASE[verseIndex]);
  
  // Firebase auth listener
  const unsubscribe = onAuthChange(async (user) => {
    if (user) {
      setCurrentUser(user);
      const result = await getUserData(user.uid);
      if (result.success && result.user && result.progress) {
        setUserData({
          name: result.user.name || 'User',
          versesMemorized: (result.progress.versesMemorized || []).length,
          quizzesCompleted: result.progress.quizzesCompleted || 0,
          currentStreak: result.progress.currentStreak || 0,
          totalPoints: result.progress.totalPoints || 0,
          achievements: Array.isArray(result.progress.achievements) ? result.progress.achievements : [],
          selectedTranslation: result.user.selectedTranslation || 'NKJV',
          includeApocrypha: result.user.includeApocrypha || false,
          verseProgress: result.progress.verseProgress || {}
        });
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  });
  
  return () => unsubscribe();
}, []);

const handleSignIn = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  const result = await signIn(email, password);
  if (result.success) {
    const data = await getUserData(result.user.uid);
    if (data.success && data.user && data.progress) {
      setUserData({
        name: data.user.name || 'User',
        versesMemorized: (data.progress.versesMemorized || []).length,
        quizzesCompleted: data.progress.quizzesCompleted || 0,
        currentStreak: data.progress.currentStreak || 0,
        totalPoints: data.progress.totalPoints || 0,
        achievements: Array.isArray(data.progress.achievements) ? data.progress.achievements : [],
        selectedTranslation: data.user.selectedTranslation || 'NKJV',
        includeApocrypha: data.user.includeApocrypha || false,
        verseProgress: data.progress.verseProgress || {}
      });
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
      selectedTranslation: 'NKJV',
      includeApocrypha: false,
      verseProgress: {}
    });
    setIsLoggedIn(true);
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
  const startQuiz = async (type) => {
  setLoading(true);
  
  try {
    let verse = null;
    let attempts = 0;
    const maxAttempts = 10; // Try up to 10 verses to find one that needs review
    
    // Keep trying to get a verse that needs review
    while (attempts < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * VERSE_DATABASE.length);
      verse = VERSE_DATABASE[randomIndex];
      
      // Check if this verse should be reviewed
      if (verse && shouldReviewVerse(verse.reference, userData.verseProgress)) {
        break; // Found a verse that needs review
      }
      
      attempts++;
      
      // If we've tried enough times, just use the last verse we got
      if (attempts >= maxAttempts && verse) {
        console.log('Using verse even though it was recently reviewed');
        break;
      }
    }
    
    // Final fallback: if still no verse, get one from local database
    if (!verse) {
      const randomIndex = Math.floor(Math.random() * VERSE_DATABASE.length);
      verse = VERSE_DATABASE[randomIndex];
    }
    
    const words = verse.text.split(' ');
    
    if (type === 'fill-blank') {
      const blankIndex = Math.floor(Math.random() * words.length);
      const blankWord = words[blankIndex];
      words[blankIndex] = '______';
      setQuizState({
        type: 'fill-blank',
        verse: { ...verse, text: verse.text },
        question: words.join(' '),
        answer: blankWord,
        userAnswer: '',
      });
    } else if (type === 'multiple-choice') {
      const correctAnswer = verse.reference;
      const wrongAnswers = ['John 1:1', 'Genesis 1:1', 'Psalm 119:105'].filter(r => r !== correctAnswer);
      const allAnswers = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);
      setQuizState({
        type: 'multiple-choice',
        verse: { ...verse, text: verse.text },
        question: verse.text,
        correctAnswer,
        options: allAnswers,
        userAnswer: null,
      });
    } else if (type === 'reference-recall') {
      setQuizState({
        type: 'reference-recall',
        verse: { ...verse, text: verse.text },
        question: verse.text,
        answer: verse.reference,
        userAnswer: '',
      });
    } else if (type === 'verse-scramble') {
      setQuizState({
        type: 'verse-scramble',
        verse: { ...verse, text: verse.text },
        question: verse.text,
        answer: verse.text,
        userAnswer: '',
      });
    }
    
    setCurrentView('quiz');
  } catch (error) {
    console.error('Error loading verse:', error);
    alert('Error loading verse. Please try again.');
  }
  
  setLoading(false);
};


    

const submitQuiz = async (isCorrectOverride) => {
  let isCorrect = isCorrectOverride;
  if (isCorrect === undefined) {
    if (quizState.type === 'fill-blank' || quizState.type === 'reference-recall') {
      isCorrect = quizState.userAnswer.toLowerCase().trim() === quizState.answer.toLowerCase().trim();
    } else {
      isCorrect = quizState.userAnswer === quizState.correctAnswer;
    }
  }

  const points = isCorrect ? (QUIZ_POINTS[quizState.type] || 0) : 0;
  const newQuizzesCompleted = userData.quizzesCompleted + 1;
  const newTotalPoints = userData.totalPoints + points;
  
  // Update verse progress with spaced repetition
  const verseId = quizState.verse.reference;
  const currentProgress = userData.verseProgress[verseId] || {
    correctCount: 0,
    incorrectCount: 0,
    lastReview: null,
    nextReview: null,
    quizTypes: {}
  };
  
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
  
  currentProgress.lastReview = Date.now();
  currentProgress.nextReview = calculateNextReview(
    currentProgress.correctCount,
    currentProgress.incorrectCount
  );
  
  const newVerseProgress = {
    ...userData.verseProgress,
    [verseId]: currentProgress
  };
  
  // Check for new achievements
    const previousAchievements = Array.isArray(userData.achievements) ? userData.achievements : [];
    const newAchievements = [...previousAchievements];
  
  if (newQuizzesCompleted >= 1 && !newAchievements.includes('a1')) {
    newAchievements.push('a1');
  }
  
  if (userData.versesMemorized >= 10 && !newAchievements.includes('a3')) {
    newAchievements.push('a3');
  }
  
  if (newQuizzesCompleted >= 100 && !newAchievements.includes('k2')) {
    newAchievements.push('k2');
  }

  const newQuizData = {
    quizzesCompleted: newQuizzesCompleted,
    totalPoints: newTotalPoints,
    achievements: newAchievements,
    verseProgress: newVerseProgress
  };

  // Save to Firebase
  if (currentUser) {
    await addQuizResult(currentUser.uid, {
      verseId: quizState.verse.id,
      verseReference: verseId,
      type: quizState.type,
      correct: isCorrect,
      timestamp: new Date(),
      points: points,
      ...newQuizData
    });
  }

  if (isCorrect) {
    setUserData(prev => ({
      ...prev,
      ...newQuizData
    }));
    
    // Show progress message
    const progress = currentProgress.quizTypes[quizState.type];
    if (progress.correct >= 3 && progress.incorrect === 0) {
      alert(`✅ Correct! +${points} points\n🎯 Mastered this verse! You won't see it again for a while.`);
    } else {
      alert(`✅ Correct! +${points} points`);
    }
  } else {
    setUserData(prev => ({
      ...prev,
      verseProgress: newVerseProgress
    }));
    alert(`❌ Incorrect. The answer was: ${quizState.answer || quizState.correctAnswer}\n📝 You'll review this verse again soon.`);
  }
  setCurrentView('home');
  setQuizState(null);
};



  const HomeView = () => (
    <div className="space-y-6">
      {verseOfDay && (
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-2 border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-amber-400" size={24} />
            <h2 className="text-xl font-bold text-amber-400">Verse of the Day</h2>
          </div>
          <p className="text-white text-lg mb-3 leading-relaxed">{verseOfDay.text}</p>
          <p className="text-amber-300 font-semibold">— {verseOfDay.reference}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="text-amber-400 text-3xl font-bold">{userData.versesMemorized}</div>
          <div className="text-slate-300 text-sm">Verses Memorized</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <span className="text-orange-400 text-3xl font-bold">{userData.currentStreak}</span>
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

      <div>
        <h3 className="text-xl font-bold text-amber-400 mb-4">Start Training</h3>
        <div className="space-y-3">
          <button
  onClick={() => startQuiz('fill-blank')}
  disabled={loading}
  className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl border border-slate-600 hover:border-amber-500 transition-all text-left disabled:opacity-50"
>
  <div className="font-bold text-lg">Fill in the Blank</div>
  <div className="text-slate-300 text-sm">Complete verses with missing words</div>
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
        </div>
      </div>
    </div>
  );

  const QuizView = () => {
    if (!quizState) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-amber-500/30">
          <div className="text-amber-400 font-bold mb-4">
            {quizState.type === 'fill-blank' && 'Fill in the Blank'}
            {quizState.type === 'multiple-choice' && 'Multiple Choice'}
            {quizState.type === 'reference-recall' && 'Reference Recall'}
            {quizState.type === 'verse-scramble' && 'Verse Scramble'}
          </div>
          
          <div className="text-white text-lg mb-6 leading-relaxed">
            {quizState.question}
          </div>

          {quizState.type === 'verse-scramble' ? (
            <VerseScrambleQuiz
              verse={quizState.verse}
              onComplete={(result) => {
                setQuizState({ ...quizState, userAnswer: result.userAnswer });
                submitQuiz(result.isCorrect);
              }}
            />
          ) : (
            <>
              {quizState.type === 'fill-blank' && (
                <input
                  type="text"
                  value={quizState.userAnswer}
                  onChange={(e) => setQuizState({ ...quizState, userAnswer: e.target.value })}
                  placeholder="Type the missing word..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
                />
              )}

              {quizState.type === 'reference-recall' && (
                <input
                  type="text"
                  value={quizState.userAnswer}
                  onChange={(e) => setQuizState({ ...quizState, userAnswer: e.target.value })}
                  placeholder="Type the reference (e.g., John 3:16)..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
                />
              )}

              {quizState.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {quizState.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizState({ ...quizState, userAnswer: option })}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        quizState.userAnswer === option
                          ? 'bg-amber-500 border-amber-400 text-slate-900 font-bold'
                          : 'bg-slate-700 border-slate-600 text-white hover:border-amber-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {quizState.type !== 'verse-scramble' && (
          <>
            <button
              onClick={submitQuiz}
              disabled={!quizState.userAnswer}
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
          </>
        )}
      </div>
    );
  };

  const AchievementsView = () => {
    const unlockedAchievements = Array.isArray(userData.achievements) ? userData.achievements : [];
    return (
      <div className="space-y-6">
      <div className="text-center mb-6">
        <Trophy className="mx-auto text-amber-400 mb-2" size={48} />
        <h2 className="text-2xl font-bold text-amber-400">Achievements</h2>
        <p className="text-slate-300">Unlock every scroll to become a Sword Drill legend</p>
      </div>

      {Object.entries(ACHIEVEMENTS).map(([level, achievements]) => {
        const tierMeta = ACHIEVEMENT_TIERS[level] || { display: level, tagline: '' };
        return (
          <div key={level} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
            <h3 className="text-lg font-bold text-amber-400 mb-1">{tierMeta.display}</h3>
            {tierMeta.tagline && <p className="text-xs text-slate-400 mb-3">{tierMeta.tagline}</p>}
            <div className="grid grid-cols-1 gap-3">
              {achievements.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`rounded-lg p-3 border ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-500'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{ach.icon}</div>
                      <div className="flex-1">
                        <div className={`font-bold ${isUnlocked ? 'text-amber-400' : 'text-white'}`}>
                          {ach.name}
                        </div>
                        <div className="text-sm text-slate-400">{ach.desc}</div>
                      </div>
                      <div className={`text-2xl ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                        {isUnlocked ? '✓' : '...'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

  const MasteryView = () => {
    // Calculate mastery statistics
    const progressData = userData?.verseProgress || {};
    const verseStats = Object.entries(progressData).map(([reference, progress]) => {
      const correctCount = progress.correctCount || 0;
      const incorrectCount = progress.incorrectCount || 0;
      const totalAttempts = correctCount + incorrectCount;
      const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;
      
      // Determine mastery level
      let masteryLevel = 'Learning';
      let masteryColor = 'text-slate-400';
      let bgColor = 'bg-slate-700/50';
      
      if (accuracy >= 90 && progress.correctCount >= 5) {
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
        quizTypes: progress.quizTypes
      };
    });
    
    // Sort by accuracy (struggling first, then learning, then proficient, then mastered)
    const sortedStats = verseStats.sort((a, b) => a.accuracy - b.accuracy);
    
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
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500"
                style={{ width: `${overallAccuracy}%` }}
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
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 text-center">
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
              />
              <defs>
                <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-sm uppercase tracking-widest text-slate-400">Accuracy</div>
            <div className="text-3xl font-bold text-white">{accuracy}%</div>
            <p className="text-slate-400 text-xs mt-1">
              {totalAttempts} attempts across {trackedVerses} verses
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 text-center">
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
              />
            </svg>
            <div className="text-sm uppercase tracking-widest text-slate-400">Consistency</div>
            <div className="text-3xl font-bold text-white">{userData.currentStreak || 0}d</div>
            <p className="text-slate-400 text-xs mt-1">Based on 30-day streak goal</p>
          </div>
          <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-5 text-center">
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
              />
            </svg>
            <div className="text-sm uppercase tracking-widest text-slate-400">Mastery Rate</div>
            <div className="text-3xl font-bold text-white">{masteryRate}%</div>
            <p className="text-slate-400 text-xs mt-1">{totals.mastered} mastered verses</p>
          </div>
        </div>

        <div className="bg-slate-700/40 border border-slate-600 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">Accuracy Trend</p>
              <p className="text-lg font-semibold text-white">Recent Practice</p>
            </div>
            <span className="text-xs text-slate-400">
              {trendData.length} checkpoints
            </span>
          </div>
          {linePoints ? (
            <svg viewBox="0 0 100 100" className="w-full h-32">
              <polyline
                fill="none"
                stroke="url(#trendGradient)"
                strokeWidth="2.5"
                points={linePoints}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                points={linePoints}
              />
            </svg>
          ) : (
            <p className="text-slate-400 text-sm">
              Not enough review history yet to show a trend.
            </p>
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

  const SettingsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-400">Settings</h2>
      
      <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
        <label className="block text-white font-bold mb-3">Translation</label>
        <select
          value={userData.selectedTranslation}
          onChange={(e) => setUserData({...userData, selectedTranslation: e.target.value})}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
        >
          <option value="KJV">King James Version (KJV)</option>
          <option value="NKJV">New King James Version (NKJV)</option>
          <option value="NIV">New International Version (NIV)</option>
          <option value="ESV">English Standard Version (ESV)</option>
          <option value="NASB">New American Standard Bible (NASB)</option>
        </select>
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
    </div>
  );


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .sword-drill-title {
            font-family: 'Great Vibes', cursive;
            letter-spacing: 2px;
          }
        `}</style>
        <div className="bg-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-500/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚔️</div>
            <h1 className="text-5xl font-bold text-amber-400 mb-2 sword-drill-title">Sword Drill</h1>
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
          
          <p className="text-center text-slate-400 text-sm mt-6">
            Demo mode: Any email/password will work
          </p>
          <p className="text-center text-slate-400 text-xs mt-2">
            Firebase authentication ready for production
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        .sword-drill-title {
          font-family: 'Great Vibes', cursive;
          letter-spacing: 2px;
        }
      `}</style>
      
      <div className="bg-slate-900/80 backdrop-blur border-b border-amber-500/20 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚔️</div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400 sword-drill-title">Sword Drill</h1>
              <p className="text-xs text-amber-200">Level: Apprentice</p>
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
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-slate-800 border-l border-amber-500/20 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-8">
              <User className="text-amber-400" size={32} />
              <div>
                <div className="font-bold text-white">{userData.name}</div>
                <div className="text-sm text-slate-400">{userData.totalPoints} points</div>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-3"
              >
                <Book size={20} /> Home
              </button>
              <button
                onClick={() => {
                  setCurrentView('achievements');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-3"
              >
                <Trophy size={20} /> Achievements
              </button>
              <button
                onClick={() => {
                  setCurrentView('analytics');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-3"
              >
                <TrendingUp size={20} /> Analytics
              </button>
              <button
                onClick={() => {
                  setCurrentView('mastery');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-3"
              >
                <BarChart size={20} /> Mastery List
              </button>
              <button
                onClick={() => {
                  setCurrentView('settings');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-3"
              >
                <Settings size={20} /> Settings
              </button>
              <button
                onClick={() => handleSignOut()}
                className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-slate-700 transition-all flex items-center gap-3"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'quiz' && <QuizView />}
        {currentView === 'achievements' && <AchievementsView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'mastery' && <MasteryView />}
        {currentView === 'settings' && <SettingsView />}
      </div>
    </div>
  );
};

export default SwordDrillApp;
