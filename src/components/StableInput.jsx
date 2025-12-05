import React from 'react';

// Stable input component that doesn't re-render on every keystroke
const StableInput = React.memo(({
  defaultValue,
  onChange,
  placeholder,
  className,
  autoFocus,
  autoComplete,
  type = "text",
  onKeyPress
}) => {
  const handleInput = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type={type}
      defaultValue={defaultValue}
      onInput={handleInput}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={className}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  // Don't re-render when parent component re-renders
  return (
    prevProps.defaultValue === nextProps.defaultValue &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className
  );
});

export default StableInput;
