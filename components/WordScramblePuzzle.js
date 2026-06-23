import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { usePuzzleSolved } from './usePuzzleSolved';

const WORDS = ['WAKE', 'RISE', 'ALERT', 'BRIGHT', 'FOCUS', 'ENERGY'];

function scrambleWord(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join('') === word) {
    return scrambleWord(word);
  }
  return letters;
}

export default function WordScramblePuzzle({ onSolved }) {
  const targetWord = useMemo(() => WORDS[Math.floor(Math.random() * WORDS.length)], []);
  const [available, setAvailable] = useState(() => scrambleWord(targetWord));
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(false);
  const markSolved = usePuzzleSolved(onSolved);

  const handlePickLetter = (index) => {
    setError(false);
    const letter = available[index];
    const nextAvailable = available.filter((_, i) => i !== index);
    const nextSelected = [...selected, letter];
    setAvailable(nextAvailable);
    setSelected(nextSelected);

    if (nextSelected.length === targetWord.length) {
      if (nextSelected.join('') === targetWord) {
        markSolved();
      } else {
        setError(true);
        setTimeout(() => {
          setAvailable(scrambleWord(targetWord));
          setSelected([]);
          setError(false);
        }, 600);
      }
    }
  };

  const handleRemoveLast = () => {
    if (selected.length === 0) return;
    setError(false);
    const last = selected[selected.length - 1];
    setSelected(selected.slice(0, -1));
    setAvailable([...available, last]);
  };

  const handleReset = () => {
    setError(false);
    setSelected([]);
    setAvailable(scrambleWord(targetWord));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Unscramble the wake-up word</Text>

      <View style={[styles.answerBox, error && styles.answerBoxError]}>
        <Text style={styles.answerText}>
          {selected.length > 0 ? selected.join('') : 'Tap letters below'}
        </Text>
      </View>

      <View style={styles.letterRow}>
        {available.map((letter, index) => (
          <TouchableOpacity
            key={`${letter}-${index}`}
            style={styles.letterTile}
            onPress={() => handlePickLetter(index)}
            activeOpacity={0.8}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleRemoveLast}>
          <Text style={styles.actionText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
          <Text style={styles.actionText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>Not quite — try again!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 12,
  },
  answerBox: {
    width: '100%',
    minHeight: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#60a5fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  answerBoxError: {
    borderColor: '#ef4444',
  },
  answerText: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
  },
  letterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    maxWidth: 280,
  },
  letterTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 12,
    color: '#f87171',
    fontSize: 13,
  },
});
