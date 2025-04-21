// app/components/NutritionDayCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NutritionDay } from '../types/plans';
import { useTheme } from '../../hooks/useTheme';

export default function NutritionDayCard({ day, meals }: NutritionDay) {
  const { palette } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: palette.card }]}>
      <Text style={[styles.day, { color: palette.text }]}>{day}</Text>
      {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((m) => (
        <View key={m} style={styles.row}>
          <Text style={[styles.label, { color: palette.text }]}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </Text>
          <Text style={[styles.meal, { color: palette.text }]}>
            {meals[m]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    padding: 16,
    minHeight: 100,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  day: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', width: 100 },
  meal: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
});
