// app/components/WorkoutDayCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WorkoutDay } from '../types/plans';
import { useTheme } from '../../hooks/useTheme';

export default function WorkoutDayCard({ day, exercises }: WorkoutDay) {
  const { palette } = useTheme();

  const formatDetail = (name: string, sets: number, reps: number) => {
    const isTime = /sec|circuit|plank/i.test(name);
    return isTime
      ? `${sets}×${reps}s`
      : `${sets}×${reps} reps`;
  };

  return (
    <View style={[styles.card, { backgroundColor: palette.card }]}>
      <Text style={[styles.day, { color: palette.text }]}>{day}</Text>
      {exercises.map((ex) => (
        <View key={ex.name} style={styles.row}>
          <Text style={[styles.name, { color: palette.text }]}>{ex.name}</Text>
          <Text style={[styles.detail, { color: palette.text }]}>
            {formatDetail(ex.name, ex.sets, ex.reps)}
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
    minHeight: 80,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  day: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 12,
  },
  detail: { fontSize: 16, fontWeight: '600' },
});
