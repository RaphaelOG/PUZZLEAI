import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePuzzlesSolved } from '../context/PuzzlesSolvedContext';

export default function PuzzlesSolvedScreen() {
  const { puzzlesSolved } = usePuzzlesSolved();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzles solved</Text>
      <Text style={styles.count}>{puzzlesSolved}</Text>
      <Text style={styles.hint}>Complete wake-up puzzles to increase this count.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
    paddingTop: 56,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f4f4f5',
    marginBottom: 12,
  },
  count: {
    fontSize: 64,
    fontWeight: '800',
    color: '#22c55e',
    marginVertical: 16,
  },
  hint: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
});
