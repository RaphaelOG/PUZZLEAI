import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SlidingPuzzle from '../components/SlidingPuzzle';
import { usePuzzlesSolved } from '../context/PuzzlesSolvedContext';

const ALARM_SOUND_URI =
  'https://assets.mixkit.co/active_storage/sfx/2566-pager-beep.mp3';

function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HomeScreen() {
  const { incrementPuzzlesSolved } = usePuzzlesSolved();
  const [alarmActive, setAlarmActive] = useState(false);
  const [flash, setFlash] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [alarmTime, setAlarmTime] = useState(null);
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

  const stopAlarmSound = async () => {
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
        return;
      }
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (_) {}
  };

  const startAlarmSound = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const audio = new window.Audio(ALARM_SOUND_URI);
        audio.loop = true;
        await audio.play();
        webAudioRef.current = audio;
      } catch (_) {}
      return;
    }
    try {
      const { Audio } = require('expo-av');
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri: ALARM_SOUND_URI },
        { isLooping: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (_) {
      // Fallback: vibration only if expo-av native module unavailable
    }
  };

  const triggerAlarm = React.useCallback(() => {
    setAlarmTime(null);
    setPuzzleKey((k) => k + 1);
    setPuzzleCompleted(false);
    setAlarmActive(true);
    startAlarmSound().catch(() => {});
  }, []);
  

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
    if (alarmActive || !alarmTime) return;
    const check = () => {
      const now = new Date();
      if (now >= alarmTime) triggerAlarm();
    };
    checkIntervalRef.current = setInterval(check, 1000);
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [alarmActive, alarmTime, triggerAlarm]);

  const handleStartAlarmTest = () => {
    if (alarmActive) return;
    
  };

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
  };

  const handlePuzzleSolved = () => {
    setAlarmActive(false);
    setPuzzleCompleted(true);
    Vibration.cancel();
    stopAlarmSound();
    incrementPuzzlesSolved();
    Alert.alert('Puzzle completed', 'Nice work! Your alarm is now off.');
  };

  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Puzzle🧩 ai</Text>
        <Text style={styles.subtitle}>Alarm that only stops when you solve.</Text>
      </View>

      <View style={[styles.alarmCard, flash && alarmActive && styles.alarmCardActive]}>
        <Text style={styles.alarmLabel}>Alarm status</Text>
        <Text style={styles.alarmState}>
          {alarmActive
            ? 'RINGING – solve the puzzle!'
            : puzzleCompleted
            ? 'Puzzle completed ✅'
            : alarmTime
            ? `Set for ${formatTime(alarmTime)}`
            : 'Idle'}
        </Text>
        <Text style={styles.alarmHint}>
          Set an alarm time below. When it goes off, solve the 4-number puzzle to stop it.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, alarmActive && styles.buttonDisabled]}
        onPress={handleSetAlarm}
        activeOpacity={0.85}
        disabled={alarmActive}
      >
        <Text style={styles.buttonText}>
          {alarmTime ? 'Change alarm time' : 'Set alarm'}
        </Text>
      </TouchableOpacity>

      {alarmTime && !alarmActive && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setAlarmTime(null)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Clear alarm</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.testButton, alarmActive && styles.buttonDisabled]}
        onPress={handleStartAlarmTest}
        activeOpacity={0.85}
        disabled={alarmActive}
      >
        <Text style={styles.testButtonText}>Test alarm now</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <>
          <DateTimePicker
            value={pickerValue}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimePick}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.doneButton} onPress={confirmTimeIOS}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <View style={styles.puzzleSection}>
        <Text style={styles.puzzleTitle}>Wake-up puzzle</Text>
        <Text style={styles.puzzleDescription}>
          Slide tiles to order 1–3. When the grid is solved, the alarm stops.
        </Text>
        <View style={styles.puzzleWrapper}>
          {alarmActive ? (
            <SlidingPuzzle key={puzzleKey} onSolved={handlePuzzleSolved} />
          ) : (
            <Text style={styles.idleText}>
              Set an alarm or tap “Test alarm now” to unlock the puzzle.
            </Text>
          )}
        </View>
        {puzzleCompleted && !alarmActive && (
          <Text style={styles.completedText}>
            Puzzle completed. Alarm turned off – you beat Puzzle🧩 ai.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f4f4f5',
  },
  subtitle: {
    marginTop: 6,
    color: '#9ca3af',
    fontSize: 14,
  },
  alarmCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  alarmCardActive: {
    borderColor: '#f97316',
    backgroundColor: '#111827',
  },
  alarmLabel: {
    color: '#9ca3af',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  alarmState: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '600',
    color: '#f9fafb',
  },
  alarmHint: {
    marginTop: 8,
    color: '#9ca3af',
    fontSize: 13,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#16a34a',
  },
  buttonText: {
    color: '#020617',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  testButton: {
    marginTop: 4,
    backgroundColor: '#1e3a5f',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: '600',
  },
  puzzleSection: {
    marginTop: 24,
    flex: 1,
  },
  puzzleTitle: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  puzzleDescription: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 16,
  },
  puzzleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleText: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
  completedText: {
    marginTop: 16,
    marginBottom: 24,
    color: '#22c55e',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  doneButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 12,
  },
  doneButtonText: {
    color: '#020617',
    fontSize: 16,
    fontWeight: '600',
  },
});
