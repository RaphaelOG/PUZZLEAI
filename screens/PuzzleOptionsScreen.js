import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import DashboardCard from '../components/DashboardCard';
import { PUZZLE_OPTIONS } from '../constants/puzzleTypes';
import { colors, layout, puzzleColors } from '../constants/theme';
import { usePuzzleSettings } from '../context/PuzzleSettingsContext';

function PuzzleOptionCard({ option, selected, onSelect }) {
  const accent = puzzleColors[option.id] ?? colors.primary;

  return (
    <TouchableOpacity onPress={() => onSelect(option.id)} activeOpacity={0.85}>
      <DashboardCard style={[styles.card, selected && styles.cardSelected]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: accent }]}>
            <Text style={styles.iconText}>{option.title.charAt(0)}</Text>
          </View>
          <View style={styles.cardTitles}>
            <Text style={styles.cardTitle}>{option.title}</Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: accent }]}>{option.difficulty}</Text>
            </View>
          </View>
          {selected && (
            <View style={[styles.checkCircle, { backgroundColor: accent }]}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDescription}>{option.description}</Text>
      </DashboardCard>
    </TouchableOpacity>
  );
}

export default function PuzzleOptionsScreen() {
  const { selectedPuzzleType, setSelectedPuzzleType } = usePuzzleSettings();
  const activeOption = PUZZLE_OPTIONS.find((o) => o.id === selectedPuzzleType);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Wake-up challenges</Text>
        <Text style={styles.title}>Puzzles</Text>
        <Text style={styles.subtitle}>
          Pick the challenge that works best for you. Your choice applies to the next alarm.
        </Text>

        <DashboardCard variant="active" style={styles.activeBanner}>
          <Text style={styles.activeLabel}>Currently selected</Text>
          <Text style={styles.activeName}>{activeOption?.title}</Text>
          <Text style={styles.activeDiff}>{activeOption?.difficulty}</Text>
        </DashboardCard>

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

        <DashboardCard style={styles.tipBox}>
          <Text style={styles.tipTitle}>Tip</Text>
          <Text style={styles.tipText}>
            Start with Sliding Tiles if you are new. Switch to Math or Memory Sequence when you
            want more of a challenge.
          </Text>
        </DashboardCard>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.screenTop,
    paddingBottom: layout.screenBottom,
  },
  greeting: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  activeBanner: {
    marginBottom: 20,
    padding: 18,
  },
  activeLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  activeName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  activeDiff: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  cardList: {
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardTitles: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
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
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  cardDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  tipBox: {
    marginTop: 24,
    padding: 16,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  tipText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
