// app/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setProfile, clearProfile, Gender } from '../store/slices/profileSlice';

export default function ProfileScreen() {
  const { palette } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const saved = useSelector((s: RootState) => s.profile);

  const [weight, setWeight] = useState(saved.weight);
  const [height, setHeight] = useState(saved.height);
  const [age, setAge] = useState(saved.age);
  const [gender, setGender] = useState<Gender>(saved.gender);

  const handleSave = () => {
    dispatch(setProfile({ weight, height, age, gender }));
    Alert.alert('Profile Saved', 'Your weight, height, age, and gender have been updated.');
  };

  const handleClear = () => {
    dispatch(clearProfile());
    setWeight(initialState.weight);
    setHeight(initialState.height);
    setAge(initialState.age);
    setGender(initialState.gender);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={[styles.label, { color: palette.text }]}>
            Weight: {weight.toFixed(1)} kg
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={150}
            step={0.5}
            value={weight}
            onValueChange={setWeight}
            minimumTrackTintColor={palette.accent}
            maximumTrackTintColor={palette.text + '50'}
            thumbTintColor={palette.accent}
          />

          <Text style={[styles.label, { color: palette.text }]}>
            Height: {height.toFixed(0)} cm
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={100}
            maximumValue={220}
            step={1}
            value={height}
            onValueChange={setHeight}
            minimumTrackTintColor={palette.accent}
            maximumTrackTintColor={palette.text + '50'}
            thumbTintColor={palette.accent}
          />

          <Text style={[styles.label, { color: palette.text }]}>
            Age: {age} years
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={100}
            step={1}
            value={age}
            onValueChange={setAge}
            minimumTrackTintColor={palette.accent}
            maximumTrackTintColor={palette.text + '50'}
            thumbTintColor={palette.accent}
          />

          <Text style={[styles.label, { color: palette.text }]}>
            Gender:
          </Text>
          <View style={styles.genderRow}>
            {(['male', 'female', 'other'] as Gender[]).map((g) => (
              <Pressable
                key={g}
                onPress={() => setGender(g)}
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor:
                      gender === g ? palette.accent : palette.card,
                  },
                ]}
              >
                <Text
                  style={{
                    color: gender === g ? palette.bg : palette.text,
                    fontWeight: '600',
                  }}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleSave}
            style={[
              styles.saveBtn,
              { backgroundColor: palette.accent },
            ]}
          >
            <Text style={[styles.saveTxt, { color: palette.bg }]}>
              Save
            </Text>
          </Pressable>

          <Pressable
            onPress={handleClear}
            style={[
              styles.clearBtn,
              { borderColor: palette.accent },
            ]}
          >
            <Text style={[styles.clearTxt, { color: palette.accent }]}>
              Clear
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const initialState = {
  weight: 70,
  height: 170,
  age: 25,
  gender: 'male' as Gender,
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  label: { fontSize: 18, textAlign: 'center' },
  slider: { width: '80%', height: 40 },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  genderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveTxt: { fontSize: 16, fontWeight: '600' },
  clearBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clearTxt: { fontSize: 14, fontWeight: '600' },
});
