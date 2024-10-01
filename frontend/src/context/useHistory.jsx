// context/useHistory.js or HistoryProvider.js
import React, { createContext, useState, useContext } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const toggleHistory = () => {
    setShowFullHistory((prev) => !prev);
  };

  return (
    <HistoryContext.Provider value={{ showFullHistory, toggleHistory }}>
      {children} {/* Ensure children is passed here */}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => useContext(HistoryContext);
