import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Lock, Grid3x3, ArrowLeft, CheckCircle, Award, Clock } from 'lucide-react';

const BiblicalCrossword = ({ onBack, userData, setUserData, userId }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userGrid, setUserGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [completedPuzzles, setCompletedPuzzles] = useState({
    beginner: [],
    intermediate: [],
    advanced: [],
    elite: []
  });
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [incorrectCells, setIncorrectCells] = useState([]);
  const timerRef = useRef(null);
  const inputRefs = useRef({});

  const DIFFICULTY_CONFIG = {
    beginner: {
      name: 'Beginner',
      color: 'green',
      unlockCost: 0,
      pointsPerComplete: 50,
      requiredToUnlockNext: 10,
      description: 'Simple biblical terms and concepts'
    },
    intermediate: {
      name: 'Intermediate',
      color: 'blue',
      unlockCost: 500,
      pointsPerComplete: 100,
      requiredToUnlockNext: 15,
      description: 'Bible characters and events'
    },
    advanced: {
      name: 'Advanced',
      color: 'purple',
      unlockCost: 1000,
      pointsPerComplete: 150,
      requiredToUnlockNext: 20,
      description: 'Complex theological concepts'
    },
    elite: {
      name: 'Elite',
      color: 'amber',
      unlockCost: 2000,
      pointsPerComplete: 250,
      requiredToUnlockNext: null,
      description: 'Master-level biblical knowledge'
    }
  };

  // Load completed puzzles from userData
  useEffect(() => {
    if (userData?.crosswordProgress) {
      setCompletedPuzzles(userData.crosswordProgress);
    }
  }, [userData]);

  // Timer effect
  useEffect(() => {
    if (startTime && !loading) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, loading]);

  // Check if difficulty is unlocked
  const isDifficultyUnlocked = (difficulty) => {
    if (difficulty === 'beginner') return true;

    const prevDifficulty = difficulty === 'intermediate' ? 'beginner'
      : difficulty === 'advanced' ? 'intermediate'
      : 'advanced';

    const prevConfig = DIFFICULTY_CONFIG[prevDifficulty];
    const prevCompleted = completedPuzzles[prevDifficulty]?.length || 0;

    return prevCompleted >= prevConfig.requiredToUnlockNext;
  };

  // Load puzzle
  const loadPuzzle = async (difficulty, index) => {
    setLoading(true);
    try {
      const paddedIndex = String(index + 1).padStart(3, '0');
      const response = await fetch(
        `${process.env.PUBLIC_URL}/Amharic_Course_Repo_v1/Bible_Sword_Drill_Crosswords/${difficulty}/${difficulty}_${paddedIndex}.json`
      );

      if (!response.ok) throw new Error('Puzzle not found');

      const puzzle = await response.json();
      setCurrentPuzzle(puzzle);

      // Initialize empty user grid
      const emptyGrid = puzzle.grid.map(row =>
        row.split('').map(cell => (cell === '#' ? '#' : ''))
      );
      setUserGrid(emptyGrid);
      setSelectedCell(null);
      setStartTime(Date.now());
      setElapsedTime(0);
      setIncorrectCells([]);

    } catch (error) {
      console.error('Error loading puzzle:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select difficulty and load first incomplete puzzle
  const selectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const completed = completedPuzzles[difficulty] || [];
    const firstIncomplete = completed.length < 100 ? completed.length : 0;
    setCurrentPuzzleIndex(firstIncomplete);
    loadPuzzle(difficulty, firstIncomplete);
  };

  // Find next empty cell in direction
  const findNextCell = (row, col, dir) => {
    if (!currentPuzzle) return null;

    if (dir === 'across') {
      // Move right
      for (let c = col + 1; c < userGrid[row].length; c++) {
        if (userGrid[row][c] !== '#' && currentPuzzle.grid[row][c] !== '#') {
          return { row, col: c };
        }
      }
    } else {
      // Move down
      for (let r = row + 1; r < userGrid.length; r++) {
        if (userGrid[r][col] !== '#' && currentPuzzle.grid[r][col] !== '#') {
          return { row: r, col };
        }
      }
    }
    return null;
  };

  // Handle cell input with auto-advance
  const handleCellInput = (row, col, value) => {
    if (!currentPuzzle || userGrid[row][col] === '#') return;

    const newGrid = userGrid.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value.toUpperCase() : c)) : r
    );
    setUserGrid(newGrid);

    // Auto-advance to next cell if value was entered
    if (value) {
      const nextCell = findNextCell(row, col, direction);
      if (nextCell) {
        setSelectedCell(nextCell);
        // Focus next input
        setTimeout(() => {
          const key = `${nextCell.row}-${nextCell.col}`;
          inputRefs.current[key]?.focus();
        }, 0);
      } else {
        // End of word - blur to close keyboard
        setTimeout(() => {
          document.activeElement?.blur();
        }, 100);
      }
    }
  };

  // Check if puzzle is complete and correct with scoring
  const checkPuzzle = () => {
    if (!currentPuzzle) return;

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Count correct and incorrect cells
    let totalCells = 0;
    let correctCells = 0;
    const wrongCells = [];

    currentPuzzle.grid.forEach((row, i) => {
      row.split('').forEach((cell, j) => {
        if (cell !== '#') {
          totalCells++;
          if (userGrid[i][j] === cell) {
            correctCells++;
          } else {
            wrongCells.push({ row: i, col: j });
          }
        }
      });
    });

    const accuracy = Math.round((correctCells / totalCells) * 100);
    const config = DIFFICULTY_CONFIG[selectedDifficulty];

    // Calculate points based on accuracy and time
    let pointsEarned = config.pointsPerComplete;

    // Time bonus (finish under 5 minutes = bonus)
    const timeBonus = elapsedTime < 300 ? Math.floor(config.pointsPerComplete * 0.2) : 0;

    // Accuracy penalty
    if (accuracy < 100) {
      pointsEarned = Math.floor(pointsEarned * (accuracy / 100));
      // Show wrong answers
      setIncorrectCells(wrongCells);

      // Fill in correct answers
      const correctedGrid = userGrid.map((row, i) =>
        row.map((cell, j) => {
          if (currentPuzzle.grid[i][j] !== '#' && cell !== currentPuzzle.grid[i][j]) {
            return currentPuzzle.grid[i][j];
          }
          return cell;
        })
      );
      setUserGrid(correctedGrid);
    }

    pointsEarned += timeBonus;

    // Mark as completed
    const newCompleted = [...(completedPuzzles[selectedDifficulty] || [])];

    if (!newCompleted.includes(currentPuzzleIndex)) {
      newCompleted.push(currentPuzzleIndex);

      const newProgress = {
        ...completedPuzzles,
        [selectedDifficulty]: newCompleted
      };

      setCompletedPuzzles(newProgress);

      // Award points
      const newPoints = userData.totalPoints + pointsEarned;
      setUserData(prev => ({
        ...prev,
        totalPoints: newPoints,
        crosswordProgress: newProgress
      }));

      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      let message = `${accuracy === 100 ? '🎉 Perfect!' : '✓ Completed!'}\n\n`;
      message += `Accuracy: ${accuracy}%\n`;
      message += `Time: ${timeStr}\n`;
      if (timeBonus > 0) message += `Time Bonus: +${timeBonus}\n`;
      message += `\nPoints Earned: +${pointsEarned}\n`;
      message += `New Balance: ${newPoints} points`;

      alert(message);

      // Load next puzzle after a delay
      setTimeout(() => {
        if (currentPuzzleIndex < 99) {
          setCurrentPuzzleIndex(currentPuzzleIndex + 1);
          loadPuzzle(selectedDifficulty, currentPuzzleIndex + 1);
        } else {
          alert('🏆 Congratulations! You\'ve completed all puzzles in this difficulty!');
          setSelectedDifficulty(null);
        }
      }, accuracy < 100 ? 3000 : 1000);
    }
  };

  // Unlock difficulty with points
  const unlockDifficulty = (difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    if (userData.totalPoints >= config.unlockCost) {
      if (window.confirm(`Unlock ${config.name} crosswords for ${config.unlockCost} points?`)) {
        const newPoints = userData.totalPoints - config.unlockCost;
        setUserData(prev => ({
          ...prev,
          totalPoints: newPoints
        }));
        selectDifficulty(difficulty);
      }
    } else {
      alert(`Not enough points! You need ${config.unlockCost} points to unlock ${config.name} crosswords.`);
    }
  };

  if (!selectedDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Grid3x3 size={32} className="text-amber-400" />
              Biblical Crosswords
            </h1>
            <div className="w-20"></div>
          </div>

          {/* Difficulty Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
              const isUnlocked = isDifficultyUnlocked(key);
              const completed = completedPuzzles[key]?.length || 0;
              const progress = (completed / 100) * 100;

              return (
                <div
                  key={key}
                  className={`bg-slate-800 rounded-xl p-6 border-2 ${
                    isUnlocked ? `border-${config.color}-500/50 hover:border-${config.color}-500` : 'border-slate-700'
                  } transition-all ${isUnlocked ? 'cursor-pointer' : 'opacity-60'}`}
                  onClick={() => isUnlocked && selectDifficulty(key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-2xl font-bold text-${config.color}-400 flex items-center gap-2`}>
                      {isUnlocked ? <CheckCircle size={24} /> : <Lock size={24} />}
                      {config.name}
                    </h3>
                    <span className="text-slate-400">{completed}/100</span>
                  </div>

                  <p className="text-slate-300 mb-4">{config.description}</p>

                  {/* Progress Bar */}
                  <div className="bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                    <div
                      className={`bg-${config.color}-500 h-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Unlock Info */}
                  {!isUnlocked && (
                    <div className="text-sm text-slate-400">
                      {key !== 'beginner' && (
                        <p>
                          Complete {config.requiredToUnlockNext || 0} {
                            key === 'intermediate' ? 'beginner' :
                            key === 'advanced' ? 'intermediate' : 'advanced'
                          } puzzles to unlock
                        </p>
                      )}
                      {config.unlockCost > 0 && (
                        <p className="mt-1">Or unlock for {config.unlockCost} points</p>
                      )}
                    </div>
                  )}

                  {/* Points Reward */}
                  <div className="text-amber-400 font-semibold mt-2">
                    +{config.pointsPerComplete} points per puzzle
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Puzzle View
  if (!currentPuzzle || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2 flex items-center justify-center">
        <div className="text-white text-xl">Loading puzzle...</div>
      </div>
    );
  }

  const config = DIFFICULTY_CONFIG[selectedDifficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedDifficulty(null)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
            Back
          </button>
          <div className="text-center">
            <h2 className={`text-xl sm:text-2xl font-bold text-${config.color}-400`}>
              {config.name} #{currentPuzzleIndex + 1}
            </h2>
            <div className="flex items-center gap-3 justify-center mt-1">
              <Clock size={16} className="text-amber-400" />
              <span className="text-amber-400 font-mono font-bold">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="text-right text-slate-400 text-sm">
            {completedPuzzles[selectedDifficulty]?.length || 0}/100
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-center gap-6">
          {/* Crossword Grid */}
          <div className="bg-slate-800 rounded-xl p-2 sm:p-4 lg:p-6">
            <div className="overflow-x-auto flex justify-center">
              <div className="inline-block">
                {userGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => {
                      const isBlock = cell === '#' || currentPuzzle.grid[rowIndex][colIndex] === '#';
                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                      const isIncorrect = incorrectCells.some(c => c.row === rowIndex && c.col === colIndex);

                      // Find clue number for this cell
                      const acrossClue = currentPuzzle.clues.across.find(c => c.row === rowIndex && c.col === colIndex);
                      const downClue = currentPuzzle.clues.down.find(c => c.row === rowIndex && c.col === colIndex);
                      const clueNumber = acrossClue?.number || downClue?.number;
                      const refKey = `${rowIndex}-${colIndex}`;

                      return (
                        <div
                          key={colIndex}
                          className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 border ${
                            isBlock
                              ? 'bg-slate-900 border-slate-700'
                              : isIncorrect
                              ? 'bg-red-500 border-red-400'
                              : isSelected
                              ? 'bg-amber-500 border-amber-400'
                              : 'bg-white border-slate-400 cursor-pointer hover:bg-slate-100'
                          } flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-xl font-bold`}
                          onClick={() => !isBlock && setSelectedCell({ row: rowIndex, col: colIndex })}
                        >
                          {!isBlock && clueNumber && (
                            <span className="absolute top-0 left-0.5 text-[6px] sm:text-[8px] md:text-[10px] text-blue-600 font-bold">
                              {clueNumber}
                            </span>
                          )}
                          {!isBlock && (
                            <input
                              ref={el => inputRefs.current[refKey] = el}
                              type="text"
                              maxLength={1}
                              value={userGrid[rowIndex][colIndex]}
                              onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                              className="w-full h-full text-center bg-transparent outline-none"
                              style={{ caretColor: 'transparent' }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={checkPuzzle}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              <CheckCircle size={24} className="inline mr-2" />
              Check Puzzle
            </button>
          </div>

          {/* Clues */}
          <div className="bg-slate-800 rounded-xl p-6 space-y-6">
            {/* Across Clues */}
            <div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Across</h3>
              <div className="space-y-2">
                {currentPuzzle.clues.across.map((clue) => (
                  <div key={clue.number} className="text-slate-200">
                    <span className="font-bold text-amber-400">{clue.number}.</span> {clue.clue}
                  </div>
                ))}
              </div>
            </div>

            {/* Down Clues */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Down</h3>
              <div className="space-y-2">
                {currentPuzzle.clues.down.map((clue) => (
                  <div key={clue.number} className="text-slate-200">
                    <span className="font-bold text-blue-400">{clue.number}.</span> {clue.clue}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiblicalCrossword;
