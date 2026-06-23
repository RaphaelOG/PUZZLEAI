import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii } from '../constants/theme';

export default function DashboardCard({ children, style, variant = 'default' }) {
  return (
    <View
      style={[
        styles.card,
        variant === 'hero' && styles.hero,
        variant === 'active' && styles.active,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: radii.hero,
    padding: 20,
  },
  active: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
});
