// app/screens/NutritionScreen.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchNutritionPlan,
  clearNutrition,
} from '../store/slices/nutritionSlice';
import NutritionDayCard from '../components/NutritionDayCard';

export default function NutritionScreen() {
  const { palette } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { plan, generating, error } = useSelector(
    (s: RootState) => s.nutrition
  );
  const [requirements, setRequirements] = useState('');

  const handleGenerate = () => {
    if (!requirements.trim()) return;
    dispatch(fetchNutritionPlan(requirements.trim()));
  };
  const handleClear = () => {
    dispatch(clearNutrition());
    setRequirements('');
  };

  const center = !plan && !generating;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          center && styles.centerContent,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: palette.text }]}>
          Describe your dietary needs:
        </Text>

        <TextInput
          style={[
            styles.input,
            { borderColor: palette.accent, color: palette.text },
          ]}
          placeholder="e.g. 2000 kcal, high-protein, vegetarian"
          placeholderTextColor={palette.text + '80'}
          value={requirements}
          onChangeText={setRequirements}
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
          <Text style={[styles.buttonText, { color: palette.bg }]}>
            {generating ? 'Generating…' : 'Generate Plan'}
          </Text>
        </Pressable>

        {generating && (
          <ActivityIndicator
            color={palette.accent}
            size="large"
            style={{ marginVertical: 16 }}
          />
        )}

        {error && (
          <Text style={[styles.error, { color: palette.accent }]}>
            {error}
          </Text>
        )}

        {plan && (
          <>
            {plan.week.map((day) => (
              <NutritionDayCard
                key={day.day}
                day={day.day}
                meals={day.meals}
              />
            ))}

            <Pressable
              onPress={handleClear}
              style={[styles.clearBtn, { borderColor: palette.accent }]}
            >
              <Text
                style={[styles.clearText, { color: palette.accent }]}
              >
                Start Over
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20 },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 16, marginBottom: 8, textAlign: 'center' },
  input: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  error: { textAlign: 'center', marginTop: 8 },
  clearBtn: {
    marginTop: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  clearText: { fontSize: 16, fontWeight: '600' },
});
