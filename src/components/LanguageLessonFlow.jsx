import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react';

const MAX_HEARTS = 5;
const HEART_COST = 50;
const MAX_EXTRA_HEARTS = 2;

const COURSE_ALPHABETS = {
  ancientHebrew: [
    { char: 'א', name: 'Aleph', transliteration: 'ʾ', sound: 'silent / glottal stop' },
    { char: 'ב', name: 'Bet', transliteration: 'b/v', sound: 'b or v' },
    { char: 'ג', name: 'Gimel', transliteration: 'g', sound: 'g as in go' },
    { char: 'ד', name: 'Dalet', transliteration: 'd', sound: 'd as in door' },
    { char: 'ה', name: 'He', transliteration: 'h', sound: 'h as in house' },
    { char: 'ו', name: 'Vav', transliteration: 'w/v', sound: 'w or v' },
    { char: 'ז', name: 'Zayin', transliteration: 'z', sound: 'z as in zoo' },
    { char: 'ח', name: 'Het', transliteration: 'h', sound: 'kh as in Bach' },
    { char: 'ט', name: 'Tet', transliteration: 't', sound: 'emphatic t' },
    { char: 'י', name: 'Yod', transliteration: 'y', sound: 'y as in yes' },
    { char: 'כ', name: 'Kaf', transliteration: 'k/kh', sound: 'k or kh', finalForm: 'ך' },
    { char: 'ל', name: 'Lamed', transliteration: 'l', sound: 'l as in lamp' },
    { char: 'מ', name: 'Mem', transliteration: 'm', sound: 'm as in moon', finalForm: 'ם' },
    { char: 'נ', name: 'Nun', transliteration: 'n', sound: 'n as in noon', finalForm: 'ן' },
    { char: 'ס', name: 'Samekh', transliteration: 's', sound: 's as in sun' },
    { char: 'ע', name: 'Ayin', transliteration: 'ʿ', sound: 'voiced guttural' },
    { char: 'פ', name: 'Pe', transliteration: 'p/f', sound: 'p or f', finalForm: 'ף' },
    { char: 'צ', name: 'Tsadi', transliteration: 'ts', sound: 'ts as in cats', finalForm: 'ץ' },
    { char: 'ק', name: 'Qof', transliteration: 'q', sound: 'back-of-throat k' },
    { char: 'ר', name: 'Resh', transliteration: 'r', sound: 'r as in run' },
    { char: 'ש', name: 'Shin', transliteration: 'sh/s', sound: 'sh or s' },
    { char: 'ת', name: 'Tav', transliteration: 't', sound: 't as in top' }
  ],
  paleoHebrew: [
    { char: '𐤀', name: 'Aleph', transliteration: 'ʾ', sound: 'silent / glottal stop' },
    { char: '𐤁', name: 'Bet', transliteration: 'b', sound: 'b as in bed' },
    { char: '𐤂', name: 'Gimel', transliteration: 'g', sound: 'g as in go' },
    { char: '𐤃', name: 'Dalet', transliteration: 'd', sound: 'd as in door' },
    { char: '𐤄', name: 'He', transliteration: 'h', sound: 'h as in house' },
    { char: '𐤅', name: 'Waw', transliteration: 'w', sound: 'w as in water' },
    { char: '𐤆', name: 'Zayin', transliteration: 'z', sound: 'z as in zoo' },
    { char: '𐤇', name: 'Het', transliteration: 'h', sound: 'kh as in Bach' },
    { char: '𐤈', name: 'Tet', transliteration: 't', sound: 'emphatic t' },
    { char: '𐤉', name: 'Yod', transliteration: 'y', sound: 'y as in yes' },
    { char: '𐤊', name: 'Kaf', transliteration: 'k', sound: 'k as in kit' },
    { char: '𐤋', name: 'Lamed', transliteration: 'l', sound: 'l as in lamp' },
    { char: '𐤌', name: 'Mem', transliteration: 'm', sound: 'm as in moon' },
    { char: '𐤍', name: 'Nun', transliteration: 'n', sound: 'n as in noon' },
    { char: '𐤎', name: 'Samekh', transliteration: 's', sound: 's as in sun' },
    { char: '𐤏', name: 'Ayin', transliteration: 'ʿ', sound: 'guttural consonant' },
    { char: '𐤐', name: 'Pe', transliteration: 'p', sound: 'p as in pit' },
    { char: '𐤑', name: 'Tsadi', transliteration: 'ts', sound: 'ts as in cats' },
    { char: '𐤒', name: 'Qof', transliteration: 'q', sound: 'back-of-throat k' },
    { char: '𐤓', name: 'Resh', transliteration: 'r', sound: 'r as in run' },
    { char: '𐤔', name: 'Shin', transliteration: 'sh', sound: 'sh as in ship' },
    { char: '𐤕', name: 'Tav', transliteration: 't', sound: 't as in top' }
  ],
  aramaic: [
    { char: 'ܐ', name: 'Alaph', transliteration: 'ʾ', sound: 'silent / glottal stop' },
    { char: 'ܒ', name: 'Beth', transliteration: 'b/v', sound: 'b or v' },
    { char: 'ܓ', name: 'Gamal', transliteration: 'g', sound: 'g as in go' },
    { char: 'ܕ', name: 'Dalath', transliteration: 'd', sound: 'd as in door' },
    { char: 'ܗ', name: 'He', transliteration: 'h', sound: 'h as in house' },
    { char: 'ܘ', name: 'Waw', transliteration: 'w', sound: 'w as in water' },
    { char: 'ܙ', name: 'Zain', transliteration: 'z', sound: 'z as in zoo' },
    { char: 'ܚ', name: 'Heth', transliteration: 'h', sound: 'kh as in Bach' },
    { char: 'ܛ', name: 'Teth', transliteration: 't', sound: 'emphatic t' },
    { char: 'ܝ', name: 'Yodh', transliteration: 'y', sound: 'y as in yes' },
    { char: 'ܟ', name: 'Kaph', transliteration: 'k/kh', sound: 'k or kh' },
    { char: 'ܠ', name: 'Lamadh', transliteration: 'l', sound: 'l as in lamp' },
    { char: 'ܡ', name: 'Mim', transliteration: 'm', sound: 'm as in moon' },
    { char: 'ܢ', name: 'Nun', transliteration: 'n', sound: 'n as in noon' },
    { char: 'ܣ', name: 'Semkath', transliteration: 's', sound: 's as in sun' },
    { char: 'ܥ', name: 'E', transliteration: 'ʿ', sound: 'voiced guttural' },
    { char: 'ܦ', name: 'Pe', transliteration: 'p/f', sound: 'p or f' },
    { char: 'ܨ', name: 'Sadhe', transliteration: 's', sound: 'emphatic s' },
    { char: 'ܩ', name: 'Qoph', transliteration: 'q', sound: 'back-of-throat k' },
    { char: 'ܪ', name: 'Rish', transliteration: 'r', sound: 'r as in run' },
    { char: 'ܫ', name: 'Shin', transliteration: 'sh', sound: 'sh as in ship' },
    { char: 'ܬ', name: 'Taw', transliteration: 't', sound: 't as in top' }
  ],
  koineGreek: [
    { char: 'Α', name: 'Alpha', lowercase: 'α', transliteration: 'a', sound: 'a as in father' },
    { char: 'Β', name: 'Beta', lowercase: 'β', transliteration: 'b', sound: 'b as in bed' },
    { char: 'Γ', name: 'Gamma', lowercase: 'γ', transliteration: 'g', sound: 'g as in go' },
    { char: 'Δ', name: 'Delta', lowercase: 'δ', transliteration: 'd', sound: 'd as in door' },
    { char: 'Ε', name: 'Epsilon', lowercase: 'ε', transliteration: 'e', sound: 'short e as in met' },
    { char: 'Ζ', name: 'Zeta', lowercase: 'ζ', transliteration: 'z', sound: 'dz or z' },
    { char: 'Η', name: 'Eta', lowercase: 'η', transliteration: 'e', sound: 'long e as in they' },
    { char: 'Θ', name: 'Theta', lowercase: 'θ', transliteration: 'th', sound: 'th as in thin' },
    { char: 'Ι', name: 'Iota', lowercase: 'ι', transliteration: 'i', sound: 'i as in sit' },
    { char: 'Κ', name: 'Kappa', lowercase: 'κ', transliteration: 'k', sound: 'k as in kit' },
    { char: 'Λ', name: 'Lambda', lowercase: 'λ', transliteration: 'l', sound: 'l as in lamp' },
    { char: 'Μ', name: 'Mu', lowercase: 'μ', transliteration: 'm', sound: 'm as in moon' },
    { char: 'Ν', name: 'Nu', lowercase: 'ν', transliteration: 'n', sound: 'n as in noon' },
    { char: 'Ξ', name: 'Xi', lowercase: 'ξ', transliteration: 'x', sound: 'x as in box' },
    { char: 'Ο', name: 'Omicron', lowercase: 'ο', transliteration: 'o', sound: 'short o as in hot' },
    { char: 'Π', name: 'Pi', lowercase: 'π', transliteration: 'p', sound: 'p as in pit' },
    { char: 'Ρ', name: 'Rho', lowercase: 'ρ', transliteration: 'r', sound: 'rolled r' },
    { char: 'Σ', name: 'Sigma', lowercase: 'σ', transliteration: 's', sound: 's as in sun', finalForm: 'ς' },
    { char: 'Τ', name: 'Tau', lowercase: 'τ', transliteration: 't', sound: 't as in top' },
    { char: 'Υ', name: 'Upsilon', lowercase: 'υ', transliteration: 'u', sound: 'u as in French tu' },
    { char: 'Φ', name: 'Phi', lowercase: 'φ', transliteration: 'ph', sound: 'f as in phone' },
    { char: 'Χ', name: 'Chi', lowercase: 'χ', transliteration: 'ch', sound: 'ch as in Bach' },
    { char: 'Ψ', name: 'Psi', lowercase: 'ψ', transliteration: 'ps', sound: 'ps as in lapse' },
    { char: 'Ω', name: 'Omega', lowercase: 'ω', transliteration: 'o', sound: 'long o as in bone' }
  ],
  geez: [
    { char: 'ሀ', name: 'Ha (1st order)', transliteration: 'hae', sound: 'hae' },
    { char: 'ሁ', name: 'Hu (2nd order)', transliteration: 'hu', sound: 'hu' },
    { char: 'ሂ', name: 'Hi (3rd order)', transliteration: 'hi', sound: 'hi' },
    { char: 'ሃ', name: 'Ha (4th order)', transliteration: 'ha', sound: 'ha' },
    { char: 'ሄ', name: 'He (5th order)', transliteration: 'he', sound: 'he' },
    { char: 'ህ', name: 'He (6th order)', transliteration: 'huh', sound: 'huh (schwa-like)' },
    { char: 'ሆ', name: 'Ho (7th order)', transliteration: 'ho', sound: 'ho' }
  ],
  amharic: [
    { char: 'ሀ', name: 'Hae', transliteration: 'hae', sound: 'hae' },
    { char: 'ሁ', name: 'Hu', transliteration: 'hu', sound: 'hu' },
    { char: 'ሂ', name: 'Hi', transliteration: 'hi', sound: 'hi' },
    { char: 'ሃ', name: 'Ha', transliteration: 'ha', sound: 'ha' },
    { char: 'ሄ', name: 'He', transliteration: 'he', sound: 'he' },
    { char: 'ህ', name: 'Huh', transliteration: 'huh', sound: 'huh (schwa-like)' },
    { char: 'ሆ', name: 'Ho', transliteration: 'ho', sound: 'ho' },
    { char: 'ለ', name: 'Lae', transliteration: 'lae', sound: 'lae' },
    { char: 'ሉ', name: 'Lu', transliteration: 'lu', sound: 'lu' },
    { char: 'ሊ', name: 'Li', transliteration: 'li', sound: 'li' },
    { char: 'ላ', name: 'La', transliteration: 'la', sound: 'la' },
    { char: 'ሌ', name: 'Le', transliteration: 'le', sound: 'le' },
    { char: 'ል', name: 'Luh', transliteration: 'luh', sound: 'luh (schwa-like)' },
    { char: 'ሎ', name: 'Lo', transliteration: 'lo', sound: 'lo' }
  ]
};

