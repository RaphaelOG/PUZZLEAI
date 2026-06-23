import React, { useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { colors } from '../constants/theme';

export default function LandingScreen({ navigation }) {
  const handleStart = useCallback(() => {
    navigation.navigate('MainTabs');
  }, [navigation]);

  return (
    <ScreenBackground>
      <Pressable style={styles.container} onPress={handleStart}>
        <View style={styles.logoWrap}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
        </View>
        <Text style={styles.name}>Puzzle AI</Text>
      </Pressable>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
});
