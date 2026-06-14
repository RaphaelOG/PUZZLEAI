import React, { createContext, useContext, useState } from 'react';
import { PUZZLE_TYPES } from '../constants/puzzleTypes';

const PuzzleSettingsContext = createContext(null);

export function PuzzleSettingsProvider({ children }) {
  const [selectedPuzzleType, setSelectedPuzzleType] = useState(PUZZLE_TYPES.SLIDING);

  return (
    <PuzzleSettingsContext.Provider value={{ selectedPuzzleType, setSelectedPuzzleType }}>
      {children}
    </PuzzleSettingsContext.Provider>
  );
}

export function usePuzzleSettings() {
  const ctx = useContext(PuzzleSettingsContext);
  if (!ctx) {
    throw new Error('usePuzzleSettings must be used within PuzzleSettingsProvider');
  }
  return ctx;
}
