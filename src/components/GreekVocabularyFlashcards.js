import React, { useState, useEffect } from 'react';
import { koineVocabulary } from '../data/koineGreekComprehensive';
import { X, ChevronLeft, ChevronRight, RotateCw, Check, BookOpen } from 'lucide-react';

/**
 * Greek Vocabulary Flashcards - Interactive flashcard system with spaced repetition
 */
const GreekVocabularyFlashcards = ({ level = 'beginner', onComplete, onCancel }) => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState(new Set());
  const [reviewQueue, setReviewQueue] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    cardsReviewed: 0,
    correctCount: 0,
    startTime: Date.now()
  });

  // Load vocabulary for the selected level
  useEffect(() => {
    const vocabulary = koineVocabulary[level] || koineVocabulary.beginner;
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setReviewQueue(shuffled.map((_, i) => i));
  }, [level]);

  const currentCard = cards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = () => {
    setMasteredCards(prev => new Set([...prev, currentCardIndex]));
    setSessionStats(prev => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1,
      correctCount: prev.correctCount + 1
    }));
    nextCard();
  };

  const handleDontKnow = () => {
    // Add card back to review queue for spaced repetition
    setReviewQueue(prev => [...prev, currentCardIndex]);
    setSessionStats(prev => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1
    }));
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);

    if (reviewQueue.length > 0) {
      const nextIndex = reviewQueue[0];
      setReviewQueue(prev => prev.slice(1));
      setCurrentCardIndex(nextIndex);
    } else {
      // Session complete
      const timeSpent = Math.floor((Date.now() - sessionStats.startTime) / 1000);
      onComplete({
        ...sessionStats,
        totalCards: cards.length,
        masteredCount: masteredCards.size,
        timeSpent,
        level
      });
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setMasteredCards(new Set());
    setReviewQueue(cards.map((_, i) => i));
    setSessionStats({
      cardsReviewed: 0,
      correctCount: 0,
      startTime: Date.now()
    });
  };

  if (!currentCard) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading flashcards...</div>
      </div>
    );
  }

  const progress = ((sessionStats.cardsReviewed / cards.length) * 100).toFixed(0);
  const accuracy = sessionStats.cardsReviewed > 0
    ? ((sessionStats.correctCount / sessionStats.cardsReviewed) * 100).toFixed(0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-3xl w-full border-2 border-purple-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
              <BookOpen size={28} />
              Greek Vocabulary Flashcards
            </h2>
            <p className="text-slate-400 text-sm capitalize">{level} Level</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Progress</div>
            <div className="text-purple-300 text-xl font-bold">{progress}%</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Mastered</div>
            <div className="text-green-300 text-xl font-bold">{masteredCards.size}/{cards.length}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Accuracy</div>
            <div className="text-blue-300 text-xl font-bold">{accuracy}%</div>
          </div>
        </div>

        {/* Flashcard */}
        <div
          className="relative h-80 mb-6 cursor-pointer"
          onClick={handleFlip}
          style={{ perspective: '1000px' }}
        >
          <div
            className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of card - Greek word */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-slate-300 text-sm mb-4 uppercase tracking-wider">Greek Word</div>
              <div className="text-white text-6xl font-bold mb-4">{currentCard.greek}</div>
              <div className="text-purple-200 text-xl italic">{currentCard.transliteration}</div>
              <div className="mt-8 text-slate-300 text-sm">Click to flip</div>
            </div>

            {/* Back of card - English translation */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-slate-300 text-sm mb-4 uppercase tracking-wider">English Meaning</div>
              <div className="text-white text-5xl font-bold mb-4">{currentCard.english}</div>
              <div className="text-blue-200 text-xl mb-2">{currentCard.transliteration}</div>
              <div className="bg-blue-800/50 px-4 py-2 rounded-lg">
                <span className="text-blue-200 text-sm capitalize">{currentCard.category}</span>
              </div>
              <div className="mt-8 text-slate-300 text-sm">Click to flip back</div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="text-slate-400">
            Card {currentCardIndex + 1} of {cards.length}
          </div>

          <button
            onClick={resetSession}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
          >
            <RotateCw size={20} />
            Reset
          </button>
        </div>

        {/* Knowledge Assessment Buttons */}
        {isFlipped && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDontKnow}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              <X size={20} />
              Need More Practice
            </button>
            <button
              onClick={handleKnow}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              <Check size={20} />
              I Know This!
            </button>
          </div>
        )}

        {!isFlipped && (
          <div className="text-center text-slate-400 text-sm">
            Click the card to reveal the answer
          </div>
        )}
      </div>

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default GreekVocabularyFlashcards;
