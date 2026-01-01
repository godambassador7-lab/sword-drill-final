import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Volume2, BookOpen } from 'lucide-react';

/**
 * Language Course Disclaimer Modal
 *
 * Shows an important disclaimer before users start language courses.
 * Explains that the course teaches reading/identification for biblical study,
 * not fluency, and recommends using additional resources.
 *
 * @param {string} courseName - Name of the language course (e.g., "Biblical Hebrew I")
 * @param {Function} onAccept - Callback when user accepts disclaimer
 * @param {boolean} show - Whether to show the modal
 */
const LanguageCourseDisclaimer = ({ courseName = "Language", onAccept, show = true }) => {
  const [understood, setUnderstood] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Check if user has already accepted this disclaimer
  useEffect(() => {
    const acceptedCourses = JSON.parse(localStorage.getItem('acceptedLanguageDisclaimers') || '[]');
    const courseKey = courseName.toLowerCase().replace(/\s+/g, '-');

    if (acceptedCourses.includes(courseKey)) {
      setHasAccepted(true);
      if (onAccept) {
        onAccept();
      }
    }
  }, [courseName, onAccept]);

  const handleAccept = () => {
    if (!understood) return;

    // Save acceptance to localStorage
    const acceptedCourses = JSON.parse(localStorage.getItem('acceptedLanguageDisclaimers') || '[]');
    const courseKey = courseName.toLowerCase().replace(/\s+/g, '-');

    if (!acceptedCourses.includes(courseKey)) {
      acceptedCourses.push(courseKey);
      localStorage.setItem('acceptedLanguageDisclaimers', JSON.stringify(acceptedCourses));
    }

    setHasAccepted(true);

    if (onAccept) {
      onAccept();
    }
  };

  // Don't show if already accepted or show prop is false
  if (!show || hasAccepted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl max-w-2xl w-full shadow-2xl shadow-amber-500/20 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-xl border-b-2 border-amber-500/30">
          <div className="flex items-center gap-3">
            <AlertTriangle size={32} className="text-white animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-white">Important Notice</h2>
              <p className="text-amber-100 text-sm">{courseName}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Main Disclaimer */}
          <div className="bg-slate-700/50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
              <BookOpen size={20} />
              Course Objectives
            </h3>
            <p className="text-slate-200 leading-relaxed mb-3">
              This course is designed to help you <strong className="text-amber-300">identify, read, and understand</strong> ancient languages for better study of biblical texts not written in English.
            </p>
            <p className="text-amber-200 font-semibold">
              ⚠️ This course does NOT teach complete fluency in the language.
            </p>
          </div>

          {/* Recommendation Section */}
          <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-400 mb-3">📚 Best Practices</h3>
            <p className="text-slate-200 leading-relaxed mb-3">
              For optimal learning outcomes, we <strong className="text-blue-300">highly recommend</strong> using this course alongside other language resources.
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Utilize pronunciation guides and audio resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Practice with native speakers or tutors when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Study grammar and syntax from multiple sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Engage with authentic ancient texts regularly</span>
              </li>
            </ul>
          </div>

          {/* Future Features */}
          <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
              <Volume2 size={20} />
              Coming Soon!
            </h3>
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-purple-300">Sword Drill</strong> is planning to add <strong className="text-purple-300">audio features</strong> to help with ancient language study in the future!
              This will include pronunciation guides, audio lessons, and interactive speaking exercises.
            </p>
            <p className="text-purple-200 text-sm mt-2 italic">
              Stay tuned for updates! 🎧
            </p>
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="bg-slate-700/70 border-2 border-slate-600 p-5 rounded-xl">
            <label
              htmlFor="understand-checkbox"
              className="flex items-start gap-4 cursor-pointer group"
            >
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="understand-checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="w-6 h-6 cursor-pointer accent-amber-500 rounded"
                />
                {understood && (
                  <CheckCircle
                    size={24}
                    className="absolute top-0 left-0 text-green-400 pointer-events-none animate-scale-in"
                  />
                )}
              </div>
              <span className="text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                I understand that this course focuses on <strong className="text-amber-300">reading and comprehension</strong> for biblical study, not complete language fluency, and that I should use additional resources for comprehensive language learning and proper pronunciation.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/50 border-t-2 border-slate-700 rounded-b-xl">
          <button
            onClick={handleAccept}
            disabled={!understood}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
              understood
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            {understood ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={24} />
                I Understand - Start Course
              </span>
            ) : (
              'Please check the box above to continue'
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LanguageCourseDisclaimer;
