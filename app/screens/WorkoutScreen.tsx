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
  Dimensions,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchWorkoutPlan, clearPlan } from '../store/slices/workoutSlice';
import WorkoutDayCard from '../components/WorkoutDayCard';

const { height: screenHeight } = Dimensions.get('window');

export default function WorkoutScreen() {
  const { palette } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { plan, generating, error } = useSelector((s: RootState) => s.workout);
  const [goal, setGoal] = useState('');

  // Preferences UI
  const workoutOptions = [
    'Indoor',
    'Outdoor',
    'No Equipment',
    'Beginner Friendly',
    'Flexibility',
  ];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const showPrefs = !plan && !generating;
  const toggleOption = (opt: string) =>
    setSelectedOptions(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );

  const handleGenerate = () => {
    if (!goal.trim()) return;
    dispatch(fetchWorkoutPlan({ goal: goal.trim(), preferences: selectedOptions }));
  };

  const handleClear = () => {
    dispatch(clearPlan());
    setGoal('');
    setSelectedOptions([]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.bg }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {showPrefs && (
        <View style={[styles.prefsSection, { marginTop: screenHeight * 0.4 }]}>
          {workoutOptions.map(opt => {
            const selected = selectedOptions.includes(opt);
            return (
              <Pressable
                key={opt}
                onPress={() => toggleOption(opt)}
                style={[
                  styles.prefsButton,
                  {
                    borderColor: palette.accent,
                    backgroundColor: selected ? palette.accent : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.prefsText,
                    { color: selected ? palette.bg : palette.accent },
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.inputSection}>
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
      </View>

      {plan != null && (
        <View style={styles.cardsSection}>
          {plan.week.map(day => (
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
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  /* Preference buttons moved to mid-screen */
  prefsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  prefsButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  prefsText: {
    fontSize: 14,
    fontWeight: '500',
  },

  inputSection: {
    alignItems: 'center',
    paddingTop: 32,
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

  cardsSection: {
    width: '100%',
  },

  clearBtn: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});
