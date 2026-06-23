import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import DashboardCard from '../components/DashboardCard';
import { colors, layout } from '../constants/theme';
import { usePuzzlesSolved } from '../context/PuzzlesSolvedContext';

export default function PuzzlesSolvedScreen() {
  const { puzzlesSolved } = usePuzzlesSolved();

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Your stats</Text>
        <Text style={styles.title}>Performance</Text>

        <DashboardCard style={styles.heroStat}>
          <Text style={styles.heroLabel}>Total alarms solved</Text>
          <Text style={styles.heroValue}>{puzzlesSolved}</Text>
          <Text style={styles.heroHint}>Every puzzle you complete counts here.</Text>
        </DashboardCard>

        <Text style={styles.sectionTitle}>This week</Text>
        <View style={styles.statsRow}>
          <DashboardCard style={styles.miniStat}>
            <Text style={styles.miniValue}>{puzzlesSolved}</Text>
            <Text style={styles.miniLabel}>Solved</Text>
          </DashboardCard>
          <DashboardCard style={styles.miniStat}>
            <Text style={styles.miniValue}>48s</Text>
            <Text style={styles.miniLabel}>Avg time</Text>
          </DashboardCard>
          <DashboardCard style={styles.miniStat}>
            <Text style={styles.miniValue}>94%</Text>
            <Text style={styles.miniLabel}>On time</Text>
          </DashboardCard>
        </View>

        <DashboardCard>
          <Text style={styles.tipTitle}>Keep it up</Text>
          <Text style={styles.tipText}>
            Waking up with a puzzle trains your brain to start the day alert and focused.
          </Text>
        </DashboardCard>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
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
    marginBottom: 24,
  },
  heroStat: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 28,
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 72,
  },
  heroHint: {
    color: colors.textDim,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  miniValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  miniLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
});
