import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Lightbulb, Zap, Trophy, Clock, Star, CheckCircle } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const BibleWordSearch = ({ onBack, userId, userData, setUserData }) => {
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundWordCells, setFoundWordCells] = useState([]); // Track cells of found words
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hintCost, setHintCost] = useState(50);
  const [bonusChallenge, setBonusChallenge] = useState(null);
  const [completedPuzzles, setCompletedPuzzles] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedBonus, setEarnedBonus] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const totalPoints = userData?.totalPoints || 0;

  // Detect if device is mobile and orientation
  useEffect(() => {
    const checkMobileAndOrientation = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);

      // Check if landscape (width > height)
      if (mobile) {
        setIsLandscape(window.innerWidth > window.innerHeight);
      } else {
        setIsLandscape(true); // Desktop always allowed
      }
    };

    checkMobileAndOrientation();
    window.addEventListener('resize', checkMobileAndOrientation);
    window.addEventListener('orientationchange', checkMobileAndOrientation);

    return () => {
      window.removeEventListener('resize', checkMobileAndOrientation);
      window.removeEventListener('orientationchange', checkMobileAndOrientation);
    };
  }, []);

  // Load puzzles and progress
  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const puzzleFiles = Array.from({ length: 260 }, (_, i) =>
          `ws_${String(i + 1).padStart(3, '0')}.json`
        );

        const loadedPuzzles = await Promise.all(
          puzzleFiles.map(filename =>
            fetch(`${process.env.PUBLIC_URL}/bible_word_search_250/${filename}`)
              .then(res => res.json())
          )
        );

        setPuzzles(loadedPuzzles);

        // Load progress from userData
        const savedProgress = userData?.wordSearchProgress || {};
        setCompletedPuzzles(savedProgress.completed || []);
        setCurrentPuzzleIndex(savedProgress.currentIndex || 0);

        setLoading(false);
      } catch (error) {
        console.error('Error loading word search puzzles:', error);
        setLoading(false);
      }
    };

    loadPuzzles();
  }, [userData]);

  // Timer
  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning]);

  // Start timer when puzzle loads (only reset if puzzle ID changes, not just index)
  useEffect(() => {
    if (currentPuzzle && !completedPuzzles.includes(currentPuzzle.id)) {
      setTimer(0);
      setIsTimerRunning(true);
      setFoundWords([]);
      setFoundWordCells([]);
      setSelectedCells([]);

      // Random bonus challenge (30% chance)
      if (Math.random() < 0.3) {
        const timeLimit = currentPuzzle.difficulty === 'Easy' ? 120 :
                         currentPuzzle.difficulty === 'Medium' ? 180 : 240;
        const bonusPoints = currentPuzzle.difficulty === 'Easy' ? 100 :
                           currentPuzzle.difficulty === 'Medium' ? 200 : 300;
        setBonusChallenge({ timeLimit, bonusPoints });
      } else {
        setBonusChallenge(null);
      }
    } else if (currentPuzzle && completedPuzzles.includes(currentPuzzle.id)) {
      // If puzzle is already completed, stop timer
      setIsTimerRunning(false);
    }
  }, [currentPuzzle?.id, completedPuzzles]);

  const getCellKey = (row, col) => `${row}-${col}`;

  // Mobile tap-to-select mode handler
  const handleCellTap = (row, col) => {
    const cellKey = getCellKey(row, col);

    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    if (selectedCells.length === 0) {
      // First tap - start selection
      setDragStart({ row, col });
      setSelectedCells([cellKey]);
    } else {
      // Second tap - complete selection
      const newSelection = getSelectionBetween(dragStart, { row, col });
      setSelectedCells(newSelection);
      // Small delay before checking to show selection
      setTimeout(() => {
        checkWord();
        setDragStart(null);
      }, 200);
    }
  };


  const getSelectionBetween = (start, end) => {
    const cells = [];
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

    if (steps === 0) return [getCellKey(start.row, start.col)];

    const rowStep = rowDiff / steps;
    const colStep = colDiff / steps;

    for (let i = 0; i <= steps; i++) {
      const row = Math.round(start.row + rowStep * i);
      const col = Math.round(start.col + colStep * i);
      cells.push(getCellKey(row, col));
    }

    return cells;
  };

  const checkWord = () => {
    const selectedWord = selectedCells
      .map(key => {
        const [row, col] = key.split('-').map(Number);
        return currentPuzzle.grid[row][col];
      })
      .join('');

    const reversedWord = selectedWord.split('').reverse().join('');

    // Normalize words by removing spaces for comparison
    const foundWord = currentPuzzle.words.find(
      word => {
        const normalizedWord = word.replace(/\s+/g, '');
        return normalizedWord === selectedWord || normalizedWord === reversedWord;
      }
    );

    if (foundWord && !foundWords.includes(foundWord)) {
      // Success haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Success pattern
      }

      setFoundWords(prev => [...prev, foundWord]);

      // Store the cells of this found word for permanent highlighting
      setFoundWordCells(prev => [...prev, ...selectedCells]);

      // Check if puzzle complete
      if (foundWords.length + 1 === currentPuzzle.words.length) {
        completePuzzle();
      }
    } else if (selectedCells.length > 1) {
      // Wrong word - gentle feedback
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }

    setSelectedCells([]);
  };

  const completePuzzle = () => {
    setIsTimerRunning(false);

    let pointsEarned = 0;

    // Base points
    const basePoints = currentPuzzle.difficulty === 'Easy' ? 25 :
                      currentPuzzle.difficulty === 'Medium' ? 50 : 100;
    pointsEarned += basePoints;

    // Bonus challenge points
    if (bonusChallenge && timer <= bonusChallenge.timeLimit) {
      pointsEarned += bonusChallenge.bonusPoints;
      setEarnedBonus(bonusChallenge.bonusPoints);
    } else {
      setEarnedBonus(0);
    }

    // Update completion
    const newCompleted = [...completedPuzzles, currentPuzzle.id];
    setCompletedPuzzles(newCompleted);

    // Update user data
    const newTotalPoints = totalPoints + pointsEarned;

    if (userId && setUserData) {
      setUserData(prev => ({
        ...prev,
        totalPoints: newTotalPoints,
        wordSearchProgress: {
          completed: newCompleted,
          currentIndex: currentPuzzleIndex
        }
      }));

      updateUserProgress(userId, {
        totalPoints: newTotalPoints,
        wordSearchProgress: {
          completed: newCompleted,
          currentIndex: currentPuzzleIndex
        }
      }).catch(err => console.error('Error saving word search progress:', err));
    }

    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const buyHint = () => {
    if (totalPoints < hintCost) return;

    // Find first unfound word
    const unfoundWord = currentPuzzle.words.find(word => !foundWords.includes(word));
    if (!unfoundWord) return;

    // Deduct points
    const newTotalPoints = totalPoints - hintCost;

    if (userId && setUserData) {
      setUserData(prev => ({
        ...prev,
        totalPoints: newTotalPoints
      }));

      updateUserProgress(userId, {
        totalPoints: newTotalPoints
      }).catch(err => console.error('Error updating points:', err));
    }

    // Find word location and highlight first letter
    for (let row = 0; row < currentPuzzle.grid.length; row++) {
      for (let col = 0; col < currentPuzzle.grid[row].length; col++) {
        if (checkWordAt(row, col, unfoundWord)) {
          setSelectedCells([getCellKey(row, col)]);
          setTimeout(() => setSelectedCells([]), 2000);
          return;
        }
      }
    }
  };

  const checkWordAt = (row, col, word) => {
    // Normalize word by removing spaces
    const normalizedWord = word.replace(/\s+/g, '');

    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1],
      [0, -1], [-1, 0], [-1, -1], [-1, 1]
    ];

    for (const [dr, dc] of directions) {
      let match = true;
      for (let i = 0; i < normalizedWord.length; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (
          newRow < 0 || newRow >= currentPuzzle.grid.length ||
          newCol < 0 || newCol >= currentPuzzle.grid[0].length ||
          currentPuzzle.grid[newRow][newCol] !== normalizedWord[i]
        ) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    }
  };

  const previousPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Bible Word Searches...</p>
        </div>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-4">
          <ArrowLeft size={20} />
          Back
        </button>
        <p className="text-center text-red-400">No puzzles available</p>
      </div>
    );
  }

  const progress = (completedPuzzles.length / puzzles.length) * 100;
  const isPuzzleCompleted = completedPuzzles.includes(currentPuzzle.id);

  // Show rotate screen prompt for mobile portrait mode
  if (isMobile && !isLandscape) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          {/* Animated rotating phone */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Phone illustration - flips from vertical to horizontal */}
              <div className="w-32 h-48 bg-slate-700 rounded-3xl border-4 border-slate-600 flex items-center justify-center relative animate-[phoneFlip_2s_ease-in-out_infinite] p-2">
                <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center">
                  <div className="text-8xl">📱</div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-blue-300 mb-4">
            Rotate Your Device
          </h2>
          <p className="text-lg text-slate-300 mb-6">
            Please turn your device to landscape mode to play Bible Word Search
          </p>

          <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              💡 Word Search works best in landscape mode for easier gameplay
            </p>
          </div>

          {/* Back button */}
          <button
            onClick={onBack}
            className="mt-6 flex items-center gap-2 text-blue-300 hover:text-blue-200 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>

        <style jsx>{`
          @keyframes phoneFlip {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(90deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white p-6 pb-32 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="text-amber-400 font-bold flex items-center gap-2">
              <Star size={20} />
              {totalPoints} pts
            </div>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-blue-500/30 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Word Search Journey
            </h2>
            <span className="text-blue-400 font-semibold">
              {completedPuzzles.length} / {puzzles.length}
            </span>
          </div>

          {/* Orb Progress */}
          <div className="relative h-8 bg-slate-700/50 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
            {/* Glowing orbs at checkpoints */}
            {[...Array(10)].map((_, i) => {
              const checkpoint = ((i + 1) * 25);
              const isReached = completedPuzzles.length >= checkpoint;
              return (
                <div
                  key={i}
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 transition-all duration-500 ${
                    isReached
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 border-amber-300 shadow-lg shadow-amber-500/50 animate-pulse'
                      : 'bg-slate-600 border-slate-500'
                  }`}
                  style={{ left: `${checkpoint / puzzles.length * 100}%` }}
                >
                  {isReached && (
                    <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75"></div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-slate-400 text-sm text-center">
            Glowing checkpoints every 25 puzzles!
          </p>
        </div>

        {/* Puzzle Info */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur rounded-xl p-6 border border-blue-500/30 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-blue-300">{currentPuzzle.title}</h3>
              <p className="text-slate-400 text-sm">Theme: {currentPuzzle.theme}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold ${
              currentPuzzle.difficulty === 'Easy' ? 'bg-green-600/20 text-green-300' :
              currentPuzzle.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-300' :
              'bg-red-600/20 text-red-300'
            }`}>
              {currentPuzzle.difficulty}
            </div>
          </div>

          {/* Timer and Bonus Challenge */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
              <Clock size={18} className="text-blue-400" />
              <span className="font-mono font-bold">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {bonusChallenge && !isPuzzleCompleted && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timer <= bonusChallenge.timeLimit
                  ? 'bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/50'
                  : 'bg-slate-700/50 opacity-50'
              }`}>
                <Zap size={18} className="text-amber-400" />
                <span className="text-sm font-semibold">
                  {timer <= bonusChallenge.timeLimit
                    ? `Bonus ${bonusChallenge.bonusPoints}pts if < ${bonusChallenge.timeLimit}s!`
                    : 'Bonus expired'}
                </span>
              </div>
            )}
          </div>

          {/* Instructions */}
          {!isPuzzleCompleted && (
            <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-3 mb-3">
              <p className="text-blue-200 text-sm font-semibold flex items-center gap-2">
                <span className="text-xl">👆</span>
                Tap start letter, then tap end letter to select word
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3">
            {!isPuzzleCompleted && (
              <button
                onClick={buyHint}
                disabled={totalPoints < hintCost}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
              >
                <Lightbulb size={18} />
                Get Hint ({hintCost} pts)
              </button>
            )}
          </div>
        </div>

        {/* Word Grid */}
        <div className="bg-slate-800/90 backdrop-blur rounded-xl p-4 sm:p-6 border border-blue-500/30 mb-6">
          {/* Cancel Selection Button */}
          {selectedCells.length > 0 && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  setSelectedCells([]);
                  setDragStart(null);
                }}
                className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg font-semibold transition-all"
              >
                ✕ Cancel Selection
              </button>
            </div>
          )}

          <div className="overflow-x-auto pb-2">
            <div className="inline-block mx-auto">
              <div
                className={`grid ${isMobile ? 'gap-2' : 'gap-1'}`}
                style={{
                  gridTemplateColumns: `repeat(${currentPuzzle.gridSize}, minmax(0, 1fr))`
                }}
              >
              {currentPuzzle.grid.map((row, rowIndex) =>
                row.split('').map((letter, colIndex) => {
                  const key = getCellKey(rowIndex, colIndex);
                  const isSelected = selectedCells.includes(key);
                  const isFoundWord = foundWordCells.includes(key);

                  return (
                    <div
                      key={key}
                      data-row={rowIndex}
                      data-col={colIndex}
                      onClick={() => handleCellTap(rowIndex, colIndex)}
                      className={`
                        flex items-center justify-center font-bold rounded cursor-pointer
                        select-none transition-all
                        ${isMobile
                          ? 'w-10 h-10 text-base sm:w-11 sm:h-11 sm:text-lg'
                          : 'w-7 h-7 text-sm md:w-8 md:h-8 md:text-base'
                        }
                        ${isSelected
                          ? selectedCells.length === 1
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white scale-110 shadow-lg shadow-amber-500/50 ring-2 ring-amber-300 animate-pulse'
                            : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white scale-105 shadow-lg shadow-blue-500/50 ring-2 ring-white'
                          : isFoundWord
                          ? 'bg-gradient-to-br from-green-600/60 to-emerald-600/60 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 active:bg-slate-600'
                        }
                      `}
                    >
                      {letter}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Word List - Split into Two Banks on Mobile */}
        <div className="bg-slate-800/90 backdrop-blur rounded-xl p-6 border border-blue-500/30 mb-6">
          <h4 className="text-lg font-bold text-blue-300 mb-4">
            Words to Find ({foundWords.length}/{currentPuzzle.words.length})
          </h4>

          {isMobile ? (
            // Mobile: Split word list into two columns
            <div className="grid grid-cols-2 gap-4">
              {/* Left Bank */}
              <div>
                <div className="text-xs font-semibold text-blue-400 mb-2">Bank 1</div>
                <div className="space-y-2">
                  {currentPuzzle.words.slice(0, Math.ceil(currentPuzzle.words.length / 2)).map(word => {
                    const displayWord = word.replace(/([a-z])([A-Z])/g, '$1 $2');
                    return (
                      <div
                        key={word}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all break-words ${
                          foundWords.includes(word)
                            ? 'bg-green-600/20 text-green-300 line-through'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {foundWords.includes(word) && <CheckCircle size={12} className="inline mr-1" />}
                        {displayWord}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Bank */}
              <div>
                <div className="text-xs font-semibold text-purple-400 mb-2">Bank 2</div>
                <div className="space-y-2">
                  {currentPuzzle.words.slice(Math.ceil(currentPuzzle.words.length / 2)).map(word => {
                    const displayWord = word.replace(/([a-z])([A-Z])/g, '$1 $2');
                    return (
                      <div
                        key={word}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all break-words ${
                          foundWords.includes(word)
                            ? 'bg-green-600/20 text-green-300 line-through'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {foundWords.includes(word) && <CheckCircle size={12} className="inline mr-1" />}
                        {displayWord}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Desktop: Original grid layout
            <div className="grid grid-cols-2 gap-2">
              {currentPuzzle.words.map(word => {
                const displayWord = word.replace(/([a-z])([A-Z])/g, '$1 $2');
                return (
                  <div
                    key={word}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all break-words ${
                      foundWords.includes(word)
                        ? 'bg-green-600/20 text-green-300 line-through'
                        : 'bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {foundWords.includes(word) && <CheckCircle size={16} className="inline mr-2" />}
                    {displayWord}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={previousPuzzle}
            disabled={currentPuzzleIndex === 0}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
          >
            Previous
          </button>
          <button
            onClick={nextPuzzle}
            disabled={currentPuzzleIndex === puzzles.length - 1}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
          >
            {isPuzzleCompleted ? 'Next Puzzle' : 'Skip to Next'}
          </button>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-achievement-unlock bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-2xl shadow-2xl p-8 border-4 border-white/30 animate-pulse-glow pointer-events-auto">
              <div className="text-center">
                <Trophy size={64} className="text-amber-300 mx-auto mb-4 animate-bounce" />
                <h2 className="text-4xl font-bold text-white mb-2">Puzzle Complete!</h2>
                {earnedBonus > 0 && (
                  <div className="bg-amber-500/20 border border-amber-400 rounded-lg p-3 mb-3">
                    <Zap size={32} className="text-amber-300 mx-auto mb-2" />
                    <p className="text-xl font-bold text-amber-300">
                      Time Bonus: +{earnedBonus} pts!
                    </p>
                  </div>
                )}
                <p className="text-lg text-blue-100">
                  Keep going on your journey!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleWordSearch;
