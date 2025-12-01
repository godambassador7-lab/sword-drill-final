import React, { useState, useCallback, useEffect } from 'react';
import { X, RotateCcw, SkipForward, BookOpen, CheckCircle, Lightbulb, AlertTriangle, Coins, Clock } from 'lucide-react';

/**
 * Enhanced Review Modal
 * Appears after incorrect fill-in-the-blank answers
 * User must reconstruct the entire verse by dragging words into correct positions
 * Features: Hints (3 free, then paid), reset limits, drop attempt tracking, point rewards
 *
 * ANTI-EXPLOIT FEATURES:
 * - Cooldown timer prevents same-verse farming (5 minutes)
 * - Diminishing returns for repeated completions (50% reduction per repeat within 24h)
 * - Daily completion limit (10 paid reviews max)
 * - Point deduction happens immediately when hint purchased
 * - Minimum time requirement (10-30s scaled by verse length)
 * - Tracks completion history to detect patterns
 */
const EnhancedReviewModal = ({
  verse,
  reference,
  onComplete,
  onSkip,
  userPoints = 0,
  isCommonVerse = false,
  isPaidMode = true,
  completionHistory = [], // Array of {reference, timestamp, pointsEarned}
  onPurchaseHint // Callback to immediately deduct points
}) => {
  const [showPrompt, setShowPrompt] = useState(true);
  const [droppedWords, setDroppedWords] = useState([]);
  const [wordBank, setWordBank] = useState([]);
  const [correctPositions, setCorrectPositions] = useState([]);
  const [startTime, setStartTime] = useState(null);

  // Hint system
  const [freeHintsUsed, setFreeHintsUsed] = useState(0);
  const [paidHintsUsed, setPaidHintsUsed] = useState(0);
  const [hintsUsedIndices, setHintsUsedIndices] = useState(new Set());
  const [pointsSpentOnHints, setPointsSpentOnHints] = useState(0);

  // Reset tracking
  const [hasReset, setHasReset] = useState(false);

  // Drop attempt tracking per word
  const [dropAttempts, setDropAttempts] = useState({});

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Never ask again preferences (stored in localStorage)
  const [neverAskAgain, setNeverAskAgain] = useState({
    paidHint: false,
    reset: false,
    finalDrop: false
  });

  // Anti-exploit checks
  const [canEarnPoints, setCanEarnPoints] = useState(true);
  const [pointReductionReason, setPointReductionReason] = useState('');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sd_enhancedReview_neverAskAgain');
    if (saved) {
      try {
        setNeverAskAgain(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse never ask again preferences:', e);
      }
    }
  }, []);

  // Check for exploits on mount
  useEffect(() => {
    if (!isPaidMode) return;

    const reasons = [];

    // Check 1: Cooldown timer (5 minutes per verse)
    const lastCompletion = completionHistory
      .filter(h => h.reference === reference)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (lastCompletion) {
      const timeSinceLastCompletion = Date.now() - lastCompletion.timestamp;
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes

      if (timeSinceLastCompletion < cooldownPeriod) {
        const remainingMinutes = Math.ceil((cooldownPeriod - timeSinceLastCompletion) / 60000);
        reasons.push(`Cooldown: Wait ${remainingMinutes} min before reviewing this verse again`);
      }
    }

    // Check 2: Daily completion limit (10 paid reviews max)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayCompletions = completionHistory.filter(h => h.timestamp >= todayStart && h.isPaid);

    if (todayCompletions.length >= 10) {
      reasons.push('Daily limit reached: 10 paid Enhanced Reviews per day max');
    }

    // Check 3: Repetition detection (same verse within 24h)
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentCompletions = completionHistory.filter(h =>
      h.reference === reference && h.timestamp >= last24h
    );

    if (recentCompletions.length > 0) {
      reasons.push(`Diminishing returns: ${recentCompletions.length} completion(s) in last 24h (-${recentCompletions.length * 50}%)`);
    }

    if (reasons.length > 0) {
      setCanEarnPoints(false);
      setPointReductionReason(reasons.join('; '));
    }
  }, [reference, completionHistory, isPaidMode]);

  // Save preferences to localStorage
  const updateNeverAskAgain = (key, value) => {
    const updated = { ...neverAskAgain, [key]: value };
    setNeverAskAgain(updated);
    localStorage.setItem('sd_enhancedReview_neverAskAgain', JSON.stringify(updated));
  };

  // Calculate hint cost based on paid hints used
  const getHintCost = () => {
    const costs = [30, 50, 100, 200, 350];
    return costs[paidHintsUsed] || 500; // After 5th, each hint costs 500
  };

  // Calculate diminishing returns multiplier
  const getDiminishingReturnsMultiplier = () => {
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentCompletions = completionHistory.filter(h =>
      h.reference === reference && h.timestamp >= last24h
    );

    // 50% reduction per completion
    const multiplier = Math.max(0.1, 1 - (recentCompletions.length * 0.5));
    return multiplier;
  };

  // Calculate minimum time required based on verse length
  const getMinimumTimeRequired = () => {
    const wordCount = correctPositions.length;
    // Scale from 10 seconds (short verses) to 30 seconds (long verses)
    // Short verse (2-5 words): 10s
    // Medium verse (10-15 words): 20s
    // Long verse (20+ words): 30s
    const minTime = Math.min(30, Math.max(10, Math.floor(wordCount * 1.5)));
    return minTime;
  };

  // Calculate points reward with anti-exploit measures
  const calculatePointsReward = () => {
    const wordCount = correctPositions.length;
    let basePoints;

    if (isCommonVerse) {
      basePoints = Math.max(50, Math.floor(200 * (wordCount / 15)));
    } else {
      basePoints = Math.max(100, Math.floor(500 * (wordCount / 15)));
    }

    // Reduce by 50% if free hints were used
    if (freeHintsUsed > 0 && paidHintsUsed === 0) {
      basePoints = Math.floor(basePoints * 0.5);
    }

    // Fixed 800 if paid hints were used
    if (paidHintsUsed > 0) {
      basePoints = 800;
    }

    // Apply diminishing returns
    const diminishingMultiplier = getDiminishingReturnsMultiplier();
    basePoints = Math.floor(basePoints * diminishingMultiplier);

    // Minimum time requirement (scaled by verse length)
    const minTimeRequired = getMinimumTimeRequired();
    if (startTime && (Date.now() - startTime) < minTimeRequired * 1000) {
      basePoints = Math.floor(basePoints * 0.5);
    }

    // Daily limit check - reduce to 10% if over limit
    if (!canEarnPoints) {
      basePoints = Math.floor(basePoints * 0.1);
    }

    return Math.max(1, basePoints);
  };

  // Initialize the word bank when starting review
  const startReview = useCallback(() => {
    const words = verse.split(' ');
    const shuffled = [...words]
      .map((word, idx) => ({ word, originalIndex: idx, id: Math.random() }))
      .sort(() => Math.random() - 0.5);

    setWordBank(shuffled);
    setDroppedWords(new Array(words.length).fill(null));
    setCorrectPositions(words);
    setShowPrompt(false);
    setStartTime(Date.now()); // Track start time for minimum time requirement
  }, [verse]);

  // Use a hint - fills in a random empty slot
  const useHint = () => {
    const emptySlots = droppedWords
      .map((word, idx) => word === null && !hintsUsedIndices.has(idx) ? idx : -1)
      .filter(idx => idx !== -1);

    if (emptySlots.length === 0) {
      alert('No more hints available! All empty slots have been filled or hinted.');
      return;
    }

    const applyHint = () => {
      const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
      const correctWord = correctPositions[randomSlot];
      const wordInBank = wordBank.find(w => w.word === correctWord);

      if (!wordInBank) {
        alert('Unable to apply hint. The word may already be placed.');
        return;
      }

      const newDropped = [...droppedWords];
      newDropped[randomSlot] = wordInBank;
      setDroppedWords(newDropped);
      setWordBank(prev => prev.filter(w => w.id !== wordInBank.id));
      setHintsUsedIndices(prev => new Set([...prev, randomSlot]));

      if (freeHintsUsed < 3) {
        setFreeHintsUsed(prev => prev + 1);
      } else {
        const cost = getHintCost();
        setPaidHintsUsed(prev => prev + 1);
        setPointsSpentOnHints(prev => prev + cost);

        // CRITICAL: Immediately deduct points via callback
        if (onPurchaseHint) {
          onPurchaseHint(cost);
        }
      }
    };

    // Check if we need to pay for this hint
    if (freeHintsUsed >= 3 && isPaidMode) {
      const cost = getHintCost();

      if (userPoints < cost) {
        alert(`You need ${cost} points for this hint, but you only have ${userPoints} points.`);
        return;
      }

      if (!neverAskAgain.paidHint) {
        setConfirmDialog({
          type: 'paidHint',
          title: 'Purchase Hint?',
          message: `This hint will cost ${cost} points and will be deducted immediately.`,
          currentPoints: userPoints,
          newPoints: userPoints - cost,
          cost,
          onConfirm: applyHint
        });
      } else {
        applyHint();
      }
    } else {
      applyHint();
    }
  };

  // Handle word drag start
  const handleDragStart = (e, word, fromBank) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('word', JSON.stringify({ word, fromBank }));
  };

  // Handle drop into verse slot
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('word'));

    const performDrop = () => {
      const wordId = data.word.id;
      const attempts = dropAttempts[wordId] || 0;

      if (data.fromBank) {
        const newDropped = [...droppedWords];
        newDropped[targetIndex] = data.word;
        setDroppedWords(newDropped);
        setWordBank(prev => prev.filter(w => w.id !== data.word.id));
        setDropAttempts(prev => ({ ...prev, [wordId]: attempts + 1 }));

        const isCorrect = data.word.word === correctPositions[targetIndex];
        if (attempts + 1 >= 3 && !isCorrect && isPaidMode) {
          setTimeout(() => {
            setConfirmDialog({
              type: 'failure',
              title: 'Unsuccessful',
              message: 'Maybe next time. Go to "Verse Review" section to do Enhanced Review at no cost.',
              onConfirm: () => {
                setConfirmDialog(null);
                onSkip();
              }
            });
          }, 500);
        }
      } else {
        const oldIndex = droppedWords.findIndex(w => w?.id === data.word.id);
        if (oldIndex !== -1) {
          const newDropped = [...droppedWords];
          const temp = newDropped[targetIndex];
          newDropped[targetIndex] = data.word;
          newDropped[oldIndex] = temp;
          setDroppedWords(newDropped);
          setDropAttempts(prev => ({ ...prev, [wordId]: attempts + 1 }));
        }
      }
    };

    const wordId = data.word.id;
    const attempts = dropAttempts[wordId] || 0;

    if (attempts >= 2 && isPaidMode && !neverAskAgain.finalDrop) {
      setConfirmDialog({
        type: 'finalDrop',
        title: 'Final Drop Warning',
        message: 'This is your final drop on this word. Are you sure?',
        onConfirm: performDrop
      });
    } else {
      performDrop();
    }
  };

  // Handle dropping back to word bank
  const handleDropToBank = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('word'));

    if (!data.fromBank) {
      setWordBank(prev => [...prev, data.word]);
      setDroppedWords(prev => prev.map(w => w?.id === data.word.id ? null : w));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Reset the board
  const handleReset = () => {
    if (hasReset && isPaidMode) {
      alert('You can only reset once in paid mode!');
      return;
    }

    const performReset = () => {
      const words = verse.split(' ');
      const shuffled = [...words]
        .map((word, idx) => ({ word, originalIndex: idx, id: Math.random() }))
        .sort(() => Math.random() - 0.5);

      setWordBank(shuffled);
      setDroppedWords(new Array(words.length).fill(null));
      setDropAttempts({});
      setHintsUsedIndices(new Set());
      setHasReset(true);
    };

    if (isPaidMode && !neverAskAgain.reset) {
      setConfirmDialog({
        type: 'reset',
        title: 'Reset Board?',
        message: 'You can only reset once. Are you sure you want to reset the board?',
        onConfirm: performReset
      });
    } else {
      performReset();
    }
  };

  // Check if word is in correct position
  const isCorrect = (index) => {
    if (!droppedWords[index]) return null;
    return droppedWords[index].word === correctPositions[index];
  };

  // Check if all words are placed correctly
  const isComplete = droppedWords.every((word, idx) =>
    word && word.word === correctPositions[idx]
  );

  // Check minimum time requirement
  const getTimeSpent = () => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const meetsMinimumTime = () => {
    if (!isPaidMode) return true;
    const minRequired = getMinimumTimeRequired();
    return getTimeSpent() >= minRequired;
  };

  // Confirmation Dialog Component
  const ConfirmationDialog = () => {
    const [dontAskAgain, setDontAskAgain] = useState(false);

    if (!confirmDialog) return null;

    const handleConfirm = () => {
      if (dontAskAgain && confirmDialog.type !== 'failure') {
        updateNeverAskAgain(confirmDialog.type, true);
      }
      confirmDialog.onConfirm();
      setConfirmDialog(null);
    };

    const handleCancel = () => {
      setConfirmDialog(null);
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-amber-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-amber-400" size={28} />
            <h3 className="text-xl font-bold text-amber-400">{confirmDialog.title}</h3>
          </div>

          <p className="text-slate-300 mb-4">{confirmDialog.message}</p>

          {confirmDialog.type === 'paidHint' && (
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Hint Cost:</span>
                <span className="text-red-400 font-semibold">-{confirmDialog.cost} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Points:</span>
                <span className="text-amber-400 font-semibold">{confirmDialog.currentPoints}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                <span className="text-slate-300 font-semibold">New Balance:</span>
                <span className="text-emerald-400 font-semibold">{confirmDialog.newPoints} points</span>
              </div>
              <div className="bg-orange-900/30 border border-orange-500/30 rounded p-2 mt-2">
                <p className="text-xs text-orange-300">⚠️ Points will be deducted immediately when you confirm.</p>
              </div>
            </div>
          )}

          {confirmDialog.type !== 'failure' && (
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700"
              />
              Never ask me this again
            </label>
          )}

          <div className="flex gap-3">
            {confirmDialog.type !== 'failure' && (
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              {confirmDialog.type === 'failure' ? 'OK' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Prompt screen
  if (showPrompt) {
    const estimatedFullPoints = Math.floor(calculatePointsReward() * 2);
    const estimatedHalfPoints = calculatePointsReward();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-amber-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-amber-400" size={32} />
            <h2 className="text-2xl font-bold text-amber-400">Enhanced Review</h2>
          </div>

          <p className="text-slate-300 mb-6">
            This verse needs more practice! Would you like to do an enhanced review where you'll reconstruct the entire verse word-by-word?
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <div className="text-sm text-amber-400 font-semibold mb-1">{reference}</div>
            <div className="text-slate-300 text-sm italic">"{verse}"</div>
          </div>

          {isPaidMode && (
            <>
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="text-blue-400" size={20} />
                  <span className="text-blue-300 font-semibold">Potential Rewards:</span>
                </div>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• <strong>No hints:</strong> Up to {estimatedFullPoints} points</li>
                  <li>• <strong>Free hints only:</strong> {estimatedHalfPoints} points</li>
                  <li>• <strong>Using paid hints:</strong> {Math.floor(800 * getDiminishingReturnsMultiplier())} points</li>
                </ul>
              </div>

              {!canEarnPoints && (
                <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-orange-400" size={20} />
                    <span className="text-orange-300 font-semibold">Point Reduction Active</span>
                  </div>
                  <p className="text-sm text-orange-200">{pointReductionReason}</p>
                  <p className="text-xs text-orange-300 mt-2">You'll earn only 10% of normal points.</p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={startReview}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Start Review
            </button>
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review screen
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full my-8 border border-amber-500/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="text-amber-400" size={28} />
              <div>
                <h2 className="text-xl font-bold text-amber-400">Enhanced Review</h2>
                <div className="text-sm text-slate-400">{reference}</div>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="text-slate-400" />
            </button>
          </div>

          {/* Time Tracker */}
          {isPaidMode && (
            <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-400" size={18} />
                  <span className="text-sm text-slate-300">Time Spent: {getTimeSpent()}s</span>
                </div>
                {!meetsMinimumTime() && (
                  <span className="text-xs text-orange-400">Minimum {getMinimumTimeRequired()}s required for full points</span>
                )}
              </div>
            </div>
          )}

          {/* Points Reward Banner */}
          {isPaidMode && (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <Coins className="text-purple-400" size={20} />
                <span className="text-purple-200 text-sm">
                  <strong>Current Reward:</strong> {calculatePointsReward()} points
                  {pointsSpentOnHints > 0 && (
                    <span className="text-red-300"> (−{pointsSpentOnHints} spent on hints)</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Hint System */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-amber-400" size={20} />
                <span className="text-slate-300 font-semibold">Hints Available</span>
              </div>
              <button
                onClick={useHint}
                disabled={droppedWords.filter(w => w === null).length === 0}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              >
                Use Hint
              </button>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="text-emerald-400">
                Free Hints: {3 - freeHintsUsed} remaining
              </div>
              {isPaidMode && (
                <div className="text-amber-400">
                  Next Paid Hint: {getHintCost()} points
                </div>
              )}
              {paidHintsUsed > 0 && (
                <div className="text-red-400">
                  Points Spent: {pointsSpentOnHints}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-slate-300 text-sm">
              <strong className="text-amber-400">Instructions:</strong> Drag words from the word bank below into the correct positions to reconstruct the verse.
              Words will turn <span className="text-emerald-400 font-semibold">green</span> when correct and <span className="text-red-400 font-semibold">red</span> when incorrect.
              {isPaidMode && <span className="text-orange-400 font-semibold"> Each word has 3 drop attempts before locking in.</span>}
            </p>
          </div>

          {/* Verse Construction Area */}
          <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-600/30">
            <div className="flex flex-wrap gap-2 min-h-[120px]">
              {correctPositions.map((_, index) => {
                const dropped = droppedWords[index];
                const correct = isCorrect(index);
                const isHinted = hintsUsedIndices.has(index);

                return (
                  <div
                    key={index}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className={`
                      min-w-[80px] h-12 px-3 flex items-center justify-center rounded-lg border-2 border-dashed
                      transition-all relative
                      ${!dropped ? 'border-slate-600 bg-slate-800/50' : ''}
                      ${dropped && correct === null ? 'border-amber-500/50 bg-amber-500/10' : ''}
                      ${correct === true ? 'border-emerald-500 bg-emerald-500/20' : ''}
                      ${correct === false ? 'border-red-500 bg-red-500/20' : ''}
                      ${isHinted ? 'ring-2 ring-blue-400/50' : ''}
                    `}
                  >
                    {dropped ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, dropped, false)}
                        className={`
                          cursor-move px-3 py-1 rounded font-medium
                          ${correct === true ? 'text-emerald-300' : ''}
                          ${correct === false ? 'text-red-300' : ''}
                          ${correct === null ? 'text-amber-300' : ''}
                        `}
                      >
                        {dropped.word}
                      </div>
                    ) : (
                      <span className="text-slate-600 text-sm">{index + 1}</span>
                    )}
                    {isHinted && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                        <Lightbulb size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word Bank */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-400 mb-2">Word Bank</div>
            <div
              onDrop={handleDropToBank}
              onDragOver={handleDragOver}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/30 min-h-[100px]"
            >
              <div className="flex flex-wrap gap-2">
                {wordBank.map((item) => {
                  const attempts = dropAttempts[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, true)}
                      className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-200 rounded-lg cursor-move font-medium shadow-lg transition-all hover:scale-105 relative"
                    >
                      {item.word}
                      {isPaidMode && attempts > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {attempts}
                        </span>
                      )}
                    </div>
                  );
                })}
                {wordBank.length === 0 && (
                  <div className="text-slate-500 text-sm italic">All words placed</div>
                )}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {isComplete && (
            <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border border-emerald-500/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-400" size={24} />
                <div className="flex-1">
                  <div className="font-bold text-emerald-300">Perfect! You've reconstructed the verse correctly!</div>
                  <div className="text-sm text-emerald-400/80">
                    {isPaidMode
                      ? `Click "Complete" to earn ${calculatePointsReward()} points!`
                      : "Click \"Complete\" to continue your learning journey."}
                  </div>
                  {isPaidMode && !meetsMinimumTime() && (
                    <div className="text-xs text-orange-400 mt-1">
                      ⚠️ Completed too quickly - earning 50% of points
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={isPaidMode && hasReset}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-xl transition-all"
            >
              <RotateCcw size={18} />
              Reset {isPaidMode && hasReset && '(Used)'}
            </button>
            <button
              onClick={onSkip}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
            >
              <SkipForward size={18} />
              Skip
            </button>
            {isComplete && (
              <button
                onClick={() => onComplete({
                  pointsEarned: calculatePointsReward(),
                  paidHintCosts: 0, // Already deducted
                  completionTime: getTimeSpent(),
                  hintsUsed: { free: freeHintsUsed, paid: paidHintsUsed },
                  reference,
                  timestamp: Date.now(),
                  isPaid: isPaidMode
                })}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
              >
                Complete Review {isPaidMode && `(+${calculatePointsReward()} pts)`}
              </button>
            )}
          </div>
        </div>
      </div>
      <ConfirmationDialog />
    </>
  );
};

export default EnhancedReviewModal;
