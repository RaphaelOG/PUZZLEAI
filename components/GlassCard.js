import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii } from '../constants/theme';

export default function GlassCard({
  children,
  style,
  contentStyle,
  active = false,
  alarm = false,
}) {
  const innerStyle = [
    styles.content,
    active && styles.active,
    alarm && styles.alarm,
    contentStyle,
  ];

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.wrapper,
          styles.webFallback,
          active && styles.wrapperActive,
          alarm && styles.wrapperAlarm,
          style,
        ]}
      >
        <View style={innerStyle}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        style,
        active && styles.wrapperActive,
        alarm && styles.wrapperAlarm,
      ]}
    >
      <BlurView intensity={50} tint="dark" style={styles.blur}>
        <View style={innerStyle}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  wrapperActive: {
    borderColor: colors.glassHighlight,
  },
  wrapperAlarm: {
    borderColor: colors.accent,
  },
  webFallback: {
    backgroundColor: colors.glass,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
  },
  active: {
    borderColor: colors.glassHighlight,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  alarm: {
    borderColor: colors.accent,
    backgroundColor: colors.alarmGlow,
  },
});
