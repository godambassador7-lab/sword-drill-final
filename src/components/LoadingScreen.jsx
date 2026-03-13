import React, { useState, useEffect } from 'react';

const STAGES = [
  { percent: 0,   text: 'Initializing...' },
  { percent: 12,  text: 'Loading Scripture...' },
  { percent: 28,  text: 'Preparing Quizzes...' },
  { percent: 44,  text: 'Loading User Data...' },
  { percent: 60,  text: 'Setting Up Courses...' },
  { percent: 74,  text: 'Configuring Calendar...' },
  { percent: 88,  text: 'Almost Ready...' },
  { percent: 100, text: 'Welcome!' },
];

// Interpolate between two hex colours by t ∈ [0,1]
function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bv})`;
}

// Returns two stop colours for the progress gradient based on 0–100
function getBarColors(pct) {
  const stops = [
    [0,   '#ef4444', '#f97316'],  // red → orange
    [33,  '#f97316', '#facc15'],  // orange → yellow
    [66,  '#22c55e', '#3b82f6'],  // green → blue
    [100, '#8b5cf6', '#06b6d4'],  // violet → cyan
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (pct >= stops[i][0] && pct <= stops[i + 1][0]) {
      lo = stops[i]; hi = stops[i + 1]; break;
    }
  }
  const t = lo[0] === hi[0] ? 1 : (pct - lo[0]) / (hi[0] - lo[0]);
  return [lerpColor(lo[1], hi[1], t), lerpColor(lo[2], hi[2], t)];
}

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [stageText, setStageText] = useState(STAGES[0].text);
  const [done, setDone] = useState(false);

  // Drive the stage-based progress
  useEffect(() => {
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      if (idx < STAGES.length) {
        setProgress(STAGES[idx].percent);
        setStageText(STAGES[idx].text);
      } else {
        clearInterval(iv);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => onComplete && onComplete(), 400);
        }, 400);
      }
    }, 320);
    return () => clearInterval(iv);
  }, []);

  // Smoothly animate the displayed percentage
  useEffect(() => {
    const step = () => {
      setDisplayPct(prev => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) return progress;
        return prev + diff * 0.12;
      });
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [progress, displayPct]);

  const [c1, c2] = getBarColors(displayPct);
  const rounded = Math.round(displayPct);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${done ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0f172a 0%, #020617 70%)' }}
    >
      {/* Ambient glow behind content */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '480px',
          height: '320px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          background: `radial-gradient(ellipse, ${c1}22 0%, transparent 70%)`,
          transition: 'background 0.6s ease',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative w-full max-w-sm px-8 flex flex-col items-center">

        {/* Flame icon */}
        <div className="relative mb-6" style={{ width: 56, height: 72 }}>
          <svg width="56" height="72" viewBox="0 0 24 32" fill="none"
            className="absolute inset-0" style={{ animation: 'flameOuter 2.4s ease-in-out infinite' }}>
            <path d="M12 2C10 5 8 8 8 12C8 13.5 8.5 15 9.5 16.5C8 15.5 6.5 13.5 6.5 11C4 14 3 18 3 22C3 27.5 7 32 12 32C17 32 21 27.5 21 22C21 17 19 13 16.5 10C17 13 16.5 16 14.5 18C15 15 14 11 12 2Z"
              fill="#f97316" opacity="0.92" />
          </svg>
          <svg width="44" height="60" viewBox="0 0 20 28" fill="none"
            className="absolute" style={{ left: 6, top: 6, animation: 'flameMid 2s ease-in-out infinite', animationDelay: '0.15s' }}>
            <path d="M10 1C8.5 3.5 7 6 7 9C7 10.5 7.5 11.5 8 12.5C7 12 6 10.5 6 9C4 11.5 3 14 3 17.5C3 22 6.5 26 10 26C13.5 26 17 22 17 17.5C17 13.5 15.5 10.5 13.5 8C14 10.5 13.5 12.5 12 14C12.5 11.5 11.5 8 10 1Z"
              fill="#fbbf24" opacity="0.88" />
          </svg>
          <svg width="30" height="46" viewBox="0 0 14 22" fill="none"
            className="absolute" style={{ left: 13, top: 14, animation: 'flameInner 1.6s ease-in-out infinite', animationDelay: '0.3s' }}>
            <path d="M7 1C6 2.5 5 4.5 5 6.5C5 7.5 5.5 8.5 6 9C5.5 8.5 5 7.5 5 6.5C3.5 8.5 3 10.5 3 13C3 16.866 5.134 20 7 20C8.866 20 12 16.866 12 13C12 10 11 8 9.5 6.5C10 8 9.5 9.5 8.5 10.5C9 8.5 8 5.5 7 1Z"
              fill="#fde047" opacity="0.96" />
          </svg>
        </div>

        {/* App title */}
        <h1
          className="text-5xl font-black tracking-tight mb-1 select-none"
          style={{
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: `drop-shadow(0 0 18px ${c1}99)`,
            transition: 'filter 0.5s ease, background 0.5s ease',
          }}
        >
          Sword Drill
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase mb-10">
          Bible Memory Training
        </p>

        {/* Stage text */}
        <p
          className="text-slate-300 text-sm font-medium mb-3 tracking-wide"
          style={{ minHeight: '1.25rem', transition: 'opacity 0.3s' }}
        >
          {stageText}
        </p>

        {/* Progress bar track */}
        <div className="relative w-full mb-3">
          {/* Glow layer behind bar */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              height: '100%',
              width: `${displayPct}%`,
              background: `linear-gradient(90deg, ${c1}, ${c2})`,
              filter: 'blur(8px)',
              opacity: 0.65,
              transition: 'width 0.3s ease-out, background 0.5s ease',
            }}
          />
          {/* Track */}
          <div className="relative w-full h-4 bg-slate-800/70 rounded-full overflow-hidden border border-slate-700/50">
            {/* Fill */}
            <div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: `${displayPct}%`,
                background: `linear-gradient(90deg, ${c1}, ${c2})`,
                transition: 'width 0.3s ease-out, background 0.5s ease',
                boxShadow: `0 0 12px ${c2}cc`,
              }}
            >
              {/* Shimmer sweep */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                  animation: 'shimmer 1.8s infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Percentage label */}
        <div className="flex justify-end w-full">
          <span
            className="text-3xl font-black tabular-nums"
            style={{
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 8px ${c1}88)`,
              transition: 'filter 0.4s, background 0.5s',
            }}
          >
            {rounded}%
          </span>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-2 mt-8">
          {[c1, lerpColor(c1, c2, 0.5), c2].map((col, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: col,
                boxShadow: `0 0 8px ${col}`,
                animation: 'bounce 1s infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes flameOuter {
          0%, 100% { transform: scaleX(1)   scaleY(1)   translateY(0); }
          50%       { transform: scaleX(0.94) scaleY(1.06) translateY(-2px); }
        }
        @keyframes flameMid {
          0%, 100% { transform: scaleX(1)   scaleY(1)   translateY(0); }
          50%       { transform: scaleX(0.9)  scaleY(1.1)  translateY(-3px); }
        }
        @keyframes flameInner {
          0%, 100% { transform: scaleX(1)   scaleY(1)   translateY(0); }
          50%       { transform: scaleX(0.85) scaleY(1.15) translateY(-4px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
