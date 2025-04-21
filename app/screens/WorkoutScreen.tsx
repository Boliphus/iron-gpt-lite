// app/screens/WorkoutScreen.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchWorkoutPlan, clearPlan } from '../store/slices/workoutSlice';
import WorkoutDayCard from '../components/WorkoutDayCard';

export default function WorkoutScreen() {
  const { palette } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { plan, generating, error } = useSelector(
    (s: RootState) => s.workout
  );
  const [goal, setGoal] = useState('');

  const handleGenerate = () => {
    if (!goal.trim()) return;
    dispatch(fetchWorkoutPlan(goal.trim()));
  };

  const handleClear = () => {
    dispatch(clearPlan());
    setGoal('');
  };

  // Center input/button when no plan yet
  const center = !plan && !generating;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.bg }]}
      contentContainerStyle={[
        styles.content,
        center && styles.centerContent,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: palette.text }]}>
        What’s your training goal?
      </Text>

      <TextInput
        style={[
          styles.input,
          { color: palette.text, borderColor: palette.accent },
        ]}
        value={goal}
        onChangeText={setGoal}
        placeholder="e.g. Build upper-body strength"
        placeholderTextColor={palette.text + '80'}
        multiline={false}
      />

      <Pressable
        onPress={handleGenerate}
        disabled={generating}
        style={[
          styles.button,
          {
            backgroundColor: palette.accent,
            opacity: generating ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[styles.btnText, { color: palette.bg }]}>
          {generating ? 'Generating…' : 'Generate Plan'}
        </Text>
      </Pressable>

      {generating && (
        <ActivityIndicator
          color={palette.accent}
          style={{ marginVertical: 12 }}
          size="large"
        />
      )}

      {error != null && (
        <Text style={[styles.error, { color: 'red' }]}>{error}</Text>
      )}

      {plan != null && (
        <>
          {plan.week.map((day) => (
            <WorkoutDayCard
              key={day.day}
              day={day.day}
              exercises={day.exercises}
            />
          ))}

          <Pressable
            onPress={handleClear}
            style={[styles.clearBtn, { borderColor: palette.accent }]}
          >
            <Text style={[styles.btnText, { color: palette.accent }]}>
              Start Over
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  button: {
    width: '80%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: { fontSize: 16, fontWeight: '600' },
  error: { marginVertical: 8 },
  clearBtn: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});
