import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radii } from '../constants/theme';

export function PrimaryButton({ title, onPress, disabled, style, variant = 'primary' }) {
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
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
          isSecondary && styles.textSecondary,
          isGhost && styles.textGhost,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  textSecondary: {
    color: colors.primary,
    fontWeight: '600',
  },
  textGhost: {
    color: colors.textMuted,
    fontWeight: '500',
    fontSize: 14,
  },
});
