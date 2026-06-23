import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_ALARM_SOUND_ID } from '../constants/alarmSounds';
import { PUZZLE_TYPES } from '../constants/puzzleTypes';

const PuzzleSettingsContext = createContext(null);

export function PuzzleSettingsProvider({ children }) {
  const [selectedPuzzleType, setSelectedPuzzleType] = useState(PUZZLE_TYPES.SLIDING);
  const [selectedAlarmSoundId, setSelectedAlarmSoundId] = useState(DEFAULT_ALARM_SOUND_ID);

  return (
    <PuzzleSettingsContext.Provider
      value={{
        selectedPuzzleType,
        setSelectedPuzzleType,
        selectedAlarmSoundId,
        setSelectedAlarmSoundId,
      }}
    >
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
