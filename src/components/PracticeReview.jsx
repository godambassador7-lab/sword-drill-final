/**
 * Practice Review Component
 *
 * Allows users to practice missed verses and quizzes without affecting their points
 * - Review incorrectly answered verses
 * - Practice weak areas
 * - No point penalties or rewards
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Target,
  TrendingDown,
  Filter,
  Play,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  Award,
  TrendingUp
} from 'lucide-react';
import VerseScrambleQuiz from './VerseScrambleQuiz';
import BookOrderQuiz from './BookOrderQuiz';
import SwordDrillUltimate from './SwordDrillUltimate';
import BiblicalSpellingBee from './BiblicalSpellingBee';
import SimpleFillBlank from './SimpleFillBlank';
import EnhancedReviewMultipleChoice from './EnhancedReviewMultipleChoice';
import { getLocalVerseByReference } from '../services/localBibleProvider';

const PracticeReview = ({ onClose, userData, showToast, onUpdateUserData }) => {
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, verse-scramble, book-order, sword-drill
  const [practiceMode, setPracticeMode] = useState(null);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [currentVerseText, setCurrentVerseText] = useState('');
  const [showQuizTypeMenu, setShowQuizTypeMenu] = useState(null); // Track which verse's menu is open
  const [showProgressModal, setShowProgressModal] = useState(null); // Track which verse's progress modal is open
  const [lastQuizType, setLastQuizType] = useState(null); // Track last quiz type to prevent repeats
  const [practiceResult, setPracticeResult] = useState(null); // Track if practice was correct

  // Define practice quiz types that count toward mastery
  const MASTERY_QUIZ_TYPES = ['book-order', 'verse-scramble', 'fill-blank'];
  const REQUIRED_CONSECUTIVE_PERFECTS = 2;

  // Abbreviate book names for compact display
  const abbreviateReference = (reference) => {
    const bookAbbreviations = {
      'Genesis': 'Gen', 'Exodus': 'Exod', 'Leviticus': 'Lev', 'Numbers': 'Num', 'Deuteronomy': 'Deut',
      'Joshua': 'Josh', 'Judges': 'Judg', 'Ruth': 'Ruth', '1 Samuel': '1 Sam', '2 Samuel': '2 Sam',
      '1 Kings': '1 Kgs', '2 Kings': '2 Kgs', '1 Chronicles': '1 Chr', '2 Chronicles': '2 Chr',
      'Ezra': 'Ezra', 'Nehemiah': 'Neh', 'Esther': 'Esth', 'Job': 'Job', 'Psalm': 'Ps', 'Psalms': 'Ps',
      'Proverbs': 'Prov', 'Ecclesiastes': 'Eccl', 'Song of Solomon': 'Song', 'Isaiah': 'Isa',
      'Jeremiah': 'Jer', 'Lamentations': 'Lam', 'Ezekiel': 'Ezek', 'Daniel': 'Dan', 'Hosea': 'Hos',
      'Joel': 'Joel', 'Amos': 'Amos', 'Obadiah': 'Obad', 'Jonah': 'Jonah', 'Micah': 'Mic',
      'Nahum': 'Nah', 'Habakkuk': 'Hab', 'Zephaniah': 'Zeph', 'Haggai': 'Hag', 'Zechariah': 'Zech',
      'Malachi': 'Mal', 'Matthew': 'Matt', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John',
      'Acts': 'Acts', 'Romans': 'Rom', '1 Corinthians': '1 Cor', '2 Corinthians': '2 Cor',
      'Galatians': 'Gal', 'Ephesians': 'Eph', 'Philippians': 'Phil', 'Colossians': 'Col',
      '1 Thessalonians': '1 Thess', '2 Thessalonians': '2 Thess', '1 Timothy': '1 Tim',
      '2 Timothy': '2 Tim', 'Titus': 'Titus', 'Philemon': 'Phlm', 'Hebrews': 'Heb',
      'James': 'Jas', '1 Peter': '1 Pet', '2 Peter': '2 Pet', '1 John': '1 John',
      '2 John': '2 John', '3 John': '3 John', 'Jude': 'Jude', 'Revelation': 'Rev'
    };

    for (const [full, abbr] of Object.entries(bookAbbreviations)) {
      if (reference.startsWith(full)) {
        return reference.replace(full, abbr);
      }
    }
    return reference;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showQuizTypeMenu) {
        setShowQuizTypeMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showQuizTypeMenu]);

  // Check if a verse is mastered (all mastery quiz types have 2 consecutive perfects)
  const isVerseMastered = (progress) => {
    if (!progress || !progress.practiceMastery) return false;

    // Check if all mastery quiz types have reached required consecutive perfects
    return MASTERY_QUIZ_TYPES.every(quizType => {
      const mastery = progress.practiceMastery[quizType];
      return mastery && mastery.consecutivePerfects >= REQUIRED_CONSECUTIVE_PERFECTS;
    });
  };

  // Get missed verses from user data
  const missedVerses = useMemo(() => {
    if (!userData || !userData.verseProgress) return [];

    const verses = [];
    Object.entries(userData.verseProgress).forEach(([reference, progress]) => {
      // Skip mastered verses
      if (isVerseMastered(progress)) return;

      if (progress.incorrectCount > 0) {
        // Calculate struggle score (higher = needs more practice)
        const totalAttempts = progress.correctCount + progress.incorrectCount;
        const accuracy = totalAttempts > 0 ? (progress.correctCount / totalAttempts) * 100 : 0;
        const struggleScore = progress.incorrectCount * 10 - accuracy;

        verses.push({
          reference,
          correctCount: progress.correctCount,
          incorrectCount: progress.incorrectCount,
          accuracy: Math.round(accuracy),
          struggleScore,
          lastReview: progress.lastReview || 0,
          quizTypes: progress.quizTypes || {},
          practiceMastery: progress.practiceMastery || {}
        });
      }
    });

    // Sort by most recent (lastReview timestamp, highest first)
    return verses.sort((a, b) => b.lastReview - a.lastReview);
  }, [userData]);

  // Filter by quiz type
  const filteredVerses = useMemo(() => {
    if (selectedFilter === 'all') return missedVerses;

    return missedVerses.filter(verse => {
      const types = verse.quizTypes || {};
      return types[selectedFilter] && types[selectedFilter].incorrectCount > 0;
    });
  }, [missedVerses, selectedFilter]);

  // Extract book name from reference
  const getBookFromReference = (reference) => {
    // Match book name (including books with numbers like "1 John")
    const match = reference.match(/^(\d\s)?([A-Za-z\s]+)/);
    return match ? match[0].trim() : '';
  };

  // Start practice session
  const startPractice = async (verse, quizType) => {
    // Prevent repeating same quiz type twice in a row
    if (quizType === lastQuizType && lastQuizType !== null) {
      if (showToast) {
        showToast('Please choose a different quiz type - cannot repeat the same type twice in a row!', 'warning');
      }
      return;
    }

    console.log('Starting practice:', quizType, verse.reference);

    // For book-order, set the book from the verse reference
    const verseWithBook = {
      ...verse,
      book: getBookFromReference(verse.reference)
    };

    setCurrentVerse(verseWithBook);
    setPracticeMode(quizType);
    setPracticeResult(null); // Reset practice result
    setLastQuizType(quizType); // Track this quiz type

    // Fetch verse text for verse-scramble, fill-blank, multiple-choice, and reference-recall
    if (['verse-scramble', 'fill-blank', 'multiple-choice', 'reference-recall'].includes(quizType)) {
      console.log('Fetching verse text for:', verse.reference);
      setCurrentVerseText(''); // Reset first
      try {
        const translation = userData?.selectedTranslation || 'KJV';
        console.log('Using translation:', translation);
        const verseData = await getLocalVerseByReference(translation, verse.reference);
        console.log('Received verse data:', verseData);
        if (verseData && verseData.text) {
          setCurrentVerseText(verseData.text);
          console.log('Set verse text:', verseData.text);
        } else {
          setCurrentVerseText('ERROR: No verse text found');
          console.error('Could not fetch verse text for', verse.reference, verseData);
        }
      } catch (err) {
        console.error('Error fetching verse text:', err);
        setCurrentVerseText('ERROR: ' + err.message);
      }
    }
  };

  // Complete practice and update mastery tracking
  const completePractice = (isCorrect = null) => {
    // Update practice mastery if this was a mastery quiz type and we have a result
    if (isCorrect !== null && currentVerse && MASTERY_QUIZ_TYPES.includes(practiceMode) && onUpdateUserData) {
      const reference = currentVerse.reference;
      const progress = userData.verseProgress[reference] || {
        correctCount: 0,
        incorrectCount: 0,
        lastReview: null,
        nextReview: null,
        quizTypes: {},
        practiceMastery: {}
      };

      // Initialize practice mastery for this quiz type if needed
      if (!progress.practiceMastery) {
        progress.practiceMastery = {};
      }
      if (!progress.practiceMastery[practiceMode]) {
        progress.practiceMastery[practiceMode] = {
          consecutivePerfects: 0,
          totalAttempts: 0,
          lastAttemptDate: null
        };
      }

      const mastery = progress.practiceMastery[practiceMode];
      mastery.totalAttempts++;
      mastery.lastAttemptDate = Date.now();

      if (isCorrect) {
        mastery.consecutivePerfects++;
      } else {
        mastery.consecutivePerfects = 0; // Reset on incorrect
      }

      // Update user data
      onUpdateUserData({
        ...userData,
        verseProgress: {
          ...userData.verseProgress,
          [reference]: progress
        }
      });

      // Show toast if verse is now mastered
      if (isVerseMastered(progress) && showToast) {
        showToast(`${reference} has been mastered! It will no longer appear in your practice list.`, 'success');
      }
    }

    setPracticeMode(null);
    setCurrentVerse(null);
    setCurrentVerseText('');
    setPracticeResult(null);
  };

  // Generate wrong references for multiple choice
  const generateWrongReferences = (correctReference) => {
    const books = [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
      'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
      '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job',
      'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
      'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
      'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
      'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
      'Matthew', 'Mark', 'Luke', 'John', 'Acts',
      'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
      'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
      '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
      'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
    ];

    const wrongRefs = [];
    const parts = correctReference.match(/^((?:\d\s)?[A-Za-z\s]+)\s+(\d+):(\d+)$/);
    if (!parts) return ['John 3:16', 'Romans 8:28', 'Philippians 4:13']; // fallback

    const [, correctBook, correctChapter, correctVerse] = parts;

    // Generate 3 wrong references
    for (let i = 0; i < 3; i++) {
      if (i === 0) {
        // Different book, same chapter/verse
        const wrongBook = books[Math.floor(Math.random() * books.length)];
        wrongRefs.push(`${wrongBook} ${correctChapter}:${correctVerse}`);
      } else if (i === 1) {
        // Same book, different chapter
        const wrongChapter = Math.max(1, parseInt(correctChapter) + Math.floor(Math.random() * 10) - 5);
        wrongRefs.push(`${correctBook} ${wrongChapter}:${correctVerse}`);
      } else {
        // Same book and chapter, different verse
        const wrongVerse = Math.max(1, parseInt(correctVerse) + Math.floor(Math.random() * 20) - 10);
        wrongRefs.push(`${correctBook} ${correctChapter}:${wrongVerse}`);
      }
    }

    return wrongRefs;
  };

  // Available quiz types for practice mastery
  const availableQuizTypes = [
    { id: 'book-order', name: 'Book Order', icon: '📚' },
    { id: 'verse-scramble', name: 'Verse Scramble', icon: '🔀' },
    { id: 'fill-blank', name: 'Fill in the Blank', icon: '📝' },
  ];

  // Get quiz type name
  const getQuizTypeName = (type) => {
    const typeMap = {
      'verse-scramble': 'Verse Scramble',
      'book-order': 'Book Order',
      'sword-drill': 'Sword Drill',
      'fill-blank': 'Fill in the Blank',
      'multiple-choice': 'Multiple Choice',
      'reference-recall': 'Reference Recall',
      'spelling-bee': 'Spelling Bee'
    };
    return typeMap[type] || type;
  };

  // Render practice quiz
  if (practiceMode && currentVerse) {
    const practiceVerse = {
      reference: currentVerse.reference,
      id: currentVerse.reference
    };

    return (
      <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {/* Practice Mode Header */}
          <div className="bg-blue-900/40 border border-blue-600/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="text-blue-400" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-blue-200">Practice Mode</h2>
                  <p className="text-blue-300 text-sm">No points will be affected</p>
                </div>
              </div>
              <button
                onClick={completePractice}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Exit Practice
              </button>
            </div>
          </div>

          {/* Render appropriate quiz */}
          {practiceMode === 'verse-scramble' && currentVerseText && !currentVerseText.startsWith('ERROR:') && (
            <VerseScrambleQuiz
              verse={{ ...practiceVerse, text: currentVerseText }}
              onComplete={(result) => completePractice(result?.isCorrect)}
              onSkip={() => completePractice(false)}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'book-order' && (
            <BookOrderQuiz
              specificBook={currentVerse?.book}
              onComplete={(result) => completePractice(result?.isCorrect || result?.score >= 80)}
              onCancel={() => completePractice(false)}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'sword-drill' && (
            <SwordDrillUltimate
              onComplete={completePractice}
              onCancel={completePractice}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'spelling-bee' && (
            <BiblicalSpellingBee
              onComplete={completePractice}
              onCancel={completePractice}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'fill-blank' && currentVerseText && !currentVerseText.startsWith('ERROR:') && (
            <SimpleFillBlank
              verse={currentVerseText}
              reference={currentVerse.reference}
              onComplete={(result) => completePractice(result?.isCorrect)}
              onSkip={() => completePractice(false)}
            />
          )}
          {(practiceMode === 'multiple-choice' || practiceMode === 'reference-recall') && currentVerseText && !currentVerseText.startsWith('ERROR:') && (
            <EnhancedReviewMultipleChoice
              verse={currentVerseText}
              reference={currentVerse.reference}
              correctReference={currentVerse.reference}
              wrongReferences={generateWrongReferences(currentVerse.reference)}
              onComplete={completePractice}
              onSkip={completePractice}
              userPoints={0}
              isPaidMode={false}
              completionHistory={[]}
            />
          )}
          {(practiceMode === 'verse-scramble' || practiceMode === 'fill-blank' || practiceMode === 'multiple-choice' || practiceMode === 'reference-recall') && (!currentVerseText || currentVerseText.startsWith('ERROR:')) && (
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
              <AlertCircle className="text-amber-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                {currentVerseText && currentVerseText.startsWith('ERROR:') ? 'Error' : 'Loading...'}
              </h3>
              <p className="text-slate-400 mb-4">
                {currentVerseText && currentVerseText.startsWith('ERROR:')
                  ? currentVerseText
                  : `Fetching verse text for ${currentVerse?.reference || 'verse'}`}
              </p>
              {currentVerseText && currentVerseText.startsWith('ERROR:') && (
                <button
                  onClick={completePractice}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Return to Practice List
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Practice Progress Modal
  const renderProgressModal = () => {
    if (!showProgressModal) return null;

    const verse = filteredVerses.find(v => v.reference === showProgressModal);
    if (!verse) return null;

    const progress = userData.verseProgress[verse.reference];
    const mastery = progress?.practiceMastery || {};

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowProgressModal(null)}>
        <div className="bg-slate-800 rounded-xl border-2 border-purple-500 max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white">Practice Progress</h3>
            </div>
            <button
              onClick={() => setShowProgressModal(null)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="text-slate-400" size={20} />
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-bold text-amber-400 mb-2">{abbreviateReference(verse.reference)}</h4>
            <p className="text-sm text-slate-400">Complete all quiz types with {REQUIRED_CONSECUTIVE_PERFECTS} consecutive perfect scores each to master this verse.</p>
          </div>

          <div className="space-y-3">
            {MASTERY_QUIZ_TYPES.map(quizType => {
              const typeData = mastery[quizType] || { consecutivePerfects: 0, totalAttempts: 0 };
              const isComplete = typeData.consecutivePerfects >= REQUIRED_CONSECUTIVE_PERFECTS;
              const quizName = getQuizTypeName(quizType);

              return (
                <div key={quizType} className={`p-4 rounded-lg border-2 ${isComplete ? 'bg-green-900/20 border-green-500' : 'bg-slate-700/50 border-slate-600'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{quizName}</span>
                    {isComplete && <CheckCircle2 className="text-green-400" size={20} />}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consecutive Perfects:</span>
                      <span className={`font-bold ${isComplete ? 'text-green-300' : 'text-amber-300'}`}>
                        {typeData.consecutivePerfects} / {REQUIRED_CONSECUTIVE_PERFECTS}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Attempts:</span>
                      <span className="text-slate-300">{typeData.totalAttempts}</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isComplete ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (typeData.consecutivePerfects / REQUIRED_CONSECUTIVE_PERFECTS) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {isVerseMastered(progress) && (
            <div className="mt-4 p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-purple-400" size={20} />
                <span className="font-bold text-purple-300">Verse Mastered!</span>
              </div>
              <p className="text-sm text-purple-200">This verse will be removed from your practice list.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 z-40 overflow-y-auto overflow-x-hidden">
      {renderProgressModal()}

      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg z-10 border-b-2 border-blue-500/30">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <RefreshCw className="text-blue-100" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Practice Review</h1>
              <p className="text-blue-100 text-sm">Review & Practice Without Point Penalties</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close Practice Review"
          >
            <X className="text-white" size={28} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-2 pb-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-900/40 border border-blue-600/50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-blue-200 mb-2">Practice Mode Benefits</h3>
              <ul className="text-blue-300 space-y-1 text-sm">
                <li>• Review verses you've previously missed</li>
                <li>• Practice without affecting your points or streak</li>
                <li>• Focus on your weakest areas</li>
                <li>• Build confidence before taking scored quizzes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-red-400" size={24} />
              <div>
                <p className="text-sm text-slate-400">Verses to Review</p>
                <p className="text-2xl font-bold text-white">{missedVerses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <Target className="text-orange-400" size={24} />
              <div>
                <p className="text-sm text-slate-400">Most Struggled</p>
                <p className="text-lg font-bold text-white truncate">
                  {missedVerses.length > 0 ? missedVerses[0].reference : 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" size={24} />
              <div>
                <p className="text-sm text-slate-400">Practice Sessions</p>
                <p className="text-2xl font-bold text-white">∞</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Quizzes Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-6 border border-purple-700/50">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">🎁 Bonus Quizzes</h3>
            <p className="text-purple-200/80 text-sm">Challenge yourself with these special quiz types</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spelling Bee */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-lg p-4 border border-yellow-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🔤</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-amber-300 mb-1">Biblical Anagrams</h4>
                  <p className="text-amber-200/70 text-sm mb-3">Unscramble words from Smith's Bible Dictionary</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentVerse({ reference: 'Spelling Bee' });
                  setPracticeMode('spelling-bee');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Spelling</span>
              </button>
            </div>

            {/* Book Order */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-lg p-4 border border-blue-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">📚</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-blue-300 mb-1">Book Order Challenge</h4>
                  <p className="text-blue-200/70 text-sm mb-3">Arrange Bible books in correct order</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentVerse({ reference: 'Book Order' });
                  setPracticeMode('book-order');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Books</span>
              </button>
            </div>

            {/* Sword Drill */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-lg p-4 border border-red-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">⚔️</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-300 mb-1">Sword Drill Ultimate</h4>
                  <p className="text-red-200/70 text-sm mb-3">Speed finding verses in the Bible</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentVerse({ reference: 'Sword Drill' });
                  setPracticeMode('sword-drill');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Speed</span>
              </button>
            </div>

            {/* GeoGuessr Placeholder */}
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-lg p-4 border border-green-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🗺️</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-green-300 mb-1">Biblical GeoGuessr</h4>
                  <p className="text-green-200/70 text-sm mb-3">Explore biblical locations on the map</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (showToast) {
                    showToast('Geoguessr quiz is coming soon! Enjoy our other quizzes for now!', 'info');
                  } else {
                    alert('Geoguessr quiz is coming soon! Enjoy our other quizzes for now!');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Geography</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="text-slate-400" size={20} />
            <h3 className="text-sm font-bold text-slate-200">Filter Verse Reviews</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'verse-scramble', 'book-order', 'sword-drill'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold
                  ${selectedFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }
                `}
              >
                {type === 'all' ? 'All Types' : getQuizTypeName(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Missed Verses List */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-amber-400" size={24} />
            <h3 className="text-xl font-bold text-slate-100">Verses to Practice</h3>
          </div>

          {filteredVerses.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="text-green-400 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-bold text-green-300 mb-2">Great Job!</h3>
              <p className="text-slate-400">
                {selectedFilter === 'all'
                  ? "You haven't missed any verses yet. Keep up the excellent work!"
                  : `No missed verses in ${getQuizTypeName(selectedFilter)}.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVerses.map((verse, index) => (
                <div
                  key={verse.reference}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-amber-400 flex-shrink-0">
                          #{index + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-100 truncate">
                          {abbreviateReference(verse.reference)}
                        </h4>
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-semibold
                            ${verse.accuracy >= 70
                              ? 'bg-green-900/40 text-green-300'
                              : verse.accuracy >= 40
                              ? 'bg-yellow-900/40 text-yellow-300'
                              : 'bg-red-900/40 text-red-300'
                            }
                          `}
                        >
                          {verse.accuracy}% accuracy
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 flex-wrap">
                        <span className="flex-shrink-0">✓ {verse.correctCount}</span>
                        <span className="flex-shrink-0">✗ {verse.incorrectCount}</span>
                        {verse.lastReview && (
                          <span className="hidden sm:inline">
                            Last: {new Date(verse.lastReview).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Progress Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowProgressModal(verse.reference);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                        title="View Practice Progress"
                      >
                        <TrendingUp size={16} />
                      </button>

                      {/* Practice Button with Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowQuizTypeMenu(showQuizTypeMenu === verse.reference ? null : verse.reference);
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                          <Play size={16} />
                          <ChevronDown size={16} />
                        </button>

                        {/* Quiz Type Dropdown Menu */}
                        {showQuizTypeMenu === verse.reference && (
                          <div className="absolute right-0 mt-2 w-56 bg-slate-700 rounded-lg shadow-xl border border-slate-600 z-[9999]">
                            <div className="p-2">
                              <div className="text-xs text-slate-400 uppercase font-semibold px-3 py-2">
                                Choose Quiz Type
                              </div>
                              {availableQuizTypes.map(quizType => (
                                <button
                                  key={quizType.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startPractice(verse, quizType.id);
                                    setShowQuizTypeMenu(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-600 rounded transition-colors flex items-center gap-3"
                                >
                                  <span className="text-xl">{quizType.icon}</span>
                                  <span className="text-sm text-slate-200">{quizType.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeReview;
