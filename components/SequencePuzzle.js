import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { usePuzzleSolved } from './usePuzzleSolved';

const COLORS = [
  { id: 'red', label: 'Red', bg: '#ef4444' },
  { id: 'blue', label: 'Blue', bg: '#3b82f6' },
  { id: 'yellow', label: 'Yellow', bg: '#eab308' },
  { id: 'purple', label: 'Purple', bg: '#a855f7' },
];

function createSequence(length = 4) {
  return Array.from({ length }, () => COLORS[Math.floor(Math.random() * COLORS.length)].id);
}

export default function SequencePuzzle({ onSolved }) {
  const sequence = useMemo(() => createSequence(), []);
  const [phase, setPhase] = useState('watch');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [userIndex, setUserIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const markSolved = usePuzzleSolved(onSolved);

  useEffect(() => {
    let cancelled = false;
    const showSequence = async () => {
      await new Promise((r) => setTimeout(r, 600));
      for (let i = 0; i < sequence.length; i += 1) {
        if (cancelled) return;
        setHighlightIndex(i);
        await new Promise((r) => setTimeout(r, 700));
        setHighlightIndex(-1);
        await new Promise((r) => setTimeout(r, 200));
      }
      if (!cancelled) {
        setPhase('repeat');
        setFeedback('Your turn — tap the colors in order');
      }
    };
    showSequence();
    return () => {
      cancelled = true;
    };
  }, [sequence]);

  const handleColorPress = (colorId) => {
    if (phase !== 'repeat') return;

    if (sequence[userIndex] === colorId) {
      const nextIndex = userIndex + 1;
      setUserIndex(nextIndex);
      setFeedback(`Correct! ${nextIndex}/${sequence.length}`);

      if (nextIndex === sequence.length) {
        markSolved();
      }
      return;
    }

    setFeedback('Wrong order — watch again');
    setUserIndex(0);
    setPhase('watch');
    setHighlightIndex(-1);

    setTimeout(async () => {
      for (let i = 0; i < sequence.length; i += 1) {
        setHighlightIndex(i);
        await new Promise((r) => setTimeout(r, 700));
        setHighlightIndex(-1);
        await new Promise((r) => setTimeout(r, 200));
      }
      setPhase('repeat');
      setFeedback('Your turn — tap the colors in order');
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {phase === 'watch' ? 'Watch the sequence…' : 'Repeat the sequence'}
      </Text>

      <View style={styles.sequencePreview}>
        {sequence.map((colorId, index) => {
          const color = COLORS.find((c) => c.id === colorId);
          const isHighlighted = highlightIndex === index;
          return (
            <View
              key={index}
              style={[
                styles.previewDot,
                { backgroundColor: color.bg },
                isHighlighted && styles.previewDotActive,
                phase === 'repeat' && styles.previewDotDim,
              ]}
            />
          );
        })}
      </View>

      <View style={styles.colorGrid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={[styles.colorButton, { backgroundColor: color.bg }]}
            onPress={() => handleColorPress(color.id)}
            activeOpacity={0.85}
            disabled={phase !== 'repeat'}
          />
        ))}
      </View>

      <Text style={styles.feedback}>{feedback}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sequencePreview: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  previewDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.5,
  },
  previewDotActive: {
    opacity: 1,
    transform: [{ scale: 1.4 }],
  },
  previewDotDim: {
    opacity: 0.25,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    gap: 12,
    justifyContent: 'center',
  },
  colorButton: {
    width: 88,
    height: 88,
    borderRadius: 20,
    opacity: 0.95,
  },
  feedback: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    minHeight: 20,
  },
});
