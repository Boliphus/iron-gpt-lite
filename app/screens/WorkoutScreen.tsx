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

  // Center whenever there is no plan yet
  const center = !plan;

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
        // single line will scroll horizontally if text overflows
        multiline={false}
      />

      <Pressable
        onPress={handleGenerate}
        disabled={generating}
        style={[
          styles.button,
          { backgroundColor: palette.accent, opacity: generating ? 0.6 : 1 },
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
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Your Plan
          </Text>
          <Text style={[styles.planText, { color: palette.text }]}>
            {plan}
          </Text>
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

  // New: center children vertically + horizontally
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: { fontSize: 16, marginBottom: 8 },

  // Fixed width so it doesn’t grow/shrink awkwardly
  input: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },

  // Same width as input to keep alignment
  button: {
    width: '80%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: { fontSize: 16, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  planText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },

  clearBtn: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },

  error: { marginVertical: 8 },
});
