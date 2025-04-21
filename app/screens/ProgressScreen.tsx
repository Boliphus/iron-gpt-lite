// app/screens/ProgressScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function ProgressScreen() {
  const { palette } = useTheme();

  // Pull persisted data
  const chatCount = useSelector(
    (s: RootState) => s.chat.messages.length
  );
  const workoutPlan = useSelector(
    (s: RootState) => s.workout.plan
  );
  const nutritionPlan = useSelector(
    (s: RootState) => s.nutrition.plan
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Chat Progress */}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Ionicons
            name="chatbubbles-outline"
            size={32}
            color={palette.accent}
          />
          <Text style={[styles.cardTitle, { color: palette.text }]}>
            Chat Messages
          </Text>
          <Text style={[styles.cardValue, { color: palette.text }]}>
            {chatCount}
          </Text>
        </View>

        {/* Workout Progress */}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Ionicons
            name="barbell-outline"
            size={32}
            color={palette.accent}
          />
          <Text style={[styles.cardTitle, { color: palette.text }]}>
            Workout Plans Generated
          </Text>
          <Text style={[styles.cardValue, { color: palette.text }]}>
            {workoutPlan ? '✓' : '0'}
          </Text>
        </View>

        {/* Nutrition Progress */}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Ionicons
            name="restaurant-outline"
            size={32}
            color={palette.accent}
          />
          <Text style={[styles.cardTitle, { color: palette.text }]}>
            Nutrition Plans Generated
          </Text>
          <Text style={[styles.cardValue, { color: palette.text }]}>
            {nutritionPlan ? '✓' : '0'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardValue: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '700',
  },
});