const COURSE_ALPHABET_ALIASES = {
  hebrewII: 'ancientHebrew',
  greekII: 'koineGreek'
};

function shouldUseFallbackAlphabet(unit) {
  const title = String(unit?.title || '').toLowerCase();
  return (
    title.includes('alphabet') ||
    title.includes('script') ||
    title.includes('fidel') ||
    title.includes('pronunciation')
  );
}

function resolveLetters(unit, languageId) {
  if (Array.isArray(unit?.letters) && unit.letters.length > 0) {
    return unit.letters;
  }
  if (!shouldUseFallbackAlphabet(unit)) {
    return [];
  }
  const mappedId = COURSE_ALPHABET_ALIASES[languageId] || languageId;
  return COURSE_ALPHABETS[mappedId] || [];
}

// ── Step Builder ──────────────────────────────────────────────────────────────
function buildSteps(unit, languageId) {
  const steps = [];
  const allLetters = resolveLetters(unit, languageId);

  // Letter-by-letter flow
  if (allLetters.length > 0) {
    const CHUNK = 4;
    for (let gi = 0; gi < allLetters.length; gi += CHUNK) {
      const group = allLetters.slice(gi, gi + CHUNK);

      // Intro card for each letter
      group.forEach(letter => steps.push({ type: 'letter-intro', letter }));

      // Select the name given the character
      group.forEach(letter => {
        const wrongs = allLetters
          .filter(l => l.char !== letter.char)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const options = [...wrongs.map(l => l.name), letter.name].sort(() => Math.random() - 0.5);
        steps.push({ type: 'select-name', letter, options, correct: options.indexOf(letter.name) });
      });

      // Select the character given the name
      group.forEach(letter => {
        const wrongs = allLetters
          .filter(l => l.char !== letter.char)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const options = [...wrongs.map(l => l.char), letter.char].sort(() => Math.random() - 0.5);
        steps.push({ type: 'select-char', letter, options, correct: options.indexOf(letter.char) });
      });

      // Match exercise for this group
      const rightItems = group
        .map((l, i) => ({ label: l.name, origIdx: i }))
        .sort(() => Math.random() - 0.5);
      steps.push({ type: 'match', leftItems: group.map(l => l.char), rightItems, isChar: true });
    }
  }

  // Key terms flow
  if (unit.keyTerms && unit.keyTerms.length >= 2) {
    const terms = unit.keyTerms;
    terms.forEach(term => steps.push({ type: 'vocab-intro', term }));
    terms.forEach(term => {
      const wrongs = terms
        .filter(t => t.term !== term.term)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [...wrongs.map(t => t.definition), term.definition].sort(() => Math.random() - 0.5);
      steps.push({ type: 'select-meaning', term, options, correct: options.indexOf(term.definition) });
    });
    if (terms.length >= 3) {
      const matchTerms = terms.slice(0, Math.min(5, terms.length));
      const rightItems = matchTerms
        .map((t, i) => ({ label: t.definition, origIdx: i }))
        .sort(() => Math.random() - 0.5);
      steps.push({ type: 'match', leftItems: matchTerms.map(t => t.term), rightItems, isChar: false });
    }
  }

  steps.push({ type: 'complete' });
  return steps;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HeartsRow({ count, max = MAX_HEARTS }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Heart
          key={i}
          size={18}
          fill={i < count ? '#ef4444' : 'none'}
          className={i < count ? 'text-red-500' : 'text-slate-600'}
        />
      ))}
    </div>
  );
}

