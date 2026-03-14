import React from 'react';

const STRENGTH_STYLES = {
  High: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
  Moderate: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
  Low: 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
};

const SourceStrengthBadge = ({ tier = 'Moderate', className = '' }) => {
  const style = STRENGTH_STYLES[tier] || STRENGTH_STYLES.Moderate;
  return (
    <span className={`text-xs px-2 py-1 rounded ${style} ${className}`.trim()}>
      {tier}
    </span>
  );
};

export default SourceStrengthBadge;
