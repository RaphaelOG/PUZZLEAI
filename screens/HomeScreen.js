import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenBackground from '../components/ScreenBackground';
import DashboardCard from '../components/DashboardCard';
import AlarmNotification from '../components/AlarmNotification';
import { PrimaryButton } from '../components/PrimaryButton';
import PuzzleRenderer from '../components/PuzzleRenderer';
import { getAlarmSound } from '../constants/alarmSounds';
import { PUZZLE_OPTIONS, getPuzzleOption } from '../constants/puzzleTypes';
import { colors, layout, puzzleColors } from '../constants/theme';
import { usePuzzleSettings } from '../context/PuzzleSettingsContext';
import { usePuzzlesSolved } from '../context/PuzzlesSolvedContext';
import { playLoopingAlarm, stopAlarm, initializeAlarmAudio } from '../utils/alarmAudio';

function formatTime(date) {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getNextAlarmOccurrence(alarmTime) {
  const next = new Date(alarmTime);
  const now = new Date();
  while (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

function getAlarmSubtext(alarmTime) {
  if (!alarmTime) return 'No alarm set';
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isToday =
    alarmTime.getDate() === now.getDate() &&
    alarmTime.getMonth() === now.getMonth() &&
    alarmTime.getFullYear() === now.getFullYear();
  const isTomorrow =
    alarmTime.getDate() === tomorrow.getDate() &&
    alarmTime.getMonth() === tomorrow.getMonth();
  const day = alarmTime.toLocaleDateString([], { weekday: 'short' });
  if (isToday) return `Today, ${day}`;
  if (isTomorrow) return `Tomorrow, ${day}`;
  return alarmTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function getPuzzleProgress(id, puzzlesSolved, selectedId) {
  const base = id === selectedId ? puzzlesSolved * 12 : puzzlesSolved * 6;
  const progress = Math.min(base % 100, 95) + (id === selectedId ? 5 : 0);
  const level = Math.min(Math.floor(puzzlesSolved / 2) + (id === selectedId ? 2 : 1), 10);
  return { progress: Math.min(progress, 100), level };
}

function StatCard({ value, label }) {
  return (
    <DashboardCard style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </DashboardCard>
  );
}

function ProgressRow({ option, progress, level, isActive }) {
  const accent = puzzleColors[option.id] ?? colors.primary;
  return (
    <DashboardCard style={[styles.progressCard, isActive && styles.progressActive]}>
      <View style={styles.progressHeader}>
        <View style={[styles.progressIcon, { backgroundColor: accent }]}>
          <Text style={styles.progressIconText}>{option.title.charAt(0)}</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressTitle}>{option.title}</Text>
          <Text style={styles.progressDesc}>{option.difficulty} · {option.description.split(' ').slice(0, 4).join(' ')}…</Text>
        </View>
        <Text style={[styles.progressLevel, { color: accent }]}>Lv {level}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: accent }]} />
      </View>
    </DashboardCard>
  );
}

