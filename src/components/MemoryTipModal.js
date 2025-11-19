import React from "react";
import { X, Lightbulb } from "lucide-react";

/**
 * MemoryTipModal - Displays a random memory tip after quiz failures or incorrect reviews
 * @param {Object} props
 * @param {string} props.tip - The memory tip to display
 * @param {Function} props.onClose - Callback when user closes the modal
 */
const MemoryTipModal = ({ tip, onClose }) => {
  if (!tip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Lightbulb Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-4 shadow-lg animate-pulse-glow">
            <Lightbulb size={32} className="text-slate-900" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-amber-300 mb-4">
          Memory Tip
        </h3>

        {/* Tip Content */}
        <p className="text-slate-200 text-center text-base leading-relaxed mb-6">
          {tip}
        </p>

        {/* Optional Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          Got it!
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-t-2xl"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.8),
              0 0 40px rgba(251, 191, 36, 0.4);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MemoryTipModal;
