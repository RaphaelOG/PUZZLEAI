import React, { createContext, useContext, useState } from 'react';

const PuzzlesSolvedContext = createContext(null);

export function PuzzlesSolvedProvider({ children }) {
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);

  const incrementPuzzlesSolved = () => {
    setPuzzlesSolved((n) => n + 1);
  };

  return (
    <PuzzlesSolvedContext.Provider value={{ puzzlesSolved, incrementPuzzlesSolved }}>
      {children}
    </PuzzlesSolvedContext.Provider>
  );
}

export function usePuzzlesSolved() {
  const ctx = useContext(PuzzlesSolvedContext);
  if (!ctx) throw new Error('usePuzzlesSolved must be used within PuzzlesSolvedProvider');
  return ctx;
}
