import React from 'react';
import { Coins } from 'lucide-react';

const CorrectToast = ({ points, show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-achievement-unlock bg-gradient-to-br from-green-700 via-green-600 to-green-700 rounded-2xl shadow-2xl p-8 border-4 border-white/30 animate-pulse-glow">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(134,239,172,0.6)' }}>
            ✓ CORRECT!
          </h2>
          <div className="flex items-center justify-center gap-2 text-white text-3xl font-semibold">
            <Coins className="text-amber-300 animate-pulse" size={36} />
            <span className="drop-shadow-md">+{points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectToast;
