import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii } from '../constants/theme';

const TAB_ICONS = {
  HomeTab: '🏠',
  PuzzlesSolved: '🏆',
  PuzzleOptions: '🧩',
  Settings: '⚙️',
};

export default function GlassTabBar(props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      <View style={styles.barOuter}>
        {Platform.OS === 'web' ? (
          <View style={[styles.bar, styles.webBar]}>
            <BottomTabBar {...props} style={styles.tabBarInner} />
          </View>
        ) : (
          <BlurView intensity={60} tint="dark" style={styles.bar}>
            <BottomTabBar {...props} style={styles.tabBarInner} />
          </BlurView>
        )}
      </View>
    </View>
  );
}

export function TabIcon({ routeName, focused }) {
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>
      {TAB_ICONS[routeName] ?? '•'}
    </Text>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  barOuter: {
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  bar: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  webBar: {
    backgroundColor: colors.glass,
  },
  tabBarInner: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 58,
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
});
