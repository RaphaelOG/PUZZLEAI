export const ALARM_SOUNDS = [
  {
    id: 'classic',
    name: 'Classic Beep',
    description: 'Short sharp beep',
    source: require('../assets/alarms/classic-beep.ogg'),
  },
  {
    id: 'digital',
    name: 'Digital Alarm',
    description: 'Classic alarm clock tone',
    source: require('../assets/alarms/digital-alarm.ogg'),
  },
  {
    id: 'chime',
    name: 'Morning Chime',
    description: 'Gentle bell ringing',
    source: require('../assets/alarms/morning-chime.ogg'),
  },
  {
    id: 'buzzer',
    name: 'Space Buzzer',
    description: 'Urgent sci-fi alarm',
    source: require('../assets/alarms/buzzer.ogg'),
  },
];

export const DEFAULT_ALARM_SOUND_ID = 'classic';

export function getAlarmSound(id) {
  return ALARM_SOUNDS.find((sound) => sound.id === id) ?? ALARM_SOUNDS[0];
}
