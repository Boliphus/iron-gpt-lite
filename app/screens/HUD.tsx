// app/screens/HUD.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function HUD() {
  // Grab the palette for the current theme
  const { id, set, palette } = useTheme();

  // Compute the next theme (cycle)
  const NEXT_THEME: Record<string, string> = {
    neon: 'holo',
    holo: 'lofi',
    lofi: 'sports',
    sports: 'neon',
  };
  const next = NEXT_THEME[id];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: palette.bg }]}
    >
      <Text
        style={[
          styles.counter,
          { color: palette.accent, textShadowColor: palette.accent },
        ]}
      >
        12
      </Text>

      <Pressable
        onPress={() => set(next)}
        style={[
          styles.button,
          { backgroundColor: palette.card },
        ]}
      >
        <Text style={[styles.buttonText, { color: palette.text }]}>
          Switch to {next}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    fontSize: 96,
    fontWeight: 'bold',
    // simple shadow on iOS/Android
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  button: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
