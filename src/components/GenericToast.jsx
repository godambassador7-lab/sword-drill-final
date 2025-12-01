import React from 'react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

const GenericToast = ({ show, message, type = 'success', onClose }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={48} className="text-emerald-200" />,
          gradient: 'from-emerald-800 via-emerald-700 to-emerald-800',
          shadow: '0 0 20px rgba(34,197,94,0.25), 0 0 40px rgba(34,197,94,0.35)',
          textColor: 'text-emerald-50'
        };
      case 'error':
        return {
          icon: <X size={48} className="text-red-300" />,
          gradient: 'from-red-500 via-red-600 to-red-700',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(239,68,68,0.6)',
          textColor: 'text-white'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={48} className="text-yellow-300" />,
          gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(251,191,36,0.6)',
          textColor: 'text-white'
        };
      case 'info':
        return {
          icon: <Info size={48} className="text-yellow-200" />,
          gradient: 'from-blue-950 via-blue-900 to-blue-800',
          shadow: '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(56,189,248,0.35)',
          textColor: 'text-yellow-100'
        };
      default:
        return {
          icon: <Info size={48} className="text-yellow-200" />,
          gradient: 'from-blue-950 via-blue-900 to-blue-800',
          shadow: '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(56,189,248,0.35)',
          textColor: 'text-yellow-100'
        };
    }
  };

  const config = getConfig();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`relative animate-achievement-unlock bg-gradient-to-br ${config.gradient} rounded-2xl shadow-2xl p-8 border-4 border-white/30 animate-pulse-glow max-w-md pointer-events-auto`}>
        {onClose && (
          <button
            aria-label="Close notification"
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {config.icon}
          </div>
          <div
            className={`${config.textColor || 'text-white'} text-lg font-semibold whitespace-pre-line leading-relaxed`}
            style={{ textShadow: config.shadow }}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericToast;
