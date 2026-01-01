import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Interactive Walkthrough Tutorial Component
 *
 * Provides a step-by-step guided tour of the app with spotlights on key features.
 * Shows gray overlay on background except for the highlighted element.
 * Includes back, forward, and exit navigation.
 *
 * @param {Function} onClose - Callback to close the walkthrough
 * @param {Function} onNavigate - Callback to navigate to different views (currentView setter)
 * @param {Function} onOpenMenu - Callback to open the menu
 */
const WalkthroughTutorial = ({ onClose, onNavigate, onOpenMenu }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightPosition, setSpotlightPosition] = useState(null);
  const overlayRef = useRef(null);

  // Tutorial steps - each highlights a specific feature
  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Sword Drill!',
      description: 'Welcome to your journey of mastering God\'s Word! This tutorial will show you all the amazing features available to help you learn and memorize Scripture. Let\'s start by going to the home page!',
      selector: null, // No spotlight for welcome
      position: 'center',
      navigate: 'home' // Go to home page
    },
    {
      id: 'points-display',
      title: 'Your Points & Progress',
      description: 'Track your progress here! You earn points for correct answers, maintaining streaks, and completing challenges. Points unlock new features and show how far you\'ve come in your Scripture mastery journey.',
      selector: '[data-tutorial="points-display"]',
      position: 'top',
      navigate: 'home'
    },
    {
      id: 'streak-counter',
      title: 'Daily Streak',
      description: 'Your streak shows how many consecutive days you\'ve practiced! Maintaining a streak multiplies your points and unlocks special rewards. Come back daily to keep it going!',
      selector: '[data-tutorial="streak"]',
      position: 'top',
      navigate: 'home'
    },
    {
      id: 'currencies',
      title: 'Understanding Currencies',
      description: 'Sword Drill has multiple currencies! Manna (shown here) resets daily - use it for daily power-ups. You\'ll also earn Talents (long-term currency), Keys of Understanding (earned from mistakes to unlock insights), and Scrolls (boost your points). Each serves a unique purpose in your journey!',
      selector: '[data-tutorial="currencies"]',
      position: 'top',
      navigate: 'home'
    },
    {
      id: 'menu-button',
      title: 'Main Menu',
      description: 'Tap this button to access all features! The menu contains practice modes, study tools, courses, store, and settings. Everything you need is just a tap away.',
      selector: '[data-tutorial="menu-button"]',
      position: 'left',
      navigate: 'home'
    },
    {
      id: 'verse-of-day',
      title: 'Verse of the Day',
      description: 'Get daily inspiration with a specially selected verse! You can share these verses with friends, save them to your personal collection, or use them as daily meditation.',
      selector: '[data-tutorial="verse-of-day"]',
      position: 'center',
      navigate: 'home'
    },
    {
      id: 'quiz-modes',
      title: 'Practice Quiz Modes',
      description: 'Test your Scripture knowledge with various quiz types! Try Fill in the Blank, Multiple Choice, True/False, and more. Each mode helps you memorize verses in different ways. The more you practice, the stronger your memory becomes!',
      selector: '[data-tutorial="quiz-modes"]',
      position: 'center',
      navigate: 'home'
    },
    {
      id: 'verse-bank',
      title: 'Personal Verse Bank',
      description: 'Save your favorite verses here! Build your own collection of meaningful scriptures and practice them anytime. This is your personal library of verses that speak to your heart.',
      selector: '[data-tutorial="verse-bank"]',
      position: 'center',
      navigate: 'home'
    },
    {
      id: 'daily-rewards',
      title: 'Daily Rewards',
      description: 'Open the daily chest for amazing rewards! Come back every day to collect Manna, Talents, power-ups, and special bonuses. The chest resets daily, so don\'t miss out!',
      selector: '[data-tutorial="daily-rewards"]',
      position: 'right',
      navigate: 'home',
      openMenu: true
    },
    {
      id: 'academy',
      title: 'Sword Drill Academy',
      description: 'Take your learning to the next level! The Academy offers comprehensive courses on Biblical history, theology, archaeology, and more. Complete courses to earn certificates and deepen your understanding of Scripture.',
      selector: '[data-tutorial="academy"]',
      position: 'right',
      navigate: 'home',
      openMenu: true
    },
    {
      id: 'points-bank',
      title: 'Points Bank Exchange',
      description: 'Invest your points wisely! Convert points to Talents (which grow 2% per week over 25 days), redeem Keys of Understanding, and track all your transactions. This is where you manage your spiritual economy and grow your resources!',
      selector: '[data-tutorial="points-bank"]',
      position: 'right',
      navigate: 'home',
      openMenu: true
    },
    {
      id: 'store',
      title: 'Power-Up Shop',
      description: 'Spend your hard-earned points here! Unlock power-ups like Double Points, Streak Freeze, and other boosts. The more you practice, the more you can unlock!',
      selector: '[data-tutorial="store"]',
      position: 'center',
      navigate: 'powerup-shop'
    },
    {
      id: 'settings',
      title: 'Settings & Customization',
      description: 'Customize your experience! Adjust sound settings, download Bibles for offline use, and personalize your username.',
      selector: '[data-tutorial="settings"]',
      position: 'center',
      navigate: 'settings'
    },
    {
      id: 'completion',
      title: 'You\'re Ready!',
      description: 'You now know all the features of Sword Drill! Start your journey by memorizing today\'s verse. Remember: consistency is key. Practice daily, maintain your streak, and watch your Scripture knowledge grow. May God bless your studies!',
      selector: null,
      position: 'center',
      navigate: 'home'
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  // Handle navigation when step changes
  useEffect(() => {
    if (currentStepData.navigate && onNavigate) {
      // Navigate to the specified view (don't close tutorial help - we want walkthrough to persist)
      onNavigate(currentStepData.navigate);
    }

    // Open menu if this step requires it
    if (currentStepData.openMenu && onOpenMenu) {
      // Delay slightly to allow navigation to complete first
      setTimeout(() => {
        onOpenMenu(true);
      }, 150);
    }
  }, [currentStep, currentStepData.navigate, currentStepData.openMenu, onNavigate, onOpenMenu]);

  // Calculate spotlight position when step changes
  useEffect(() => {
    const updatePosition = () => {
      if (currentStepData.selector) {
        const element = document.querySelector(currentStepData.selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          setSpotlightPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        } else {
          setSpotlightPosition(null);
        }
      } else {
        setSpotlightPosition(null);
      }
    };

    // Add delay to allow DOM to update after navigation
    const timer = setTimeout(() => {
      if (currentStepData.selector) {
        const element = document.querySelector(currentStepData.selector);
        if (element) {
          // Scroll element into view first
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Wait for scroll to complete, then calculate position
          setTimeout(updatePosition, 300);
        } else {
          setSpotlightPosition(null);
        }
      } else {
        setSpotlightPosition(null);
      }
    }, 100);

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
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
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate available space in each direction
    const spaceAbove = spotlightPosition.top;
    const spaceBelow = viewportHeight - (spotlightPosition.top + spotlightPosition.height);
    const spaceLeft = spotlightPosition.left;
    const spaceRight = viewportWidth - (spotlightPosition.left + spotlightPosition.width);

    let position = currentStepData.position;

    // Auto-adjust position if preferred position doesn't have enough space
    if (position === 'top' && spaceAbove < 250) {
      position = 'bottom';
    }
    if (position === 'bottom' && spaceBelow < 250) {
      position = 'top';
    }
    if (position === 'left' && spaceLeft < 450) {
      position = 'right';
    }
    if (position === 'right' && spaceRight < 450) {
      position = 'left';
    }

    switch (position) {
      case 'top':
        return {
          bottom: viewportHeight - spotlightPosition.top + padding,
          left: Math.max(10, Math.min(viewportWidth - 410, spotlightPosition.left + spotlightPosition.width / 2 - 200)),
          transform: 'none'
        };
      case 'bottom':
        return {
          top: spotlightPosition.top + spotlightPosition.height + padding,
          left: Math.max(10, Math.min(viewportWidth - 410, spotlightPosition.left + spotlightPosition.width / 2 - 200)),
          transform: 'none'
        };
      case 'left':
        return {
          top: Math.max(10, Math.min(viewportHeight - 250, spotlightPosition.top + spotlightPosition.height / 2 - 125)),
          right: viewportWidth - spotlightPosition.left + padding,
          transform: 'none'
        };
      case 'right':
        return {
          top: Math.max(10, Math.min(viewportHeight - 250, spotlightPosition.top + spotlightPosition.height / 2 - 125)),
          left: spotlightPosition.left + spotlightPosition.width + padding,
          transform: 'none'
        };
      default: // center
        return {
          top: spotlightPosition.top + spotlightPosition.height + padding,
          left: Math.max(10, Math.min(viewportWidth - 410, spotlightPosition.left + spotlightPosition.width / 2 - 200)),
          transform: 'none'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
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
          className="absolute pointer-events-none transition-all duration-300 z-10"
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
        className="absolute bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-md w-11/12 sm:w-96 transition-all duration-300 pointer-events-auto z-20"
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
