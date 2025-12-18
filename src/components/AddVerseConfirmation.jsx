import React from 'react';
import { BookMarked, X, Check } from 'lucide-react';

const AddVerseConfirmation = ({ verse, onConfirm, onCancel }) => {
  const verseReference = `${verse.book} ${verse.chapter}:${verse.verse}`;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-lg w-full border-2 border-emerald-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-xl">
          <div className="flex items-center gap-3 justify-center">
            <BookMarked size={32} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Add to Personal Bank?</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Verse Reference */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="text-amber-400 font-bold text-sm mb-2">{verseReference}</div>
            <div className="text-slate-200 leading-relaxed text-base">
              {verse.text}
            </div>
          </div>

          {/* Info */}
          <div className="bg-emerald-600/20 border border-emerald-500/50 rounded-lg p-4">
            <p className="text-sm text-emerald-200">
              This verse will be added to your Personal Verse Bank for memorization and review.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Add to Bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVerseConfirmation;
