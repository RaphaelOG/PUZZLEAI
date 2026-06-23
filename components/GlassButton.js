import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radii } from '../constants/theme';

export function GlassButton({ title, onPress, variant = 'primary', disabled, style }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primary,
        isGhost && styles.ghost,
        !isPrimary && !isGhost && styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          isPrimary && styles.textPrimary,
          isGhost && styles.textGhost,
          !isPrimary && !isGhost && styles.textSecondary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.button,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primaryButton,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textPrimary: {
    color: colors.text,
  },
  textSecondary: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  textGhost: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});
