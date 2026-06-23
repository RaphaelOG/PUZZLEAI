import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import DashboardCard from '../components/DashboardCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ALARM_SOUNDS } from '../constants/alarmSounds';
import { colors, layout } from '../constants/theme';
import { usePuzzleSettings } from '../context/PuzzleSettingsContext';
import { previewAlarm, stopAlarm } from '../utils/alarmAudio';

function AlarmSoundCard({ sound, selected, onSelect, onPreview }) {
  return (
    <Pressable onPress={() => onSelect(sound.id)}>
      <DashboardCard style={[styles.soundCard, selected && styles.soundSelected]}>
        <View style={styles.soundInfo}>
          <Text style={styles.soundName}>{sound.name}</Text>
          <Text style={styles.soundDescription}>{sound.description}</Text>
        </View>
        <View style={styles.soundActions}>
          <PrimaryButton
            title="Preview"
            variant="secondary"
            onPress={() => onPreview(sound.source)}
            style={styles.previewButton}
          />
          {selected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>Selected</Text>
            </View>
          )}
        </View>
      </DashboardCard>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { selectedAlarmSoundId, setSelectedAlarmSoundId } = usePuzzleSettings();
  const previewPlayerRef = useRef(null);
  const previewWebRef = useRef(null);

  useEffect(() => {
    return () => stopAlarm(previewPlayerRef, previewWebRef);
  }, []);

  const handlePreview = (source) => {
    previewAlarm(source, previewPlayerRef, previewWebRef).catch(() => {});
  };

  const handleSelect = (soundId) => {
    setSelectedAlarmSoundId(soundId);
    stopAlarm(previewPlayerRef, previewWebRef);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Preferences</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Customize your wake-up experience. Your alarm sound applies to the next alarm.
        </Text>

        <Text style={styles.sectionTitle}>Alarm sound</Text>
        <View style={styles.soundList}>
          {ALARM_SOUNDS.map((sound) => (
            <AlarmSoundCard
              key={sound.id}
              sound={sound}
              selected={selectedAlarmSoundId === sound.id}
              onSelect={handleSelect}
              onPreview={handlePreview}
            />
          ))}
        </View>
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
    marginBottom: 28,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  soundList: {
    gap: 12,
  },
  soundCard: {
    padding: 16,
  },
  soundSelected: {
    borderColor: colors.primary,
  },
  soundInfo: {
    marginBottom: 12,
  },
  soundName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  soundDescription: {
    color: colors.textMuted,
    fontSize: 13,
  },
  soundActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 100,
  },
  selectedBadge: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  selectedBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
