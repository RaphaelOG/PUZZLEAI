import React from 'react';
import { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function LandingScreen({ navigation }) {
  const handleStart = useCallback(() => {
    navigation.navigate('MainTabs');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoMain}>Puzzle</Text>
        <Text style={styles.logoEmoji}>🧩</Text>
        <Text style={styles.logoSub}>ai</Text>
      </View>

      <Text style={styles.tagline}>Wake up by outsmarting your alarm.</Text>

      <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Enter Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  logoMain: {
    fontSize: 40,
    fontWeight: '700',
    color: '#f4f4f5',
    letterSpacing: 2,
  },
  logoEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  logoSub: {
    fontSize: 28,
    fontWeight: '500',
    color: '#a1a1aa',
    marginLeft: 4,
    marginBottom: 2,
  },
  tagline: {
    marginTop: 8,
    color: '#a1a1aa',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
  },
  buttonText: {
    color: '#020617',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

