import React from 'react';
import { X, Coins } from 'lucide-react';

const IncorrectToast = ({ show, points }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-achievement-unlock bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl p-8 border-4 border-white/30 animate-pulse-glow">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(239,68,68,0.6)' }}>
            ✗ INCORRECT
          </h2>
          {points !== 0 && (
            <div className="flex items-center justify-center gap-2 text-white text-3xl font-semibold mb-2">
              <Coins className="text-amber-300 animate-pulse" size={36} />
              <span className="drop-shadow-md">{points} points</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-white text-xl font-semibold">
            <X className="text-white animate-pulse" size={24} />
            <span className="drop-shadow-md">Try Again!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncorrectToast;
