import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export default function ScreenBackground({ children, style }) {
  return <View style={[styles.root, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
