import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Interactive Walkthrough Tutorial Component
 *
 * Provides a step-by-step guided tour of the app with spotlights on key features.
 * Shows gray overlay on background except for the highlighted element.
 * Includes back, forward, and exit navigation.
 */
const WalkthroughTutorial = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightPosition, setSpotlightPosition] = useState(null);
  const overlayRef = useRef(null);

  // Tutorial steps - each highlights a specific feature
  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Sword Drill!',
      description: 'Welcome to your journey of mastering God\'s Word! This tutorial will show you all the amazing features available to help you learn and memorize Scripture.',
      selector: null, // No spotlight for welcome
      position: 'center'
    },
    {
      id: 'verse-display',
      title: 'Daily Verse Challenge',
      description: 'This is your main training area! Each day you\'ll get a new verse to memorize. Read it carefully, then test yourself by typing it from memory. The more accurate you are, the more points you earn!',
      selector: '.verse-display-card, [data-tutorial="verse-display"]',
      position: 'center'
    },
    {
      id: 'points-display',
      title: 'Your Points & Progress',
      description: 'Track your progress here! You earn points for correct answers, maintaining streaks, and completing challenges. Points unlock new features and show how far you\'ve come in your Scripture mastery journey.',
      selector: '[data-tutorial="points-display"], .points-counter',
      position: 'top'
    },
    {
      id: 'streak-counter',
      title: 'Daily Streak',
      description: 'Your streak shows how many consecutive days you\'ve practiced! Maintaining a streak multiplies your points and unlocks special rewards. Come back daily to keep it going!',
      selector: '[data-tutorial="streak"], .streak-display',
      position: 'top'
    },
    {
      id: 'menu-button',
      title: 'Main Menu',
      description: 'Tap this button to access all features! The menu contains practice modes, study tools, courses, store, and settings. Everything you need is just a tap away.',
      selector: '[data-tutorial="menu-button"], .menu-button',
      position: 'left'
    },
    {
      id: 'bible-reader',
      title: 'Bible Reader',
      description: 'Read the Bible in multiple translations! You can switch between KJV, ASV, WEB, and more. Perfect for studying context around the verses you\'re memorizing.',
      selector: '[data-tutorial="bible-reader"]',
      position: 'center'
    },
    {
      id: 'verse-of-day',
      title: 'Verse of the Day',
      description: 'Get daily inspiration with a specially selected verse! You can share these verses with friends, save them to your personal collection, or use them as daily meditation.',
      selector: '[data-tutorial="verse-of-day"], .daily-verse-card',
      position: 'center'
    },
    {
      id: 'calendar',
      title: 'Activity Calendar',
      description: 'Track your practice history! The calendar shows which days you\'ve practiced, your streaks, and special events like feast days. Green dots mean you practiced that day!',
      selector: '[data-tutorial="calendar"], .calendar-icon',
      position: 'top'
    },
    {
      id: 'missions',
      title: 'Daily Missions',
      description: 'Complete daily challenges to earn bonus points! Missions refresh every day and include tasks like completing quizzes, maintaining streaks, and trying new features.',
      selector: '[data-tutorial="missions"]',
      position: 'center'
    },
    {
      id: 'store',
      title: 'Point Store',
      description: 'Spend your hard-earned points here! Unlock power-ups like Double Points, Streak Freeze, translations, courses, and special Bible tools. The more you practice, the more you can unlock!',
      selector: '[data-tutorial="store"]',
      position: 'center'
    },
    {
      id: 'practice-modes',
      title: 'Practice Modes',
      description: 'Multiple ways to practice! Try Verse Scramble, Book Order Quiz, Sword Drill Ultimate, Spelling Bee, and more. Each mode helps you learn Scripture in a unique and fun way.',
      selector: '[data-tutorial="practice-modes"]',
      position: 'center'
    },
    {
      id: 'study-tools',
      title: 'Study Tools',
      description: 'Deep dive into Scripture! Access Greek and Hebrew lexicons, Smith\'s Bible Dictionary, Biblical Bloodlines (family trees), and study plans to enhance your understanding.',
      selector: '[data-tutorial="study-tools"]',
      position: 'center'
    },
    {
      id: 'courses',
      title: 'Biblical Courses',
      description: 'Take comprehensive courses on Biblical topics! Learn Koine Greek, Ancient Hebrew, Church History, Theology, and more. Complete courses to earn certificates and bonus points.',
      selector: '[data-tutorial="courses"]',
      position: 'center'
    },
    {
      id: 'settings',
      title: 'Settings & Customization',
      description: 'Customize your experience! Change Bible translations, adjust sound settings, download Bibles for offline use, enable simplified language mode, and personalize your username.',
      selector: '[data-tutorial="settings"]',
      position: 'center'
    },
    {
      id: 'completion',
      title: 'You\'re Ready!',
      description: 'You now know the basics of Sword Drill! Start your journey by memorizing today\'s verse. Remember: consistency is key. Practice daily, maintain your streak, and watch your Scripture knowledge grow. May God bless your studies!',
      selector: null,
      position: 'center'
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  // Calculate spotlight position when step changes
  useEffect(() => {
    if (currentStepData.selector) {
      const element = document.querySelector(currentStepData.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setSpotlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setSpotlightPosition(null);
      }
    } else {
      setSpotlightPosition(null);
    }
  }, [currentStep, currentStepData.selector]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit the tutorial?')) {
      onClose();
    }
  };

  // Get tooltip position based on step preference
  const getTooltipPosition = () => {
    if (!spotlightPosition) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const padding = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 200;

    switch (currentStepData.position) {
      case 'top':
        return {
          top: spotlightPosition.top - tooltipHeight - padding,
          left: spotlightPosition.left + spotlightPosition.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: spotlightPosition.top + spotlightPosition.height + padding,
          left: spotlightPosition.left + spotlightPosition.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: spotlightPosition.top + spotlightPosition.height / 2,
          left: spotlightPosition.left - tooltipWidth - padding,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: spotlightPosition.top + spotlightPosition.height / 2,
          left: spotlightPosition.left + spotlightPosition.width + padding,
          transform: 'translateY(-50%)'
        };
      default: // center
        return {
          top: spotlightPosition.top + spotlightPosition.height + padding,
          left: spotlightPosition.left + spotlightPosition.width / 2,
          transform: 'translateX(-50%)'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Gray overlay with spotlight cutout */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/80 transition-all duration-300"
        style={{
          clipPath: spotlightPosition
            ? `polygon(
                0 0,
                0 100%,
                ${spotlightPosition.left}px 100%,
                ${spotlightPosition.left}px ${spotlightPosition.top}px,
                ${spotlightPosition.left + spotlightPosition.width}px ${spotlightPosition.top}px,
                ${spotlightPosition.left + spotlightPosition.width}px ${spotlightPosition.top + spotlightPosition.height}px,
                ${spotlightPosition.left}px ${spotlightPosition.top + spotlightPosition.height}px,
                ${spotlightPosition.left}px 100%,
                100% 100%,
                100% 0
              )`
            : 'none'
        }}
      />

      {/* Spotlight highlight border */}
      {spotlightPosition && (
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            top: spotlightPosition.top - 4,
            left: spotlightPosition.left - 4,
            width: spotlightPosition.width + 8,
            height: spotlightPosition.height + 8,
            border: '4px solid #f59e0b',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.6)',
            animation: 'pulse-border 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Tutorial tooltip */}
      <div
        className="absolute bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-md w-11/12 sm:w-96 transition-all duration-300"
        style={getTooltipPosition()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-t-xl border-b-2 border-amber-500/30 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{currentStepData.title}</h3>
            <p className="text-amber-100 text-xs mt-1">
              Step {currentStep + 1} of {tutorialSteps.length}
            </p>
          </div>
          <button
            onClick={handleExit}
            className="text-white/80 hover:text-white transition-colors ml-2"
            aria-label="Exit tutorial"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-200 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-amber-500'
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex-1"
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all flex-1"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  Finish
                  <X size={20} />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.6);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.2), 0 0 40px rgba(245, 158, 11, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default WalkthroughTutorial;
