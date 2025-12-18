import React, { createContext, useContext } from 'react';

const FocusContext = createContext(null);

export const FocusProvider = ({ children, value }) => {
  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

export default FocusContext;
