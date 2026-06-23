export const PUZZLE_TYPES = {
  SLIDING: 'sliding',
  MATH: 'math',
  SEQUENCE: 'sequence',
  WORD: 'word',
};

export const PUZZLE_OPTIONS = [
  {
    id: PUZZLE_TYPES.SLIDING,
    title: 'Sliding Tiles',
    emoji: '🔢',
    description: 'Slide numbered tiles into order with the empty space in the corner.',
    difficulty: 'Easy',
    accent: '#60a5fa',
  },
  {
    id: PUZZLE_TYPES.MATH,
    title: 'Math Challenge',
    emoji: '➕',
    description: 'Solve a quick arithmetic problem to prove you are awake.',
    difficulty: 'Medium',
    accent: '#3b82f6',
  },
  {
    id: PUZZLE_TYPES.SEQUENCE,
    title: 'Memory Sequence',
    emoji: '🎨',
    description: 'Watch the color pattern, then repeat it in the same order.',
    difficulty: 'Medium',
    accent: '#2563eb',
  },
  {
    id: PUZZLE_TYPES.WORD,
    title: 'Word Scramble',
    emoji: '🔤',
    description: 'Unscramble the letters to spell a wake-up word.',
    difficulty: 'Hard',
    accent: '#1d4ed8',
  },
];

export function getPuzzleOption(id) {
  return PUZZLE_OPTIONS.find((option) => option.id === id) ?? PUZZLE_OPTIONS[0];
}
