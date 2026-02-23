import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react';

const MAX_HEARTS = 3;

// ── Step Builder ──────────────────────────────────────────────────────────────
function buildSteps(unit) {
  const steps = [];
  const allLetters = unit.letters || [];

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

function HeartsRow({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Heart
          key={i}
          size={20}
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
const LanguageLessonFlow = ({ unit, onComplete, onBack }) => {
  const steps = useMemo(() => buildSteps(unit), [unit]);

  const [stepIdx, setStepIdx] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [selected, setSelected] = useState(null);
  const [stepResult, setStepResult] = useState(null);
  const [noLives, setNoLives] = useState(false);

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
  };

  // ── No lives screen ───────────────────────────────────────────
  if (noLives) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-3xl font-bold text-white mb-2">Out of Hearts!</h2>
        <p className="text-slate-400 mb-8">
          Don't worry — practice makes perfect. Try this lesson again!
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={restartLesson}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all"
          >
            <RotateCcw size={18} /> Try Again
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>
    );
  }

  // ── Complete screen ───────────────────────────────────────────
  if (step.type === 'complete') {
    const stars = hearts >= 3 ? '⭐⭐⭐' : hearts >= 2 ? '⭐⭐' : '⭐';
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
                <div
                  className="text-[90px] leading-none font-bold text-white select-none"
                  style={{ fontFamily: '"SBL Hebrew","Ezra SIL",serif' }}
                >
                  {step.letter.char}
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
