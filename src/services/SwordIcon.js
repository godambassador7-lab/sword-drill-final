// SwordIcon.js
// ============================================
// Sword Emoji Icon Component
// ============================================

import React, { useMemo } from 'react';

export const SwordIcon = React.memo(({ size = 32, className = '' }) => {
  // ✅ PERFORMANCE: Memoize style object to prevent recreation on every render
  const iconStyle = useMemo(() => ({
    fontSize: size,
    display: 'inline-block',
    verticalAlign: 'middle',
    userSelect: 'none',
  }), [size]);

  return (
    <span
      style={iconStyle}
      className={className}
      role="img"
      aria-label="Sword"
    >
      🗡️
    </span>
  );
});

SwordIcon.displayName = 'SwordIcon';

export default SwordIcon;