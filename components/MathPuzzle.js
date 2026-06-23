import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { usePuzzleSolved } from './usePuzzleSolved';

function createProblem() {
  const a = Math.floor(Math.random() * 12) + 5;
  const b = Math.floor(Math.random() * 12) + 3;
  const useAddition = Math.random() > 0.4;
  if (useAddition) {
    return { text: `${a} + ${b}`, answer: a + b };
  }
  const larger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return { text: `${larger} − ${smaller}`, answer: larger - smaller };
}

export default function MathPuzzle({ onSolved }) {
  const problem = useMemo(() => createProblem(), []);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const markSolved = usePuzzleSolved(onSolved);

  const handleDigit = (digit) => {
    if (input.length >= 3) return;
    setError(false);
    setInput((current) => current + digit);
  };

  const handleClear = () => {
    setError(false);
    setInput('');
  };

  const handleSubmit = () => {
    const value = parseInt(input, 10);
    if (value === problem.answer) {
      markSolved();
      return;
    }
    setError(true);
    setInput('');
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'];

  return (
    <View style={styles.container}>
      <View style={styles.problemCard}>
        <Text style={styles.problemLabel}>Solve to stop the alarm</Text>
        <Text style={styles.problemText}>{problem.text} = ?</Text>
        <Text style={[styles.answerDisplay, error && styles.answerError]}>
          {input || '—'}
        </Text>
        {error && <Text style={styles.errorText}>Wrong answer — try again!</Text>}
      </View>

      <View style={styles.keypad}>
        {digits.map((digit) => (
          <TouchableOpacity
            key={digit}
            style={[
              styles.key,
              digit === '✓' && styles.keySubmit,
              digit === 'C' && styles.keyClear,
            ]}
            onPress={() => {
              if (digit === 'C') handleClear();
              else if (digit === '✓') handleSubmit();
              else handleDigit(digit);
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.keyText,
                (digit === '✓' || digit === 'C') && styles.keyTextAccent,
              ]}
            >
              {digit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  problemCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  problemLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  problemText: {
    marginTop: 12,
    fontSize: 36,
    fontWeight: '700',
    color: '#f8fafc',
  },
  answerDisplay: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '600',
    color: '#60a5fa',
    minHeight: 36,
  },
  answerError: {
    color: '#f87171',
  },
  errorText: {
    marginTop: 8,
    color: '#f87171',
    fontSize: 13,
  },
  keypad: {
    marginTop: 20,
    width: 240,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  key: {
    width: 70,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyClear: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  keySubmit: {
    backgroundColor: '#2563eb',
  },
  keyText: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: '600',
  },
  keyTextAccent: {
    color: '#ffffff',
  },
});
