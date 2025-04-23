// app/screens/NutritionScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  SafeAreaView,
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
import {
  fetchNutritionPlan,
  clearNutrition,
} from '../store/slices/nutritionSlice';
import NutritionDayCard from '../components/NutritionDayCard';
import type { NutritionDay } from '../types/plans';

const { height: screenHeight } = Dimensions.get('window');

/** Compute BMR via Mifflin–St Jeor */
function computeBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other'
) {
  const s = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return 10 * weight + 6.25 * height - 5 * age + s;
}

export default function NutritionScreen() {
  const { palette } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { weight, height, age, gender } = useSelector(
    (s: RootState) => s.profile
  );
  const { plan, generating, error } = useSelector(
    (s: RootState) => s.nutrition
  );
  const [requirements, setRequirements] = useState('');

  // Preferences UI
  const nutritionOptions = [
    'Vegetarian',
    'Gluten-Free',
    'Low-Carb',
    'High-Protein',
    'Dairy-Free',
  ];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const showPrefs = !plan && !generating;
  const toggleOption = (opt: string) =>
    setSelectedOptions(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );

  // Compute BMR & TDEE
  const activityFactor = 1.55;
  const bmr = useMemo(() => computeBMR(weight, height, age, gender), [
    weight,
    height,
    age,
    gender,
  ]);
  const tdee = Math.floor(bmr * activityFactor);

  const handleGenerate = () => {
    if (!requirements.trim()) return;
    dispatch(
      fetchNutritionPlan({ requirements,  preferences: selectedOptions })
    );
  };

  const handleClear = () => {
    dispatch(clearNutrition());
    setRequirements('');
    setSelectedOptions([]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {showPrefs && (
          <View
            style={[
              styles.prefsSection,
              { marginTop: screenHeight * 0.4 },
            ]}
          >
            {nutritionOptions.map(opt => {
              const selected = selectedOptions.includes(opt);
              return (
                <Pressable
                  key={opt}
                  onPress={() => toggleOption(opt)}
                  style={[
                    styles.prefsButton,
                    {
                      borderColor: palette.accent,
                      backgroundColor: selected
                        ? palette.accent
                        : 'transparent',
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

        {/* Input + Generate Section */}
        <View style={styles.inputSection}>
          <Text style={[styles.tdee, { color: palette.text }]}>
            Your TDEE: {tdee} kcal/day
          </Text>

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

          {error != null && (
            <Text style={[styles.error, { color: palette.accent }]}>
              {error}
            </Text>
          )}
        </View>

        {/* Plan Cards */}
        {plan != null && (
          <View style={styles.cardsSection}>
            {plan.week.map((day: NutritionDay) => (
              <NutritionDayCard
                key={day.day}
                day={day.day}
                meals={day.meals}
                calories={day.calories}
                macros={day.macros}   // ← pass macros to card
              />
            ))}

            <Pressable
              onPress={handleClear}
              style={[styles.clearBtn, { borderColor: palette.accent }]}
            >
              <Text style={[styles.clearText, { color: palette.accent }]}>
                Start Over
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20 },

  /* Preference Buttons */
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

  /* Input + Generate */
  inputSection: {
    alignItems: 'center',
    paddingTop: 32,
  },
  tdee: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
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

  /* Cards Full Width */
  cardsSection: {
    width: '100%',
  },

  /* Start Over button */
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
