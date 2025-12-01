import React from 'react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

const GenericToast = ({ show, message, type = 'success', onClose }) => {
  if (!show) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={48} className="text-green-300" />,
          gradient: 'from-green-400 via-emerald-500 to-green-600',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(134,239,172,0.6)'
        };
      case 'error':
        return {
          icon: <X size={48} className="text-red-300" />,
          gradient: 'from-red-500 via-red-600 to-red-700',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(239,68,68,0.6)'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={48} className="text-yellow-300" />,
          gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(251,191,36,0.6)'
        };
      case 'info':
        return {
          icon: <Info size={48} className="text-blue-300" />,
          gradient: 'from-blue-400 via-cyan-500 to-blue-600',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(96,165,250,0.6)'
        };
      default:
        return {
          icon: <Info size={48} className="text-blue-300" />,
          gradient: 'from-blue-400 via-cyan-500 to-blue-600',
          shadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(96,165,250,0.6)'
        };
    }
  };

  const config = getConfig();

  // Auto-close after 3 seconds if onClose is provided
  React.useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`animate-achievement-unlock bg-gradient-to-br ${config.gradient} rounded-2xl shadow-2xl p-8 border-4 border-white/30 animate-pulse-glow max-w-md`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {config.icon}
          </div>
          <div
            className="text-white text-lg font-semibold whitespace-pre-line leading-relaxed"
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
