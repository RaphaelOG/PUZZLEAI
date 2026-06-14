import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { PUZZLE_OPTIONS } from '../constants/puzzleTypes';
import { usePuzzleSettings } from '../context/PuzzleSettingsContext';

function DifficultyBadge({ difficulty, accent }) {
  return (
    <View style={[styles.badge, { borderColor: accent }]}>
      <Text style={[styles.badgeText, { color: accent }]}>{difficulty}</Text>
    </View>
  );
}

function PuzzleOptionCard({ option, selected, onSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && { borderColor: option.accent, backgroundColor: '#111827' },
      ]}
      onPress={() => onSelect(option.id)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.emojiCircle, { backgroundColor: `${option.accent}22` }]}>
          <Text style={styles.emoji}>{option.emoji}</Text>
        </View>
        <View style={styles.cardTitles}>
          <Text style={styles.cardTitle}>{option.title}</Text>
          <DifficultyBadge difficulty={option.difficulty} accent={option.accent} />
        </View>
        {selected && (
          <View style={[styles.checkCircle, { backgroundColor: option.accent }]}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardDescription}>{option.description}</Text>
    </TouchableOpacity>
  );
}

export default function PuzzleOptionsScreen() {
  const { selectedPuzzleType, setSelectedPuzzleType } = usePuzzleSettings();
  const activeOption = PUZZLE_OPTIONS.find((o) => o.id === selectedPuzzleType);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Choose your puzzle</Text>
        <Text style={styles.subtitle}>
          Pick the wake-up challenge that works best for you. Your choice applies to the next alarm.
        </Text>
      </View>

      <View style={styles.activeBanner}>
        <Text style={styles.activeLabel}>Currently selected</Text>
        <View style={styles.activeRow}>
          <Text style={styles.activeEmoji}>{activeOption?.emoji}</Text>
          <Text style={styles.activeName}>{activeOption?.title}</Text>
        </View>
      </View>

      <View style={styles.cardList}>
        {PUZZLE_OPTIONS.map((option) => (
          <PuzzleOptionCard
            key={option.id}
            option={option}
            selected={selectedPuzzleType === option.id}
            onSelect={setSelectedPuzzleType}
          />
        ))}
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Tip</Text>
        <Text style={styles.tipText}>
          Start with Sliding Tiles if you are new. Switch to Math or Memory Sequence when you want
          more of a challenge.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 21,
  },
  activeBanner: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#22c55e',
    marginBottom: 20,
  },
  activeLabel: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activeEmoji: {
    fontSize: 28,
  },
  activeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  cardList: {
    gap: 14,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  cardTitles: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#020617',
    fontSize: 14,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  tipBox: {
    marginTop: 24,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  tipTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
});
