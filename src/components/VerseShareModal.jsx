import React, { useState } from 'react';
import { Share2, Copy, CheckCircle, Twitter, Facebook, Mail, MessageCircle, X, Download } from 'lucide-react';

/**
 * Verse Share Modal Component
 *
 * Allows users to share Bible verses via multiple platforms:
 * - Copy to clipboard
 * - Twitter
 * - Facebook
 * - Email
 * - SMS/WhatsApp
 * - Download as image
 */
const VerseShareModal = ({ verse, onClose, show = true }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!show || !verse) return null;

  // Format verse text for sharing
  const getShareText = () => {
    const verseText = verse.text || verse.verse || '';
    const reference = verse.reference || verse.verseReference || 'Bible Verse';
    return `"${verseText}"\n\n— ${reference} (KJV)`;
  };

  const getShareTextPlain = () => {
    const verseText = verse.text || verse.verse || '';
    const reference = verse.reference || verse.verseReference || 'Bible Verse';
    return `${verseText} — ${reference}`;
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShareText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share via Twitter
  const handleTwitterShare = () => {
    const text = getShareTextPlain();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=BibleVerse,SwordDrill`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  // Share via Facebook
  const handleFacebookShare = () => {
    const text = getShareTextPlain();
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  // Share via Email
  const handleEmailShare = () => {
    const reference = verse.reference || verse.verseReference || 'Bible Verse';
    const subject = `Bible Verse: ${reference}`;
    const body = getShareText();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Share via SMS/WhatsApp
  const handleSMSShare = () => {
    const text = getShareText();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Use WhatsApp on mobile if available
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
      window.location.href = whatsappUrl;
    } else {
      // Fallback to SMS protocol
      window.location.href = `sms:?body=${encodeURIComponent(text)}`;
    }
  };

  // Download as image
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630; // Good for social media
      const ctx = canvas.getContext('2d');

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1e293b'); // slate-800
      gradient.addColorStop(1, '#7c3aed'); // purple-600
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add decorative border
      ctx.strokeStyle = '#fbbf24'; // amber-400
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Verse text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const verseText = verse.text || verse.verse || '';
      const maxWidth = canvas.width - 160;
      const lineHeight = 60;
      const words = verseText.split(' ');
      let lines = [];
      let currentLine = '';

      // Word wrap
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      // Draw verse text
      const startY = (canvas.height - (lines.length * lineHeight)) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + (index * lineHeight));
      });

      // Reference
      ctx.font = 'italic 32px Georgia, serif';
      ctx.fillStyle = '#fbbf24'; // amber-400
      const reference = verse.reference || verse.verseReference || 'Bible Verse';
      ctx.fillText(`— ${reference} (KJV)`, canvas.width / 2, canvas.height - 100);

      // Sword Drill watermark
      ctx.font = '20px Arial, sans-serif';
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.fillText('Shared from Sword Drill', canvas.width / 2, canvas.height - 50);

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reference.replace(/[^a-z0-9]/gi, '_')}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
      });
    } catch (error) {
      console.error('Failed to create image:', error);
      setDownloading(false);
    }
  };

  // Use native share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: verse.reference || verse.verseReference || 'Bible Verse',
          text: getShareText(),
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  };

  const reference = verse.reference || verse.verseReference || 'Bible Verse';
  const verseText = verse.text || verse.verse || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl max-w-2xl w-full shadow-2xl shadow-amber-500/20 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-xl border-b-2 border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 size={28} className="text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Share This Verse</h2>
              <p className="text-amber-100 text-sm">{reference}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Verse Preview */}
        <div className="p-6 border-b border-slate-700">
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-amber-500/30">
            <p className="text-lg text-white leading-relaxed italic mb-4">
              "{verseText}"
            </p>
            <p className="text-amber-400 font-semibold text-right">
              — {reference} (KJV)
            </p>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-amber-400 mb-4">Choose how to share:</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {/* Copy to Clipboard */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl border-2 border-slate-600 hover:border-amber-500 transition-all group"
            >
              {copied ? (
                <CheckCircle size={32} className="text-green-400" />
              ) : (
                <Copy size={32} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
              )}
              <span className="text-sm font-semibold text-white">
                {copied ? 'Copied!' : 'Copy Text'}
              </span>
            </button>

            {/* Twitter */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 hover:bg-blue-600/20 rounded-xl border-2 border-slate-600 hover:border-blue-400 transition-all group"
            >
              <Twitter size={32} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-semibold text-white">Twitter</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 hover:bg-blue-700/20 rounded-xl border-2 border-slate-600 hover:border-blue-500 transition-all group"
            >
              <Facebook size={32} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-semibold text-white">Facebook</span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 hover:bg-red-600/20 rounded-xl border-2 border-slate-600 hover:border-red-400 transition-all group"
            >
              <Mail size={32} className="text-slate-300 group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-semibold text-white">Email</span>
            </button>

            {/* SMS/WhatsApp */}
            <button
              onClick={handleSMSShare}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 hover:bg-green-600/20 rounded-xl border-2 border-slate-600 hover:border-green-400 transition-all group"
            >
              <MessageCircle size={32} className="text-slate-300 group-hover:text-green-400 transition-colors" />
              <span className="text-sm font-semibold text-white">WhatsApp</span>
            </button>

            {/* Download Image */}
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700/50 hover:bg-purple-600/20 rounded-xl border-2 border-slate-600 hover:border-purple-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={32} className="text-slate-300 group-hover:text-purple-400 transition-colors" />
              <span className="text-sm font-semibold text-white">
                {downloading ? 'Creating...' : 'Download Image'}
              </span>
            </button>
          </div>

          {/* Native Share Button (if supported) */}
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              More Share Options
            </button>
          )}
        </div>

        {/* Footer Tip */}
        <div className="px-6 pb-6">
          <div className="bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg p-4">
            <p className="text-blue-200 text-sm">
              💡 <strong>Tip:</strong> Share verses to encourage others and spread God's Word!
            </p>
          </div>
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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerseShareModal;
