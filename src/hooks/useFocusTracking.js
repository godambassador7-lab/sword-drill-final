import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for tracking focus integrity during quiz/course sessions
 * @param {boolean} isActive - Whether focus tracking is currently active
 * @param {boolean} examMode - If true, timer continues even when focus is lost
 * @returns {object} Focus tracking state and controls
 */
export const useFocusTracking = (isActive = false, examMode = false) => {
  const [hasFocus, setHasFocus] = useState(true);
  const [focusBreakCount, setFocusBreakCount] = useState(0);
  const [totalSecondsAway, setTotalSecondsAway] = useState(0);
  const [focusBreakTimestamps, setFocusBreakTimestamps] = useState([]);

  const focusLostAt = useRef(null);
  const timerInterval = useRef(null);

  // Calculate focus integrity score
  const calculateIntegrityScore = useCallback(() => {
    const breakPenalty = 10; // -10 points per focus break
    const timePenalty = 0.5; // -0.5 points per second away

    const breakDeduction = focusBreakCount * breakPenalty;
    const timeDeduction = totalSecondsAway * timePenalty;

    const score = Math.max(0, Math.min(100, 100 - breakDeduction - timeDeduction));

    return {
      score: Math.round(score),
      breakdown: {
        base: 100,
        breakDeduction: -breakDeduction,
        timeDeduction: -Math.round(timeDeduction),
        final: Math.round(score)
      },
      tier: score >= 95 ? 'elite' : score >= 85 ? 'excellent' : score >= 70 ? 'good' : 'fair'
    };
  }, [focusBreakCount, totalSecondsAway]);

  // Handle visibility change (tab switching)
  const handleVisibilityChange = useCallback(() => {
    if (!isActive) return;

    if (document.hidden) {
      // Lost focus
      setHasFocus(false);
      focusLostAt.current = Date.now();
      setFocusBreakCount(prev => prev + 1);
      setFocusBreakTimestamps(prev => [...prev, { lostAt: Date.now(), type: 'visibility' }]);

      // Start tracking time away
      timerInterval.current = setInterval(() => {
        setTotalSecondsAway(prev => prev + 1);
      }, 1000);
    } else {
      // Regained focus
      setHasFocus(true);

      if (focusLostAt.current) {
        const timeAway = Math.floor((Date.now() - focusLostAt.current) / 1000);
        setTotalSecondsAway(prev => prev + timeAway);

        // Update last timestamp with regained time
        setFocusBreakTimestamps(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].regainedAt = Date.now();
            updated[updated.length - 1].duration = timeAway;
          }
          return updated;
        });

        focusLostAt.current = null;
      }

      // Stop timer
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    }
  }, [isActive]);

  // Handle window blur (window switching)
  const handleBlur = useCallback(() => {
    if (!isActive || document.hidden) return; // Already handled by visibility

    setHasFocus(false);
    focusLostAt.current = Date.now();
    setFocusBreakCount(prev => prev + 1);
    setFocusBreakTimestamps(prev => [...prev, { lostAt: Date.now(), type: 'blur' }]);

    // Start tracking time away
    timerInterval.current = setInterval(() => {
      setTotalSecondsAway(prev => prev + 1);
    }, 1000);
  }, [isActive]);

  // Handle window focus (window regained)
  const handleFocus = useCallback(() => {
    if (!isActive || !document.hidden) {
      setHasFocus(true);

      if (focusLostAt.current) {
        const timeAway = Math.floor((Date.now() - focusLostAt.current) / 1000);
        setTotalSecondsAway(prev => prev + timeAway);

        setFocusBreakTimestamps(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].regainedAt = Date.now();
            updated[updated.length - 1].duration = timeAway;
          }
          return updated;
        });

        focusLostAt.current = null;
      }

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    }
  }, [isActive]);

  // Setup listeners
  useEffect(() => {
    if (!isActive) {
      // Clean up
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      return;
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [isActive, handleVisibilityChange, handleBlur, handleFocus]);

  // Reset function
  const reset = useCallback(() => {
    setHasFocus(true);
    setFocusBreakCount(0);
    setTotalSecondsAway(0);
    setFocusBreakTimestamps([]);
    focusLostAt.current = null;

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  }, []);

  return {
    hasFocus,
    focusBreakCount,
    totalSecondsAway,
    focusBreakTimestamps,
    integrityScore: calculateIntegrityScore(),
    reset,
    isPaused: !hasFocus && !examMode // In exam mode, we don't pause
  };
};

export default useFocusTracking;
