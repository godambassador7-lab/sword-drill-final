import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Lock, Unlock } from 'lucide-react';

const FocusCovenant = ({ onAccept, onCancel, mode = 'quiz' }) => {
  const [checks, setChecks] = useState({
    closedApps: false,
    noSwitching: false,
    integrity: false
  });

  const allChecked = checks.closedApps && checks.noSwitching && checks.integrity;

  const handleCheckChange = (key) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAccept = () => {
    if (allChecked) {
      onAccept();
    }
  };

  const modeText = {
    quiz: 'Quiz',
    course: 'Course',
    exam: 'Exam'
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full border-2 border-amber-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-xl">
          <div className="flex items-center gap-3 justify-center">
            <Shield size={32} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Focus Covenant</h2>
          </div>
          <p className="text-center text-amber-100 mt-2">
            Commit to focused, distraction-free study
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-200 text-sm leading-relaxed">
              Before starting your {modeText[mode]?.toLowerCase() || 'session'}, we ask you to commit to maintaining
              focus and integrity. This covenant helps ensure you get the most from your study time and
              earn rewards fairly.
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            {/* Checkbox 1: Closed Apps */}
            <button
              onClick={() => handleCheckChange('closedApps')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                checks.closedApps
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {checks.closedApps ? (
                    <CheckCircle size={24} className="text-emerald-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">
                    I have closed all unnecessary apps and browser tabs
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Social media, messaging, email, and other distractions are closed
                  </div>
                </div>
              </div>
            </button>

            {/* Checkbox 2: No Switching */}
            <button
              onClick={() => handleCheckChange('noSwitching')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                checks.noSwitching
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {checks.noSwitching ? (
                    <CheckCircle size={24} className="text-emerald-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">
                    I will not switch away from this window during the session
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    I understand that switching apps will pause the quiz and affect my focus score
                  </div>
                </div>
              </div>
            </button>

            {/* Checkbox 3: Integrity */}
            <button
              onClick={() => handleCheckChange('integrity')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                checks.integrity
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {checks.integrity ? (
                    <CheckCircle size={24} className="text-emerald-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">
                    I commit to answering with integrity and without external help
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    I will rely on my own knowledge and not use outside resources during the quiz
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Warning Notice */}
          {!allChecked && (
            <div className="bg-amber-600/20 border border-amber-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-200">
                You must agree to all three statements before starting.
              </div>
            </div>
          )}

          {/* Focus Score Info */}
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-300 mb-2">Focus Integrity Score</h3>
            <p className="text-sm text-blue-200">
              Your session will be monitored for focus. Maintaining focus earns you a high integrity score,
              which unlocks special achievements and bonuses. Switching away reduces your score.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!allChecked}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                allChecked
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {allChecked ? (
                <>
                  <Unlock size={20} />
                  I Agree - Start Session
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Complete All Checks
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusCovenant;