function LetterIntroStep({ step, onContinue }) {
  const { letter } = step;
  return (
    <div className="text-center">
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-6">New Letter</p>
      <div
        className="text-[110px] leading-none font-bold text-white mb-4 select-none"
        style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
      >
        {letter.char}
      </div>
      {letter.lowercase && (
        <p className="text-4xl text-slate-300 mb-3" style={{ fontFamily: 'serif' }}>
          {letter.lowercase}
        </p>
      )}
      {letter.finalForm && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-slate-500 text-sm">Final form:</span>
          <span className="text-3xl text-slate-300" style={{ fontFamily: 'serif' }}>{letter.finalForm}</span>
        </div>
      )}
      <h2 className="text-3xl font-bold text-white mb-2">{letter.name}</h2>
      <p className="text-indigo-400 font-mono text-lg mb-1">{letter.transliteration}</p>
      <p className="text-slate-400 text-sm">{letter.sound}</p>
      <button
        onClick={onContinue}
        className="mt-10 w-full max-w-xs py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-lg transition-all mx-auto block"
      >
        Continue
      </button>
    </div>
  );
}

function VocabIntroStep({ step, onContinue }) {
  const { term } = step;
  return (
    <div className="text-center">
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-6">Key Term</p>
      <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-2xl p-8 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">{term.term}</h2>
        <p className="text-slate-300 text-lg leading-relaxed">{term.definition}</p>
      </div>
      <button
        onClick={onContinue}
        className="w-full max-w-xs py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-lg mx-auto block"
      >
        Got it!
      </button>
    </div>
  );
}

