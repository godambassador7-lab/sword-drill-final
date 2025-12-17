import React, { useState } from 'react';
import { Smartphone, Lock, Settings, CheckCircle, ChevronRight, X } from 'lucide-react';

const GuidedAccessInstructions = ({ onConfirm, onSkip }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [platform, setPlatform] = useState('ios'); // 'ios' or 'android'

  // Detect platform
  React.useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      setPlatform('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setPlatform('ios');
    }
  }, []);

  const iosSteps = [
    {
      step: 1,
      title: 'Open Settings',
      description: 'Go to Settings > Accessibility > Guided Access'
    },
    {
      step: 2,
      title: 'Enable Guided Access',
      description: 'Toggle on "Guided Access" and set a passcode'
    },
    {
      step: 3,
      title: 'Return to Sword Drill',
      description: 'Come back to this app and continue below'
    },
    {
      step: 4,
      title: 'Activate Lock-In Mode',
      description: 'Triple-click the side button to start Guided Access'
    },
    {
      step: 5,
      title: 'Start Your Session',
      description: 'Once activated, you won\'t be able to leave until you triple-click again'
    }
  ];

  const androidSteps = [
    {
      step: 1,
      title: 'Open Recent Apps',
      description: 'Tap the square or Recent Apps button'
    },
    {
      step: 2,
      title: 'Find Sword Drill',
      description: 'Locate this app in your recent apps list'
    },
    {
      step: 3,
      title: 'Tap the App Icon',
      description: 'Tap the icon at the top of the app preview'
    },
    {
      step: 4,
      title: 'Select "Pin"',
      description: 'Choose "Pin this app" from the menu'
    },
    {
      step: 5,
      title: 'Confirm',
      description: 'The app is now pinned. To exit, press Back + Recent Apps buttons together'
    }
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full border-2 border-blue-500/50 shadow-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-xl relative">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-3 justify-center">
            <Lock size={32} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Lock-In Focus Mode</h2>
          </div>
          <p className="text-center text-blue-100 mt-2">
            Optional but Recommended for Maximum Focus
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Benefits */}
          <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/50 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2">
              <Smartphone size={20} />
              Why Use Lock-In Mode?
            </h3>
            <ul className="text-sm text-emerald-200 space-y-1 ml-6">
              <li>• Prevents accidental app switching</li>
              <li>• Maintains 100% Focus Integrity Score</li>
              <li>• Unlocks "Elite Scholar" achievements</li>
              <li>• Maximizes learning retention</li>
            </ul>
          </div>

          {/* Platform Tabs */}
          <div className="flex gap-2 bg-slate-700/50 p-1 rounded-lg">
            <button
              onClick={() => setPlatform('ios')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                platform === 'ios'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              iOS (iPhone/iPad)
            </button>
            <button
              onClick={() => setPlatform('android')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                platform === 'android'
                  ? 'bg-green-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Android
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Settings size={20} className="text-blue-400" />
              Setup Steps
            </h3>

            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 mb-1">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.description}</div>
                  </div>
                  <ChevronRight size={20} className="text-slate-500 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation Checkbox */}
          <button
            onClick={() => setConfirmed(!confirmed)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              confirmed
                ? 'bg-emerald-600/20 border-emerald-500'
                : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {confirmed ? (
                  <CheckCircle size={24} className="text-emerald-400" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-200">
                  I have enabled lock-in mode as instructed
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  I understand this is a commitment to maintain focus throughout my session
                </div>
              </div>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSkip}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all"
            >
              Skip (Not Recommended)
            </button>
            <button
              onClick={onConfirm}
              disabled={!confirmed}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                confirmed
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {confirmed ? 'Continue with Lock-In Mode' : 'Check the Box Above'}
            </button>
          </div>

          {/* Note */}
          <div className="text-center text-xs text-slate-500">
            Note: We cannot verify if lock-in mode is enabled, but this commitment helps maintain integrity.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedAccessInstructions;
