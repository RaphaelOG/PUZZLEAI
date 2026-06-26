export const ALARM_SOUNDS = [
  {
    id: 'classic',
    name: 'Classic Beep',
    description: 'Short sharp beep',
    source: require('../assets/alarms/classic-beep.m4a'),
  },
  {
    id: 'digital',
    name: 'Digital Alarm',
    description: 'Classic alarm clock tone',
    source: require('../assets/alarms/digital-alarm.m4a'),
  },
  {
    id: 'chime',
    name: 'Morning Chime',
    description: 'Gentle bell ringing',
    source: require('../assets/alarms/morning-chime.m4a'),
  },
  {
    id: 'buzzer',
    name: 'Space Buzzer',
    description: 'Urgent sci-fi alarm',
    source: require('../assets/alarms/buzzer.m4a'),
  },
];

export const DEFAULT_ALARM_SOUND_ID = 'classic';

export function getAlarmSound(id) {
  return ALARM_SOUNDS.find((sound) => sound.id === id) ?? ALARM_SOUNDS[0];
}