function SelectStep({ prompt, display, options, selected, result, correct, onSelect, isCharOptions }) {
  return (
    <div>
      <p className="text-slate-300 font-semibold text-center mb-6 text-lg">{prompt}</p>
      <div className="flex justify-center mb-8">{display}</div>
      <div className={`grid gap-3 ${isCharOptions ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((opt, i) => {
          let cls =
            'w-full py-4 px-5 rounded-xl border-2 font-semibold transition-all ';
          if (result !== null) {
            if (i === correct)
              cls += 'bg-emerald-900/40 border-emerald-500 text-emerald-300';
            else if (selected === i)
              cls += 'bg-red-900/40 border-red-500 text-red-300';
            else
              cls += 'bg-slate-800/30 border-slate-700 text-slate-500';
          } else {
            if (selected === i)
              cls += 'bg-indigo-900/40 border-indigo-400 text-white';
            else
              cls += 'bg-slate-800/50 border-slate-700 text-slate-200 hover:border-indigo-400 hover:bg-slate-700/50';
          }
          return (
            <button
              key={i}
              disabled={result !== null}
              onClick={() => onSelect(i)}
              className={`${cls} ${isCharOptions ? 'text-center text-4xl' : 'text-base text-left'}`}
              style={isCharOptions ? { fontFamily: '"SBL Hebrew","Ezra SIL",serif' } : {}}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MatchStep({ step, matchSel, matchPairs, matchChecked, onLeftClick, onRightClick, onCheck, onContinue, result }) {
  const allPaired = Object.keys(matchPairs).length === step.leftItems.length;
  const { isChar } = step;

  return (
    <div>
      <p className="text-slate-300 font-semibold text-center mb-6 text-lg">
        {isChar ? 'Match each character to its name' : 'Match each term to its definition'}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Left column */}
        <div className="space-y-2">
          <p className="text-xs text-indigo-400 uppercase tracking-widest text-center mb-2">
            {isChar ? 'Characters' : 'Terms'}
          </p>
          {step.leftItems.map((item, leftIdx) => {
            const isPaired = matchPairs[leftIdx] !== undefined;
            const isSelected = matchSel === leftIdx;
            const pairedRightIdx = matchPairs[leftIdx];
            const isCorrect =
              matchChecked &&
              isPaired &&
              step.rightItems[pairedRightIdx]?.origIdx === leftIdx;
            const isWrong = matchChecked && isPaired && !isCorrect;
            return (
              <button
                key={leftIdx}
                onClick={() => onLeftClick(leftIdx)}
                disabled={matchChecked}
                className={`w-full py-3 px-2 rounded-xl border-2 font-bold transition-all ${
                  isCorrect
                    ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300'
                    : isWrong
                    ? 'bg-red-900/40 border-red-500 text-red-300'
                    : isSelected
                    ? 'bg-indigo-900/40 border-indigo-400 text-white ring-2 ring-indigo-400/30'
                    : isPaired
                    ? 'bg-slate-700/60 border-slate-500 text-slate-200'
                    : 'bg-slate-800/50 border-slate-700 text-slate-200 hover:border-indigo-400'
                } ${isChar ? 'text-2xl text-center' : 'text-sm text-left'}`}
                style={isChar ? { fontFamily: '"SBL Hebrew","Ezra SIL",serif' } : {}}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          <p className="text-xs text-amber-400 uppercase tracking-widest text-center mb-2">
            {isChar ? 'Names' : 'Definitions'}
          </p>
          {step.rightItems.map((rightItem, rightColIdx) => {
            const pairedLeftKey = Object.keys(matchPairs).find(
              k => matchPairs[Number(k)] === rightColIdx
            );
            const isPaired = pairedLeftKey !== undefined;
            const pairedLeftIdx = isPaired ? Number(pairedLeftKey) : -1;
            const isCorrect =
              matchChecked && isPaired && rightItem.origIdx === pairedLeftIdx;
            const isWrong = matchChecked && isPaired && !isCorrect;
            const isClickable = !matchChecked && matchSel !== null;
            return (
              <button
                key={rightColIdx}
                onClick={() => onRightClick(rightColIdx)}
                disabled={matchChecked || matchSel === null}
                className={`w-full py-3 px-2 rounded-xl border-2 text-sm leading-snug transition-all text-left ${
                  isCorrect
                    ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300'
                    : isWrong
                    ? 'bg-red-900/40 border-red-500 text-red-300'
                    : isPaired && !matchChecked
                    ? 'bg-slate-700/60 border-amber-500/50 text-slate-200'
                    : isClickable
                    ? 'bg-amber-900/10 border-amber-500/50 text-slate-200 hover:border-amber-400 cursor-pointer'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 cursor-default'
                }`}
              >
                {rightItem.label}
              </button>
            );
          })}
        </div>
      </div>

      {!matchChecked ? (
        <button
          onClick={onCheck}
          disabled={!allPaired}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-xl transition-all"
        >
          Check ({Object.keys(matchPairs).length}/{step.leftItems.length} matched)
        </button>
      ) : (
        <div
          className={`mt-2 p-4 rounded-xl border-2 text-center ${
            result === 'correct'
              ? 'bg-emerald-900/20 border-emerald-500/50'
              : 'bg-red-900/20 border-red-500/50'
          }`}
        >
          <p
            className={`font-bold mb-3 ${
              result === 'correct' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {result === 'correct' ? '✓ All correct!' : '✗ Some matches were off'}
          </p>
          <button
            onClick={onContinue}
            className={`px-8 py-3 rounded-xl font-bold text-white ${
              result === 'correct'
                ? 'bg-emerald-500 hover:bg-emerald-400'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const LanguageLessonFlow = ({ unit, languageId, onComplete, onBack, userData, onBuyHeart }) => {
  const steps = useMemo(() => buildSteps(unit, languageId), [unit, languageId]);

  const [stepIdx, setStepIdx] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [selected, setSelected] = useState(null);
  const [stepResult, setStepResult] = useState(null);
  const [noLives, setNoLives] = useState(false);
  const [extraHeartsBought, setExtraHeartsBought] = useState(0);

  // Match state
  const [matchSel, setMatchSel] = useState(null);
  const [matchPairs, setMatchPairs] = useState({});
  const [matchChecked, setMatchChecked] = useState(false);

  const step = steps[stepIdx] || { type: 'complete' };

  const resetForNextStep = () => {
    setSelected(null);
    setStepResult(null);
    setMatchSel(null);
    setMatchPairs({});
    setMatchChecked(false);
  };

  const advance = () => {
    resetForNextStep();
    setStepIdx(i => i + 1);
  };

  const handleSelect = optIdx => {
    if (stepResult !== null) return;
    const isCorrect = optIdx === step.correct;
    setSelected(optIdx);
    setStepResult(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) setNoLives(true);
    }
  };

  const handleMatchLeftClick = leftIdx => {
    if (matchChecked) return;
    if (matchSel === leftIdx) {
      setMatchSel(null);
      return;
    }
    setMatchSel(leftIdx);
    if (matchPairs[leftIdx] !== undefined) {
      setMatchPairs(prev => {
        const n = { ...prev };
        delete n[leftIdx];
        return n;
      });
    }
  };

  const handleMatchRightClick = rightColIdx => {
    if (matchChecked || matchSel === null) return;
    setMatchPairs(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[Number(k)] === rightColIdx) delete next[Number(k)];
      });
      next[matchSel] = rightColIdx;
      return next;
    });
    setMatchSel(null);
  };

  const checkMatch = () => {
    const allCorrect = step.leftItems.every(
      (_, leftIdx) =>
        matchPairs[leftIdx] !== undefined &&
        step.rightItems[matchPairs[leftIdx]]?.origIdx === leftIdx
    );
    setMatchChecked(true);
    setStepResult(allCorrect ? 'correct' : 'incorrect');
    if (!allCorrect) {
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      if (newHearts <= 0) setNoLives(true);
    }
  };

  const restartLesson = () => {
    resetForNextStep();
    setStepIdx(0);
    setHearts(MAX_HEARTS);
    setNoLives(false);
    setExtraHeartsBought(0);
  };

  const handleBuyHeart = () => {
    if (extraHeartsBought >= MAX_EXTRA_HEARTS) return;
    if ((userData?.totalPoints || 0) < HEART_COST) return;
    onBuyHeart && onBuyHeart(HEART_COST);
    setExtraHeartsBought(n => n + 1);
    setHearts(1);
    setNoLives(false);
  };

  // ── No lives screen ───────────────────────────────────────────
  if (noLives) {
    const canAfford = (userData?.totalPoints || 0) >= HEART_COST;
    const heartsLeft = MAX_EXTRA_HEARTS - extraHeartsBought;
    const canBuy = heartsLeft > 0 && canAfford;

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-3xl font-bold text-white mb-2">Out of Hearts!</h2>
        <p className="text-slate-400 mb-6">
          Don't give up — you can buy an extra heart to keep going!
        </p>

        {/* Buy heart option */}
        {heartsLeft > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-6 w-full max-w-sm">
            <p className="text-slate-300 text-sm mb-3">
              Extra hearts available:{' '}
              <span className="text-red-400 font-bold">
                {heartsLeft} remaining
              </span>
            </p>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: MAX_EXTRA_HEARTS }).map((_, i) => (
                <Heart
                  key={i}
                  size={22}
                  fill={i < heartsLeft ? '#ef4444' : 'none'}
                  className={i < heartsLeft ? 'text-red-500' : 'text-slate-700'}
                />
              ))}
            </div>
            <button
              onClick={handleBuyHeart}
              disabled={!canBuy}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                canBuy
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Heart size={16} fill={canBuy ? 'white' : 'none'} />
              {canAfford
                ? `Buy +1 Heart — ${HEART_COST} pts`
                : `Not enough points (need ${HEART_COST})`}
            </button>
            {!canAfford && (
              <p className="text-slate-500 text-xs mt-2">
                You have {userData?.totalPoints || 0} pts
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={restartLesson}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
          >
            <RotateCcw size={18} /> Try Again
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>
    );
  }

  // ── Complete screen ───────────────────────────────────────────
  if (step.type === 'complete') {
    const stars = hearts >= 4 ? '⭐⭐⭐' : hearts >= 2 ? '⭐⭐' : '⭐';
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">{stars}</div>
        <h2 className="text-4xl font-bold text-white mb-2">Lesson Complete!</h2>
        <p className="text-slate-400 mb-4">{unit.title}</p>
        <div className="flex items-center justify-center gap-2 mb-8">
          <HeartsRow count={hearts} />
          <span className="text-slate-400 text-sm ml-2">
            {hearts} heart{hearts !== 1 ? 's' : ''} left
          </span>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={restartLesson}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
          >
            <RotateCcw size={18} /> Practice Again
          </button>
          <button
            onClick={onComplete}
            className="px-10 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold rounded-xl text-lg transition-all"
          >
            Take Quiz →
          </button>
        </div>
      </div>
    );
  }

  const isSelectStep = ['select-name', 'select-char', 'select-meaning'].includes(step.type);
  const showFeedbackBar = isSelectStep && stepResult !== null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex-shrink-0">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.round((stepIdx / (steps.length - 1)) * 100)}%` }}
          />
        </div>
        <HeartsRow count={hearts} />
      </div>

      {/* Content area */}
      <div
        className={`flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto ${
          showFeedbackBar ? 'pb-32' : 'pb-8'
        }`}
      >
        <div className="w-full max-w-2xl">
          {step.type === 'letter-intro' && (
            <LetterIntroStep step={step} onContinue={advance} />
          )}

          {step.type === 'vocab-intro' && (
            <VocabIntroStep step={step} onContinue={advance} />
          )}

          {step.type === 'select-name' && (
            <SelectStep
              prompt="What is the name of this letter?"
              display={
                <div className="text-center">
                  <div
                    className="text-[90px] leading-none font-bold text-white select-none"
                    style={{ fontFamily: '"SBL Hebrew","Ezra SIL",serif' }}
                  >
                    {step.letter.char}
                  </div>
                  <p className="text-slate-400 mt-2">
                    <span className="text-indigo-400 font-mono">{step.letter.transliteration}</span>
                    {' · '}
                    {step.letter.sound}
                  </p>
                </div>
              }
              options={step.options}
              selected={selected}
              result={stepResult}
              correct={step.correct}
              onSelect={handleSelect}
              isCharOptions={false}
            />
          )}

          {step.type === 'select-char' && (
            <SelectStep
              prompt="Which character is this?"
              display={
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{step.letter.name}</p>
                  <p className="text-slate-400 mt-2">
                    <span className="text-indigo-400 font-mono">{step.letter.transliteration}</span>
                    {' · '}
                    {step.letter.sound}
                  </p>
                </div>
              }
              options={step.options}
              selected={selected}
              result={stepResult}
              correct={step.correct}
              onSelect={handleSelect}
              isCharOptions={true}
            />
          )}

          {step.type === 'select-meaning' && (
            <SelectStep
              prompt={`What does "${step.term.term}" mean?`}
              display={
                <p className="text-3xl font-bold text-white text-center">{step.term.term}</p>
              }
              options={step.options}
              selected={selected}
              result={stepResult}
              correct={step.correct}
              onSelect={handleSelect}
              isCharOptions={false}
            />
          )}

          {step.type === 'match' && (
            <MatchStep
              step={step}
              matchSel={matchSel}
              matchPairs={matchPairs}
              matchChecked={matchChecked}
              onLeftClick={handleMatchLeftClick}
              onRightClick={handleMatchRightClick}
              onCheck={checkMatch}
              onContinue={advance}
              result={stepResult}
            />
          )}
        </div>
      </div>

      {/* Feedback bar (select steps only) */}
      {showFeedbackBar && (
        <div
          className={`fixed bottom-0 left-0 right-0 p-4 border-t-2 transition-all ${
            stepResult === 'correct'
              ? 'bg-emerald-950 border-emerald-500'
              : 'bg-red-950 border-red-500'
          }`}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p
                className={`text-lg font-bold ${
                  stepResult === 'correct' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {stepResult === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              {stepResult === 'incorrect' && step.options && (
                <p className="text-slate-300 text-sm mt-0.5">
                  Answer:{' '}
                  <span className="text-white font-semibold">
                    {step.options[step.correct]}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={advance}
              className={`px-8 py-3 rounded-xl font-bold text-white flex-shrink-0 ${
                stepResult === 'correct'
                  ? 'bg-emerald-500 hover:bg-emerald-400'
                  : 'bg-red-500 hover:bg-red-400'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageLessonFlow;
