/**
 * LoadingScreen Component
 *
 * Dynamic loading screen with animated percentage bar and gradient colors
 */

import React, { useState, useEffect } from 'react';
import { Flame, Book, Trophy } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingStages = [
    { percent: 0, text: 'Initializing...' },
    { percent: 15, text: 'Loading Scripture...' },
    { percent: 30, text: 'Preparing Quizzes...' },
    { percent: 45, text: 'Loading User Data...' },
    { percent: 60, text: 'Setting up Courses...' },
    { percent: 75, text: 'Configuring Calendar...' },
    { percent: 90, text: 'Finalizing...' },
    { percent: 100, text: 'Ready!' },
  ];

  useEffect(() => {
    let currentStage = 0;

    const progressInterval = setInterval(() => {
      if (currentStage < loadingStages.length) {
        const stage = loadingStages[currentStage];
        setProgress(stage.percent);
        setLoadingText(stage.text);
        currentStage++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 300); // Each stage takes 300ms

    return () => clearInterval(progressInterval);
  }, []);

  // Calculate gradient colors based on progress
  const getGradientColors = () => {
    if (progress < 25) {
      return 'from-red-500 via-orange-500 to-yellow-500';
    } else if (progress < 50) {
      return 'from-orange-500 via-yellow-500 to-green-500';
    } else if (progress < 75) {
      return 'from-yellow-500 via-green-500 to-blue-500';
    } else if (progress < 100) {
      return 'from-green-500 via-blue-500 to-purple-500';
    } else {
      return 'from-blue-500 via-purple-500 to-pink-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center z-50">
      <div className="max-w-md w-full px-8">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative inline-block" style={{ width: '48px', height: '64px' }}>
              {/* Animated Flame */}
              <svg
                width="48"
                height="64"
                viewBox="0 0 24 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 animate-flame-outer"
              >
                <path
                  d="M12 2C10 5 8 8 8 12C8 13.5 8.5 15 9.5 16.5C8 15.5 6.5 13.5 6.5 11C4 14 3 18 3 22C3 27.5 7 32 12 32C17 32 21 27.5 21 22C21 17 19 13 16.5 10C17 13 16.5 16 14.5 18C15 15 14 11 12 2Z"
                  fill="#f97316"
                  opacity="0.9"
                />
              </svg>
              <svg
                width="40"
                height="56"
                viewBox="0 0 20 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute animate-flame-middle"
                style={{ left: '4px', top: '4px', animationDelay: '0.1s' }}
              >
                <path
                  d="M10 1C8.5 3.5 7 6 7 9C7 10.5 7.5 11.5 8 12.5C7 12 6 10.5 6 9C4 11.5 3 14 3 17.5C3 22 6.5 26 10 26C13.5 26 17 22 17 17.5C17 13.5 15.5 10.5 13.5 8C14 10.5 13.5 12.5 12 14C12.5 11.5 11.5 8 10 1Z"
                  fill="#fbbf24"
                  opacity="0.85"
                />
              </svg>
              <svg
                width="28"
                height="44"
                viewBox="0 0 14 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute animate-flame-inner"
                style={{ left: '10px', top: '12px', animationDelay: '0.2s' }}
              >
                <path
                  d="M7 1C6 2.5 5 4.5 5 6.5C5 7.5 5.5 8.5 6 9C5.5 8.5 5 7.5 5 6.5C3.5 8.5 3 10.5 3 13C3 16.866 5.134 20 7 20C8.866 20 12 16.866 12 13C12 10 11 8 9.5 6.5C10 8 9.5 9.5 8.5 10.5C9 8.5 8 5.5 7 1Z"
                  fill="#fde047"
                  opacity="0.95"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sword Drill</h1>
          <p className="text-slate-300 text-sm">Bible Memory Training</p>
        </div>

        {/* Loading Text */}
        <div className="text-center mb-4">
          <p className="text-white text-lg font-semibold animate-pulse">{loadingText}</p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-3 bg-slate-700/50 rounded-full overflow-hidden shadow-inner mb-2">
          {/* Gradient Progress Bar */}
          <div
            className={`h-full bg-gradient-to-r ${getGradientColors()} transition-all duration-300 ease-out relative overflow-hidden`}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>

          {/* Glow Effect */}
          <div
            className={`absolute top-0 h-full bg-gradient-to-r ${getGradientColors()} blur-sm opacity-50 transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Percentage */}
        <div className="text-center">
          <span className={`text-2xl font-bold bg-gradient-to-r ${getGradientColors()} bg-clip-text text-transparent`}>
            {progress}%
          </span>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingScreen;
