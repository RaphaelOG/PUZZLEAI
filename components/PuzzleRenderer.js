import React from 'react';
import { PUZZLE_TYPES } from '../constants/puzzleTypes';
import SlidingPuzzle from './SlidingPuzzle';
import MathPuzzle from './MathPuzzle';
import SequencePuzzle from './SequencePuzzle';
import WordScramblePuzzle from './WordScramblePuzzle';

export default function PuzzleRenderer({ type, onSolved }) {
  switch (type) {
    case PUZZLE_TYPES.MATH:
      return <MathPuzzle onSolved={onSolved} />;
    case PUZZLE_TYPES.SEQUENCE:
      return <SequencePuzzle onSolved={onSolved} />;
    case PUZZLE_TYPES.WORD:
      return <WordScramblePuzzle onSolved={onSolved} />;
    case PUZZLE_TYPES.SLIDING:
    default:
      return <SlidingPuzzle onSolved={onSolved} />;
  }
}