export default function HomeScreen({ navigation }) {
  const { puzzlesSolved, incrementPuzzlesSolved } = usePuzzlesSolved();
  const { selectedPuzzleType, selectedAlarmSoundId } = usePuzzleSettings();
  const activePuzzle = getPuzzleOption(selectedPuzzleType);
  const activeAlarmSound = getAlarmSound(selectedAlarmSoundId);
  const [alarmActive, setAlarmActive] = useState(false);
  const [flash, setFlash] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [alarmTime, setAlarmTime] = useState(null);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerValue, setPickerValue] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 1);
    d.setSeconds(0, 0);
    return d;
  });
  const soundRef = useRef(null);
  const webAudioRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const solvedHandledRef = useRef(false);
  const dismissedUntilRef = useRef(0);

  const startAlarmSound = useCallback(async () => {
    await initializeAlarmAudio();
    await playLoopingAlarm(activeAlarmSound.source, soundRef, webAudioRef);
  }, [activeAlarmSound.source]);

  const triggerAlarm = useCallback(() => {
    solvedHandledRef.current = false;
    setPuzzleKey((k) => k + 1);
    setPuzzleCompleted(false);
    setAlarmActive(true);
    startAlarmSound().catch(() => {
      Alert.alert(
        'Alarm sound unavailable',
        'The alarm is active, but audio could not be played. Check your device volume and try again.'
      );
    });
  }, [startAlarmSound]);

  useEffect(() => {
    let interval;
    if (alarmActive) {
      interval = setInterval(() => {
        setFlash((c) => !c);
        Vibration.vibrate(450);
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [alarmActive]);

  useEffect(() => {
    if (alarmActive || !alarmTime || !alarmEnabled) return;
    const check = () => {
      if (Date.now() < dismissedUntilRef.current) return;
      if (new Date() >= alarmTime) triggerAlarm();
    };
    checkIntervalRef.current = setInterval(check, 1000);
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [alarmActive, alarmTime, alarmEnabled, triggerAlarm]);

  useEffect(() => {
    return () => stopAlarm(soundRef, webAudioRef);
  }, []);

  const handleSetAlarm = () => {
    if (alarmActive) return;
    setShowTimePicker(true);
  };

  const onTimePick = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setSeconds(0, 0);
      setPickerValue(d);
      if (event.type === 'set') {
        const next = new Date(d);
        const now = new Date();
        if (next <= now) next.setDate(next.getDate() + 1);
        setAlarmTime(next);
        setAlarmEnabled(true);
      }
    }
  };

  const confirmTimeIOS = () => {
    setShowTimePicker(false);
    const d = new Date(pickerValue);
    d.setSeconds(0, 0);
    const now = new Date();
    if (d <= now) d.setDate(d.getDate() + 1);
    setAlarmTime(d);
    setAlarmEnabled(true);
  };

  const handleToggleAlarm = (value) => {
    if (value) {
      if (!alarmTime) handleSetAlarm();
      else setAlarmEnabled(true);
    } else {
      setAlarmEnabled(false);
    }
  };

  const handlePuzzleSolved = useCallback(() => {
    if (solvedHandledRef.current) return;
    solvedHandledRef.current = true;
    dismissedUntilRef.current = Date.now() + 3000;
    setAlarmActive(false);
    setPuzzleCompleted(true);
    Vibration.cancel();
    stopAlarm(soundRef, webAudioRef);
    incrementPuzzlesSolved();
    setAlarmTime((current) => (current ? getNextAlarmOccurrence(current) : null));
  }, [incrementPuzzlesSolved]);

  const streak = Math.max(puzzlesSolved, 1);

  if (alarmActive) {
    return (
      <ScreenBackground>
        <View style={styles.alarmOverlay}>
          <AlarmNotification
            flash={flash}
            soundName={activeAlarmSound.name}
            puzzleTitle={activePuzzle.title}
            puzzleDifficulty={activePuzzle.difficulty}
          />
          <DashboardCard style={styles.puzzleCard}>
            <Text style={styles.puzzlePrompt}>Wake-up challenge</Text>
            <PuzzleRenderer
              key={`${selectedPuzzleType}-${puzzleKey}`}
              type={selectedPuzzleType}
              onSolved={handlePuzzleSolved}
            />
          </DashboardCard>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        <Text style={styles.userName}>Alex</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak}-day streak</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={handleSetAlarm}>
          <DashboardCard variant="hero" style={styles.heroCard}>
            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>Next alarm</Text>
              <Switch
                value={alarmEnabled && !!alarmTime}
                onValueChange={handleToggleAlarm}
                trackColor={{ false: 'rgba(255,255,255,0.25)', true: 'rgba(255,255,255,0.5)' }}
                thumbColor="#ffffff"
              />
            </View>
            <Text style={styles.heroTime}>{formatTime(alarmTime)}</Text>
            <Text style={styles.heroSub}>{getAlarmSubtext(alarmTime)}</Text>
            <TouchableOpacity
              style={styles.heroPill}
              onPress={() => navigation.navigate('PuzzleOptions')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroPillText}>
                ▦ {activePuzzle.title} · {activePuzzle.difficulty}
              </Text>
            </TouchableOpacity>
          </DashboardCard>
        </TouchableOpacity>

        {showTimePicker && (
          <DashboardCard style={styles.pickerCard}>
            <DateTimePicker
              value={pickerValue}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimePick}
              themeVariant="dark"
            />
            {Platform.OS === 'ios' && (
              <PrimaryButton title="Done" onPress={confirmTimeIOS} style={styles.doneBtn} />
            )}
          </DashboardCard>
        )}

        <Text style={styles.sectionTitle}>This week</Text>
        <View style={styles.statsRow}>
          <StatCard value={puzzlesSolved} label={'Alarms\nsolved'} />
          <StatCard value="48s" label={'Avg solve\ntime'} />
          <StatCard value="94%" label={'On-time\nrate'} />
        </View>

        <Text style={styles.sectionTitle}>Puzzle progress</Text>
        <View style={styles.progressList}>
          {PUZZLE_OPTIONS.map((option) => {
            const { progress, level } = getPuzzleProgress(
              option.id,
              puzzlesSolved,
              selectedPuzzleType
            );
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => navigation.navigate('PuzzleOptions')}
                activeOpacity={0.85}
              >
                <ProgressRow
                  option={option}
                  progress={progress}
                  level={level}
                  isActive={option.id === selectedPuzzleType}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <PrimaryButton
          title="Test Alarm Now"
          variant="secondary"
          onPress={triggerAlarm}
          style={styles.testBtn}
        />

        {puzzleCompleted && (
          <DashboardCard variant="active" style={styles.completedCard}>
            <Text style={styles.completedTitle}>Alarm dismissed</Text>
            <Text style={styles.completedBanner}>
              Nice work — your last alarm was solved successfully.
            </Text>
          </DashboardCard>
        )}
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
  },
  userName: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 12,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.streakBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 24,
  },
  streakText: {
    color: colors.streak,
    fontSize: 13,
    fontWeight: '600',
  },
  heroCard: {
    marginBottom: 28,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroTime: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroPillText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  pickerCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  doneBtn: {
    marginTop: 12,
    width: '100%',
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
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  progressList: {
    gap: 12,
    marginBottom: 20,
  },
  progressCard: {
    padding: 14,
  },
  progressActive: {
    borderColor: colors.primary,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressIconText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  progressDesc: {
    color: colors.textDim,
    fontSize: 12,
  },
  progressLevel: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  testBtn: {
    marginBottom: 12,
  },
  completedCard: {
    marginBottom: 12,
    alignItems: 'center',
  },
  completedTitle: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  completedBanner: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  alarmOverlay: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.screenTop,
    paddingBottom: layout.screenBottom,
  },
  puzzlePrompt: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 16,
    alignSelf: 'center',
  },
  puzzleCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
});
