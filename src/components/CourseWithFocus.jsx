import React, { useState, useEffect } from 'react';
import FocusCovenant from './FocusCovenant';
import GuidedAccessInstructions from './GuidedAccessInstructions';
import FocusPauseOverlay from './FocusPauseOverlay';
import useFocusTracking from '../hooks/useFocusTracking';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Wrapper component that adds focus covenant and tracking to courses
 *
 * @param {Object} props
 * @param {React.Component} props.CourseComponent - The course component to wrap
 * @param {Object} props.courseProps - Props to pass to the course component
 * @param {string} props.courseName - Name of the course (for tracking)
 * @param {boolean} props.isExam - Whether this is a final exam (stricter limits)
 * @param {Function} props.onExit - Called when user exits or is blocked
 */
const CourseWithFocus = ({
  CourseComponent,
  courseProps,
  courseName = 'course',
  isExam = false,
  onExit
}) => {
  const [showCovenant, setShowCovenant] = useState(true);
  const [showGuidedAccess, setShowGuidedAccess] = useState(false);
  const [courseStarted, setCourseStarted] = useState(false);
  const [focusEnabled, setFocusEnabled] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  // Focus break limits
  const MAX_BREAKS_REGULAR = 5;
  const MAX_BREAKS_EXAM = 2;
  const maxBreaks = isExam ? MAX_BREAKS_EXAM : MAX_BREAKS_REGULAR;

  // Use focus tracking hook
  const focusTracking = useFocusTracking(focusEnabled && courseStarted, isExam);

  // Check for 1-hour cooldown
  useEffect(() => {
    const lastCovenantTime = localStorage.getItem('lastFocusCovenantTime');
    const oneHourInMs = 60 * 60 * 1000;

    if (lastCovenantTime) {
      const timeSinceLastCovenant = Date.now() - parseInt(lastCovenantTime);
      if (timeSinceLastCovenant < oneHourInMs) {
        // Skip covenant, go straight to guided access
        setShowCovenant(false);
        setShowGuidedAccess(true);
      }
    }
  }, []);

  // Monitor focus breaks and block if exceeded
  useEffect(() => {
    if (focusTracking.focusBreakCount > maxBreaks) {
      setShowBlockedModal(true);
      setFocusEnabled(false);
      setCourseStarted(false);
    }
  }, [focusTracking.focusBreakCount, maxBreaks]);

  const handleCovenantAccept = () => {
    localStorage.setItem('lastFocusCovenantTime', Date.now().toString());
    setShowCovenant(false);
    setShowGuidedAccess(true);
  };

  const handleCovenantCancel = () => {
    if (onExit) onExit();
  };

  const handleGuidedAccessConfirm = () => {
    setShowGuidedAccess(false);
    setFocusEnabled(true);
    setCourseStarted(true);
  };

  const handleGuidedAccessSkip = () => {
    setShowGuidedAccess(false);
    setFocusEnabled(true);
    setCourseStarted(true);
  };

  const handleBlockedExit = () => {
    focusTracking.reset();
    if (onExit) onExit();
  };

  // Show covenant first
  if (showCovenant) {
    return (
      <FocusCovenant
        onAccept={handleCovenantAccept}
        onCancel={handleCovenantCancel}
        mode={isExam ? 'exam' : 'course'}
      />
    );
  }

  // Show guided access instructions
  if (showGuidedAccess) {
    return (
      <GuidedAccessInstructions
        onConfirm={handleGuidedAccessConfirm}
        onSkip={handleGuidedAccessSkip}
      />
    );
  }

  // Show blocked modal if too many breaks
  if (showBlockedModal) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-lg w-full border-2 border-red-500/50 shadow-2xl">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-xl">
            <div className="flex items-center gap-3 justify-center">
              <AlertTriangle size={40} className="text-white" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Focus Limit Exceeded</h2>
                <p className="text-red-100 text-sm mt-1">Too many focus breaks detected</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-center">
                You've exceeded the maximum allowed focus breaks ({maxBreaks}) for this {isExam ? 'exam' : 'course session'}.
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-400 mb-2">Focus Breaks Detected:</h3>
              <div className="text-slate-200 text-lg font-bold text-center">
                {focusTracking.focusBreakCount} / {maxBreaks}
              </div>
              <div className="text-slate-400 text-sm text-center mt-1">
                Time away: {focusTracking.totalSecondsAway}s
              </div>
            </div>

            <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-2">To maintain integrity:</h3>
              <ul className="text-sm text-blue-200 space-y-1 ml-4">
                <li>• Close all unnecessary apps before starting</li>
                <li>• Use guided access / screen pinning</li>
                <li>• Enable Do Not Disturb mode</li>
                <li>• Study in a distraction-free environment</li>
              </ul>
            </div>

            <button
              onClick={handleBlockedExit}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Exit and Try Again Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render course with focus tracking
  return (
    <>
      <CourseComponent
        {...courseProps}
        focusTracking={focusTracking}
      />

      {/* Focus Pause Overlay */}
      {focusEnabled && !focusTracking.hasFocus && courseStarted && (
        <div onClick={() => window.focus()}>
          <FocusPauseOverlay
            focusBreaks={focusTracking.focusBreakCount}
            secondsAway={focusTracking.totalSecondsAway}
            examMode={isExam}
          />
        </div>
      )}

      {/* Warning when approaching limit */}
      {focusTracking.focusBreakCount >= maxBreaks - 1 && focusTracking.focusBreakCount < maxBreaks && (
        <div className="fixed top-4 right-4 z-40 max-w-sm">
          <div className="bg-amber-600 border-2 border-amber-400 rounded-lg p-4 shadow-xl animate-pulse">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-white flex-shrink-0" />
              <div>
                <div className="font-bold text-white mb-1">Warning!</div>
                <div className="text-amber-100 text-sm">
                  You have {maxBreaks - focusTracking.focusBreakCount} focus break{maxBreaks - focusTracking.focusBreakCount === 1 ? '' : 's'} remaining before being blocked.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseWithFocus;
