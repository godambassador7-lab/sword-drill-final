import React from 'react';
import { ArrowLeft, Flame, Trophy, Zap } from 'lucide-react';

const UnlockableEliChallenge = ({ onBack, onStartChallenge, isUnlocked }) => {
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-amber-500/30 text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse"></div>
              <Trophy size={80} className="mx-auto text-amber-400 relative" />
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
              Eli Challenge
            </h1>

            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <h2 className="text-xl font-bold text-red-300 mb-2 flex items-center justify-center gap-2">
                <Zap size={20} className="text-red-400" />
                LOCKED
                <Zap size={20} className="text-red-400" />
              </h2>
              <p className="text-slate-300">
                This ultimate challenge is reserved for the elite of the elite.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-amber-500/20">
                <h3 className="font-bold text-amber-300 mb-2">📜 What is the Eli Challenge?</h3>
                <p className="text-sm text-slate-300">
                  Named after the high priest who trained Samuel, this is the ultimate test of biblical mastery.
                  No filters, no limitations—any verse from Genesis to Revelation is fair game. This challenge
                  demands complete mastery of Scripture.
                </p>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-lg border border-amber-500/20">
                <h3 className="font-bold text-amber-300 mb-2">🔓 Unlock Requirements:</h3>
                <p className="text-sm text-slate-300 mb-2">
                  To unlock the Eli Challenge, you must:
                </p>
                <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                  <li>Complete ALL Elite tier achievements</li>
                  <li>Prove your mastery across every aspect of the app</li>
                  <li>Demonstrate unwavering dedication to Scripture</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-lg border border-amber-500/20">
                <h3 className="font-bold text-amber-300 mb-2">⚡ Challenge Features:</h3>
                <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                  <li>Verses from ALL 66 books of the Bible</li>
                  <li>No difficulty filters—everything is included</li>
                  <li>Memory meters pulse with amber glory</li>
                  <li>Exclusive Eli Challenge achievements</li>
                  <li>Bragging rights for the spiritually elite</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-500/30 text-center">
                <p className="text-sm text-amber-200 italic">
                  "Train up a child in the way he should go: and when he is old, he will not depart from it."
                  <br />
                  <span className="text-xs text-amber-300">— Proverbs 22:6 (KJV)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/30 to-slate-900 text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>

        {/* Glowing Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur rounded-xl p-8 border border-amber-500/50">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Flame size={40} className="text-amber-400 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                Eli Challenge
              </h1>
              <Flame size={40} className="text-amber-400 animate-pulse" />
            </div>
            <p className="text-center text-amber-200 text-lg">
              The Ultimate Test of Biblical Mastery
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-amber-500/30 mb-6">
          <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center gap-2">
            <Trophy size={28} className="text-amber-400" />
            Congratulations, Elite Scholar!
          </h2>
          <p className="text-slate-200 mb-4">
            You have proven yourself worthy by completing every Elite achievement. You now stand among
            the greatest students of Scripture. The Eli Challenge awaits—are you ready to face verses
            from every corner of God's Word?
          </p>
          <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-500/30">
            <p className="text-amber-200 italic text-center">
              "Study to shew thyself approved unto God, a workman that needeth not to be ashamed,
              rightly dividing the word of truth."
              <br />
              <span className="text-sm text-amber-300">— 2 Timothy 2:15 (KJV)</span>
            </p>
          </div>
        </div>

        {/* Challenge Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-6 border border-amber-500/30">
            <h3 className="font-bold text-amber-300 mb-3 text-lg">📖 Verse Selection</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>All 66 books included</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>From Genesis to Revelation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>No difficulty restrictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Obscure and well-known verses</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-6 border border-amber-500/30">
            <h3 className="font-bold text-amber-300 mb-3 text-lg">⚡ Special Features</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Amber pulsing memory meters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Maximum point multipliers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Exclusive Eli achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Elite leaderboard status</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur rounded-xl p-6 border border-red-500/50 mb-6">
          <h3 className="font-bold text-red-300 mb-2 flex items-center gap-2 text-lg">
            <Zap size={24} className="text-red-400" />
            Warning: Maximum Difficulty
          </h3>
          <p className="text-sm text-slate-300">
            This mode is ruthless. You will face verses you've never seen before. Your knowledge will be
            tested to its absolute limits. Only the most dedicated students should attempt this challenge.
          </p>
        </div>

        {/* Start Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/30 blur-2xl animate-pulse"></div>
          <button
            onClick={onStartChallenge}
            className="relative w-full py-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700 text-slate-900 font-bold text-2xl rounded-xl transition-all transform hover:scale-105 shadow-2xl border-2 border-amber-400"
          >
            <div className="flex items-center justify-center gap-3">
              <Flame size={32} />
              <span>ACCEPT THE ELI CHALLENGE</span>
              <Flame size={32} />
            </div>
          </button>
        </div>

        {/* Quote */}
        <div className="mt-6 text-center">
          <p className="text-sm text-amber-300/60 italic">
            "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding."
            <br />
            <span className="text-xs">— Proverbs 9:10 (KJV)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnlockableEliChallenge;
