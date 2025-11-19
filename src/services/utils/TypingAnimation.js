import React, { useState, useEffect, useRef } from 'react';

/**
 * TypingAnimation Component
 *
 * Simulates ChatGPT-style streaming text by gradually revealing text
 * with a typing effect.
 *
 * @param {string} text - The full text to display
 * @param {number} speed - Typing speed in milliseconds per character (default: 20)
 * @param {function} onComplete - Callback when typing animation completes
 */
const TypingAnimation = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timer = setTimeout(() => {
        // Add next character
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);

        // Auto-scroll to keep text visible
        if (textRef.current) {
          textRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length && !isComplete) {
      // Animation complete
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span ref={textRef} className="typing-text">
      {displayedText}
      {!isComplete && <span className="typing-cursor animate-pulse">▊</span>}
    </span>
  );
};

export default TypingAnimation;
