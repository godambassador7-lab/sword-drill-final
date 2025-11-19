import React, { useState, useCallback, useEffect } from 'react';
import { X, Sparkles, BookOpen, CheckCircle, Lightbulb, AlertTriangle, Coins, Clock, Target, TrendingUp, Award, Zap, Eye, Brain } from 'lucide-react';

/**
 * Enhanced Review for Multiple Choice Questions - "VERSE DETECTIVE"
 * A creative investigation game where users uncover the correct verse through clues
 *
 * GAME MECHANICS:
 * - Progressive Difficulty: Start with vague clues, get more specific
 * - Evidence Collection: Gather "evidence" (context clues) about the verse
 * - Deduction System: Use collected evidence to eliminate wrong answers
 * - Confidence Meter: Bet points based on confidence level
 * - Speed Bonus: Faster completion = more points
 * - Investigation Rounds: Multiple rounds of clue revelation
 *
 * ANTI-EXPLOIT FEATURES:
 * - Cooldown timer prevents same-verse farming (5 minutes)
 * - Diminishing returns for repeated completions (50% reduction per repeat within 24h)
 * - Daily completion limit (10 paid reviews max)
 * - Point deduction happens immediately when hint purchased
 * - Minimum time requirement to prevent instant guessing
 */
const EnhancedReviewMultipleChoice = ({
  verse,
  reference,
  correctReference,
  wrongReferences = [],
  onComplete,
  onSkip,
  userPoints = 0,
  isCommonVerse = false,
  isPaidMode = true,
  completionHistory = [],
  onPurchaseHint
}) => {
  // Game states
  const [gamePhase, setGamePhase] = useState('intro'); // intro, investigation, reveal, complete
  const [investigationRound, setInvestigationRound] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(50); // 1-100
  const [evidenceCollected, setEvidenceCollected] = useState([]);
  const [eliminatedOptions, setEliminatedOptions] = useState(new Set());

  // Hint system
  const [freeHintsRemaining, setFreeHintsRemaining] = useState(3);
  const [paidHintsUsed, setPaidHintsUsed] = useState(0);

  // Visual effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealingClue, setRevealingClue] = useState(false);

  // Anti-exploit tracking
  const [canEarnPoints, setCanEarnPoints] = useState(true);
  const [pointReductionReason, setPointReductionReason] = useState('');
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // All answer options
  const [allOptions] = useState(() =>
    [correctReference, ...wrongReferences].sort(() => Math.random() - 0.5)
  );

  // Generate progressive clues about the verse
  const clues = useCallback(() => {
    const book = reference.split(' ')[0];
    const chapter = reference.match(/\d+/)?.[0];
    const words = verse.split(' ');
    const firstWord = words[0];
    const lastWord = words[words.length - 1].replace(/[.,!?;:'"]/g, '');
    const testament = ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
                       'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
                       '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
                       '1 John', '2 John', '3 John', 'Jude', 'Revelation']
                       .some(nt => reference.includes(nt)) ? 'New Testament' : 'Old Testament';

    // Find theologically significant words
    const keyWords = words.filter(w => {
      const cleaned = w.replace(/[.,!?;:'"]/g, '');
      return cleaned.length > 5 ||
             ['God', 'Lord', 'Jesus', 'Christ', 'Spirit', 'faith', 'love', 'grace', 'mercy', 'salvation',
              'eternal', 'heaven', 'kingdom', 'righteous', 'blessed', 'holy'].some(
               key => cleaned.toLowerCase().includes(key.toLowerCase())
             );
    });

    return [
      {
        type: 'testament',
        icon: BookOpen,
        title: 'Testament Location',
        text: `This verse is from the ${testament}`,
        difficulty: 'easy',
        points: 20
      },
      {
        type: 'wordCount',
        icon: Brain,
        title: 'Verse Length',
        text: `This verse contains approximately ${words.length} words`,
        difficulty: 'easy',
        points: 20
      },
      {
        type: 'book',
        icon: BookOpen,
        title: 'Book Identified',
        text: `This verse is from the book of ${book}`,
        difficulty: 'medium',
        points: 40
      },
      {
        type: 'keywords',
        icon: Sparkles,
        title: 'Key Theological Words',
        text: keyWords.length > 0
          ? `Contains important words like "${keyWords.slice(0, 2).join('", "').replace(/[.,!?;:'"]/g, '')}"`
          : `Look for words that express the verse's main theme`,
        difficulty: 'medium',
        points: 40
      },
      {
        type: 'firstWord',
        icon: Eye,
        title: 'Opening Word',
        text: `The verse begins with: "${firstWord}"`,
        difficulty: 'hard',
        points: 60
      },
      {
        type: 'chapter',
        icon: Target,
        title: 'Chapter Number',
        text: chapter ? `Found in chapter ${chapter}` : 'This is a single chapter book',
        difficulty: 'hard',
        points: 60
      },
      {
        type: 'lastWord',
        icon: Eye,
        title: 'Closing Word',
        text: `The verse ends with: "${lastWord}"`,
        difficulty: 'expert',
        points: 80
      },
      {
        type: 'fragment',
        icon: Sparkles,
        title: 'Verse Fragment',
        text: `"${words.slice(Math.floor(words.length / 3), Math.floor(words.length / 3) + 4).join(' ')}..."`,
        difficulty: 'expert',
        points: 100
      }
    ];
  }, [verse, reference]);

  // Anti-exploit checks
  useEffect(() => {
    if (!isPaidMode) return;

    // Check cooldown
    const lastCompletion = completionHistory
      .filter(h => h.reference === reference)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (lastCompletion && (Date.now() - lastCompletion.timestamp) < 300000) { // 5 minutes
      setIsOnCooldown(true);
      return;
    }

    // Check diminishing returns
    const reasons = [];
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentCompletions = completionHistory.filter(h =>
      h.reference === reference && h.timestamp >= last24h
    );

    if (recentCompletions.length > 0) {
      reasons.push(`${recentCompletions.length} completion(s) in last 24h (-${recentCompletions.length * 50}%)`);
    }

    // Check daily limit
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayCompletions = completionHistory.filter(h => h.timestamp >= todayStart && h.isPaid);

    if (todayCompletions.length >= 10) {
      reasons.push('Daily limit reached (10 max)');
    }

    if (reasons.length > 0) {
      setCanEarnPoints(false);
      setPointReductionReason(reasons.join('; '));
    }
  }, [reference, completionHistory, isPaidMode]);

  // Calculate minimum time based on difficulty
  const getMinimumTimeRequired = () => {
    const baseTime = isCommonVerse ? 15 : 20; // seconds
    return baseTime;
  };

  // Calculate points with anti-exploit measures
  const calculatePoints = () => {
    if (!isPaidMode) return 0;

    // Base points
    let basePoints = isCommonVerse ? 200 : 350;

    // Confidence bonus/penalty (higher confidence = higher reward/risk)
    const confidenceMultiplier = confidenceLevel / 100;
    basePoints = Math.floor(basePoints * (0.5 + (confidenceMultiplier * 0.5)));

    // Evidence bonus (collecting more clues = less points)
    const evidencePenalty = Math.max(0.3, 1 - (evidenceCollected.length * 0.1));
    basePoints = Math.floor(basePoints * evidencePenalty);

    // Speed bonus
    if (startTime) {
      const timeSpent = (Date.now() - startTime) / 1000;
      const minTime = getMinimumTimeRequired();

      if (timeSpent < minTime) {
        // Too fast - 50% penalty
        basePoints = Math.floor(basePoints * 0.5);
      } else if (timeSpent < minTime * 1.5) {
        // Fast completion - 20% bonus
        basePoints = Math.floor(basePoints * 1.2);
      }
    }

    // Hint penalty
    const totalHints = (3 - freeHintsRemaining) + paidHintsUsed;
    if (totalHints > 0) {
      basePoints = Math.floor(basePoints * Math.max(0.4, 1 - (totalHints * 0.15)));
    }

    // Diminishing returns
    if (!canEarnPoints) {
      basePoints = Math.floor(basePoints * 0.1);
    } else {
      const last24h = Date.now() - (24 * 60 * 60 * 1000);
      const recentCompletions = completionHistory.filter(h =>
        h.reference === reference && h.timestamp >= last24h
      );
      const multiplier = Math.max(0.1, 1 - (recentCompletions.length * 0.5));
      basePoints = Math.floor(basePoints * multiplier);
    }

    return Math.max(1, basePoints);
  };

  // Start investigation
  const startInvestigation = () => {
    setGamePhase('investigation');
    setStartTime(Date.now());
  };

  // Collect evidence (reveal a clue)
  const collectEvidence = (clueIndex) => {
    if (evidenceCollected.includes(clueIndex)) return;

    setRevealingClue(true);
    setEvidenceCollected([...evidenceCollected, clueIndex]);

    setTimeout(() => {
      setRevealingClue(false);
    }, 500);
  };

  // Use hint to reveal next clue automatically
  const useHint = () => {
    if (freeHintsRemaining > 0) {
      setFreeHintsRemaining(prev => prev - 1);
      autoRevealClue();
    } else if (isPaidMode) {
      const cost = 50;
      if (userPoints < cost) {
        alert(`You need ${cost} points for this hint.`);
        return;
      }
      if (onPurchaseHint) {
        onPurchaseHint(cost);
      }
      setPaidHintsUsed(prev => prev + 1);
      autoRevealClue();
    }
  };

  // Auto-reveal next unrevealed clue
  const autoRevealClue = () => {
    const allClues = clues();
    const unrevealedIndex = allClues.findIndex((_, idx) => !evidenceCollected.includes(idx));
    if (unrevealedIndex !== -1) {
      collectEvidence(unrevealedIndex);
    }
  };

  // Use deduction to eliminate a wrong answer
  const useDeduction = () => {
    const cost = 100;
    if (userPoints < cost) {
      alert(`You need ${cost} points to use deduction.`);
      return;
    }

    // Find a wrong answer that hasn't been eliminated
    const wrongAnswer = allOptions.find(opt =>
      opt !== correctReference && !eliminatedOptions.has(opt)
    );

    if (wrongAnswer) {
      if (onPurchaseHint) {
        onPurchaseHint(cost);
      }
      setEliminatedOptions(new Set([...eliminatedOptions, wrongAnswer]));
      setPaidHintsUsed(prev => prev + 1);
    }
  };

  // Submit answer
  const submitAnswer = () => {
    setGamePhase('reveal');

    if (selectedAnswer === correctReference) {
      setShowConfetti(true);
      setTimeout(() => {
        setGamePhase('complete');
      }, 2000);
    } else {
      setTimeout(() => {
        setGamePhase('complete');
      }, 3000);
    }
  };

  // Complete the review
  const completeReview = () => {
    const points = selectedAnswer === correctReference ? calculatePoints() : 0;
    onComplete({
      pointsEarned: points,
      paidHintCosts: paidHintsUsed * 50,
      completionTime: Math.floor((Date.now() - startTime) / 1000),
      hintsUsed: { free: 3 - freeHintsRemaining, paid: paidHintsUsed },
      reference,
      timestamp: Date.now(),
      isPaid: isPaidMode,
      success: selectedAnswer === correctReference
    });
  };

  const getTimeSpent = () => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  // INTRO SCREEN
  if (gamePhase === 'intro') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-amber-500/30 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
              <Target className="text-white" size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-amber-400">Verse Detective</h2>
              <p className="text-slate-400">Uncover the mystery verse through investigation</p>
            </div>
          </div>

          {isOnCooldown && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-400" size={20} />
                <span className="text-red-300 font-semibold">Cooldown Active</span>
              </div>
              <p className="text-sm text-red-200">
                You recently completed this verse. Please wait 5 minutes before trying again.
              </p>
            </div>
          )}

          <div className="bg-slate-700/50 rounded-xl p-6 mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <Brain className="text-blue-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">How to Play</h3>
                <p className="text-sm text-slate-300">Collect evidence (clues) about the mystery verse, then identify the correct reference from the options.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="text-purple-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-purple-300 mb-1">Strategy Matters</h3>
                <p className="text-sm text-slate-300">Use fewer clues and higher confidence for maximum points. But wrong guesses earn nothing!</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="text-yellow-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-300 mb-1">Speed Bonus</h3>
                <p className="text-sm text-slate-300">Complete quickly for bonus points, but not too fast or you'll get a penalty!</p>
              </div>
            </div>
          </div>

          {isPaidMode && (
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="text-emerald-400" size={24} />
                  <span className="text-emerald-300 font-semibold">Potential Reward:</span>
                </div>
                <span className="text-2xl font-bold text-emerald-400">
                  Up to {isCommonVerse ? 200 : 350} points
                </span>
              </div>
            </div>
          )}

          {!canEarnPoints && (
            <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-200">{pointReductionReason}</p>
              <p className="text-xs text-orange-300 mt-1">Earning 10% of normal points.</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startInvestigation}
              disabled={isOnCooldown}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 disabled:transform-none"
            >
              Start Investigation
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // INVESTIGATION SCREEN
  if (gamePhase === 'investigation') {
    const allClues = clues();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-slate-800 rounded-2xl p-6 max-w-5xl w-full my-8 border border-amber-500/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="text-amber-400" size={28} />
              <div>
                <h2 className="text-xl font-bold text-amber-400">Verse Detective</h2>
                <div className="text-sm text-slate-400">
                  Evidence Collected: {evidenceCollected.length} / {allClues.length}
                </div>
              </div>
            </div>
            <button onClick={onSkip} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <X className="text-slate-400" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="text-blue-400" size={16} />
                <span className="text-xs text-slate-400">Time</span>
              </div>
              <div className="text-lg font-bold text-blue-300">{getTimeSpent()}s</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="text-amber-400" size={16} />
                <span className="text-xs text-slate-400">Free Hints</span>
              </div>
              <div className="text-lg font-bold text-amber-300">{freeHintsRemaining}</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-emerald-400" size={16} />
                <span className="text-xs text-slate-400">Potential</span>
              </div>
              <div className="text-lg font-bold text-emerald-300">{calculatePoints()}pts</div>
            </div>
          </div>

          {/* Tools */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={useHint}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Lightbulb size={18} />
              Reveal Clue ({freeHintsRemaining} free)
            </button>

            {isPaidMode && (
              <button
                onClick={useDeduction}
                disabled={eliminatedOptions.size >= wrongReferences.length - 1}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Brain size={18} />
                Eliminate Option (100pts)
              </button>
            )}
          </div>

          {/* Evidence Board */}
          <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Sparkles size={20} />
              Evidence Board
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {allClues.map((clue, idx) => {
                const isCollected = evidenceCollected.includes(idx);
                const Icon = clue.icon;

                return (
                  <button
                    key={idx}
                    onClick={() => collectEvidence(idx)}
                    disabled={isCollected}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isCollected
                        ? 'bg-emerald-900/30 border-emerald-500/50'
                        : 'bg-slate-800/50 border-slate-600/30 hover:border-amber-500/50 hover:bg-slate-700/50'
                    } ${revealingClue && evidenceCollected[evidenceCollected.length - 1] === idx ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={isCollected ? 'text-emerald-400' : 'text-slate-400'} size={18} />
                      <span className={`text-sm font-semibold ${isCollected ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {clue.title}
                      </span>
                    </div>

                    {isCollected ? (
                      <p className="text-sm text-slate-300">{clue.text}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Click to reveal (-{clue.points}pts)</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-200">Confidence Level</h3>
              <span className="text-2xl font-bold text-amber-400">{confidenceLevel}%</span>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(Number(e.target.value))}
              className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <p className="text-xs text-slate-400 mt-2">
              Higher confidence = bigger rewards (or bigger losses if wrong!)
            </p>
          </div>

          {/* Answer Options */}
          <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Select Your Answer</h3>

            <div className="grid grid-cols-2 gap-3">
              {allOptions.map((option, idx) => {
                const isEliminated = eliminatedOptions.has(option);
                const isSelected = selectedAnswer === option;

                return (
                  <button
                    key={idx}
                    onClick={() => !isEliminated && setSelectedAnswer(option)}
                    disabled={isEliminated}
                    className={`p-4 rounded-xl font-semibold transition-all ${
                      isEliminated
                        ? 'bg-slate-900/50 text-slate-600 line-through cursor-not-allowed'
                        : isSelected
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white transform scale-105'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 disabled:transform-none"
          >
            {selectedAnswer ? 'Submit Answer' : 'Select an Answer to Continue'}
          </button>
        </div>
      </div>
    );
  }

  // REVEAL & COMPLETE SCREENS
  if (gamePhase === 'reveal' || gamePhase === 'complete') {
    const isCorrect = selectedAnswer === correctReference;
    const earnedPoints = isCorrect ? calculatePoints() : 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-amber-500/30 shadow-2xl">
          {/* Result */}
          <div className={`${isCorrect ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border-emerald-500/50' : 'bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-500/50'} border rounded-xl p-6 mb-6`}>
            <div className="flex items-center gap-4 mb-4">
              {isCorrect ? (
                <>
                  <CheckCircle className="text-emerald-400" size={48} />
                  <div>
                    <h3 className="text-3xl font-bold text-emerald-300">Case Solved!</h3>
                    <p className="text-emerald-400/80">Excellent detective work!</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="text-red-400" size={48} />
                  <div>
                    <h3 className="text-3xl font-bold text-red-300">Wrong Answer</h3>
                    <p className="text-red-400/80">The mystery remains unsolved</p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-2">Correct Answer: {correctReference}</div>
              <p className="text-slate-200 italic mb-4">"{verse}"</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <span className="text-xs text-slate-400">Your Answer</span>
                  <div className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedAnswer}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Points Earned</span>
                  <div className={`text-2xl font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isCorrect ? '+' : ''}{earnedPoints}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          {isCorrect && (
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-slate-300 mb-3">Investigation Summary</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Clues Used</div>
                  <div className="font-bold text-amber-300">{evidenceCollected.length} / {clues().length}</div>
                </div>
                <div>
                  <div className="text-slate-400">Confidence</div>
                  <div className="font-bold text-blue-300">{confidenceLevel}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Time</div>
                  <div className="font-bold text-purple-300">{getTimeSpent()}s</div>
                </div>
              </div>
            </div>
          )}

          {gamePhase === 'complete' && (
            <button
              onClick={completeReview}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default EnhancedReviewMultipleChoice;
