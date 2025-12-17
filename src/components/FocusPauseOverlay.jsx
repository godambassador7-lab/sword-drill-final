import React from 'react';
import { Pause, AlertCircle, Eye } from 'lucide-react';

const FocusPauseOverlay = ({ focusBreaks, secondsAway, examMode }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-md w-full border-2 border-amber-500/50 shadow-2xl animate-pulse">
        {/* Icon */}
        <div className="flex justify-center pt-8">
          <div className="bg-amber-500/20 p-6 rounded-full">
            <Pause size={64} className="text-amber-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center px-6 py-4">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">Session Paused</h2>
          <p className="text-slate-300 text-lg">
            Return to continue
          </p>
        </div>

        {/* Message */}
        <div className="px-6 pb-6 space-y-4">
          <div className="bg-amber-600/20 border border-amber-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-200">
              {examMode ? (
                <span>
                  <strong>Exam Mode:</strong> Timer is still running! Return immediately to minimize time loss.
                </span>
              ) : (
                <span>
                  Your quiz has been paused because you switched away from this window. Click here to resume.
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Focus Breaks:</span>
              <span className="text-red-400 font-bold">{focusBreaks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Time Away:</span>
              <span className="text-red-400 font-bold">{secondsAway}s</span>
            </div>
          </div>

          {/* Impact Warning */}
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
            <Eye size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-200">
              This affects your Focus Integrity Score and may reduce bonus points.
            </div>
          </div>

          {/* Return Instruction */}
          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              Click anywhere to resume
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusPauseOverlay;
