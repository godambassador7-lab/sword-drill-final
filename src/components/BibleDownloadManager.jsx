import React, { useState, useEffect } from 'react';
import { Download, Trash2, CheckCircle, HardDrive, AlertCircle } from 'lucide-react';
import {
  AVAILABLE_TRANSLATIONS,
  downloadTranslation,
  getAllDownloadedTranslations,
  deleteTranslation,
  isTranslationDownloaded,
  getStorageInfo,
  formatBytes
} from '../services/offlineBibleService';

/**
 * Bible Download Manager Component
 *
 * Allows users to download Bible translations for offline reading.
 * Shows progress bar during download with translation name and percentage.
 */
const BibleDownloadManager = () => {
  const [downloadedTranslations, setDownloadedTranslations] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingName, setDownloadingName] = useState('');
  const [storageInfo, setStorageInfo] = useState({ usage: 0, quota: 0, percentage: 0 });
  const [error, setError] = useState(null);
  const [downloadStates, setDownloadStates] = useState({});

  // Load downloaded translations and storage info on mount
  useEffect(() => {
    loadDownloadedTranslations();
    updateStorageInfo();
  }, []);

  // Check which translations are downloaded
  useEffect(() => {
    const checkDownloaded = async () => {
      const states = {};
      for (const translation of AVAILABLE_TRANSLATIONS) {
        states[translation.id] = await isTranslationDownloaded(translation.id);
      }
      setDownloadStates(states);
    };
    checkDownloaded();
  }, [downloadedTranslations]);

  const loadDownloadedTranslations = async () => {
    try {
      const translations = await getAllDownloadedTranslations();
      setDownloadedTranslations(translations);
    } catch (error) {
      console.error('Error loading translations:', error);
      setError('Failed to load downloaded translations');
    }
  };

  const updateStorageInfo = async () => {
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error getting storage info:', error);
    }
  };

  const handleDownload = async (translation) => {
    setDownloadingId(translation.id);
    setDownloadingName(translation.name);
    setDownloadProgress(0);
    setError(null);

    try {
      await downloadTranslation(translation.id, (progress) => {
        setDownloadProgress(progress);
      });

      // Reload downloaded translations
      await loadDownloadedTranslations();
      await updateStorageInfo();

      // Clear downloading state
      setDownloadingId(null);
      setDownloadProgress(0);
      setDownloadingName('');
    } catch (error) {
      console.error('Download error:', error);
      setError(`Failed to download ${translation.name}: ${error.message}`);
      setDownloadingId(null);
      setDownloadProgress(0);
      setDownloadingName('');
    }
  };

  const handleDelete = async (translationId) => {
    if (!window.confirm('Are you sure you want to delete this translation?')) {
      return;
    }

    try {
      await deleteTranslation(translationId);
      await loadDownloadedTranslations();
      await updateStorageInfo();
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete translation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-xl border-2 border-amber-500/30">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Download size={28} />
          Offline Bible Translations
        </h2>
        <p className="text-amber-100">
          Download translations to read the Bible offline on your phone or computer.
        </p>
      </div>

      {/* Storage Info */}
      <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <HardDrive size={24} className="text-amber-400" />
          <h3 className="text-xl font-bold text-white">Storage Usage</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Used: {storageInfo.usageMB} MB</span>
            <span>Available: {storageInfo.quotaMB} MB</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center">
            {storageInfo.percentage}% used
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Download Progress Bar */}
      {downloadingId && (
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500/50 rounded-xl p-6 animate-pulse-slow">
          <div className="flex items-center gap-3 mb-4">
            <Download size={24} className="text-purple-300 animate-bounce" />
            <div>
              <h3 className="text-lg font-bold text-white">Downloading...</h3>
              <p className="text-purple-200 text-sm">{downloadingName}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 flex items-center justify-center"
                style={{ width: `${downloadProgress}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {downloadProgress}%
                </span>
              </div>
            </div>
            <p className="text-center text-purple-200 text-sm">
              Please wait while we download your translation...
            </p>
          </div>
        </div>
      )}

      {/* Available Translations */}
      <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Available Translations</h3>
        <div className="space-y-3">
          {AVAILABLE_TRANSLATIONS.map((translation) => {
            const isDownloaded = downloadStates[translation.id];
            const isDownloading = downloadingId === translation.id;
            const requiresUnlock = translation.requiresUnlock;

            return (
              <div
                key={translation.id}
                className="bg-slate-700/50 border-2 border-slate-600 rounded-lg p-4 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {translation.name}
                      {isDownloaded && (
                        <CheckCircle size={20} className="text-green-400" />
                      )}
                    </h4>
                    <p className="text-slate-300 text-sm mt-1">
                      {translation.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-400">
                      <span>{translation.language}</span>
                      <span>•</span>
                      <span>{translation.year > 0 ? `${translation.year} AD` : `${Math.abs(translation.year)} BC`}</span>
                      <span>•</span>
                      <span>{translation.size}</span>
                    </div>
                    {requiresUnlock && (
                      <p className="text-amber-400 text-xs mt-2 flex items-center gap-1">
                        <span>🔒</span>
                        Requires unlock in store
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isDownloaded ? (
                      <button
                        onClick={() => handleDelete(translation.id)}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border-2 border-red-500/50 hover:border-red-500 text-red-300 hover:text-red-200 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownload(translation)}
                        disabled={isDownloading || requiresUnlock}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/40 border-2 border-amber-500/50 hover:border-amber-500 text-amber-300 hover:text-amber-200 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download size={18} />
                        {isDownloading ? 'Downloading...' : 'Download'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Downloaded Translations Summary */}
      {downloadedTranslations.length > 0 && (
        <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r-lg">
          <h3 className="text-lg font-bold text-green-300 mb-2 flex items-center gap-2">
            <CheckCircle size={20} />
            Downloaded Translations ({downloadedTranslations.length})
          </h3>
          <ul className="space-y-1 text-green-200 text-sm">
            {downloadedTranslations.map((trans) => (
              <li key={trans.id} className="flex items-center gap-2">
                <span>✓</span>
                <span>{trans.name} ({trans.abbreviation})</span>
                <span className="text-green-400">• {formatBytes(trans.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-blue-200 text-sm">
          💡 <strong>Tip:</strong> Downloaded translations are stored on your device and can be
          accessed offline. You can delete them anytime to free up storage space.
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BibleDownloadManager;
