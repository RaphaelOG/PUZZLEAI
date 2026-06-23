import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii } from '../constants/theme';

function TabGlyph({ routeName, focused }) {
  const color = focused ? colors.primary : colors.textDim;

  if (routeName === 'HomeTab') {
    return (
      <View style={styles.glyph}>
        <View style={[styles.homeRoof, { borderBottomColor: color }]} />
        <View style={[styles.homeBody, { backgroundColor: color }]} />
      </View>
    );
  }

  if (routeName === 'PuzzlesSolved') {
    return (
      <View style={styles.glyph}>
        <View style={[styles.chartBar, styles.barShort, { backgroundColor: color }]} />
        <View style={[styles.chartBar, styles.barMid, { backgroundColor: color }]} />
        <View style={[styles.chartBar, styles.barTall, { backgroundColor: color }]} />
      </View>
    );
  }

  if (routeName === 'PuzzleOptions') {
    return (
      <View style={[styles.glyph, styles.grid]}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.gridCell, { backgroundColor: color }]} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.glyph}>
      <View style={[styles.gearOuter, { borderColor: color }]}>
        <View style={[styles.gearInner, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function AppTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <View style={[styles.tabInner, focused && styles.tabInnerActive]}>
                <TabGlyph routeName={route.name} focused={focused} />
                <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
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
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.hero,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  tabInnerActive: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDim,
  },
  labelActive: {
    color: colors.primary,
  },
  glyph: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeBody: {
    width: 12,
    height: 9,
    borderRadius: 2,
  },
  chartBar: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    borderRadius: 2,
  },
  barShort: {
    left: 4,
    height: 8,
  },
  barMid: {
    left: 9,
    height: 12,
  },
  barTall: {
    left: 14,
    height: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 16,
    height: 16,
    gap: 3,
  },
  gridCell: {
    width: 6,
    height: 6,
    borderRadius: 1.5,
  },
  gearOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
