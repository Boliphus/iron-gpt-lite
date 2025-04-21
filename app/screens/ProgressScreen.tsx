// app/screens/ProgressScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { WorkoutPlan, NutritionPlan } from '../types/plans';

const screenWidth = Dimensions.get('window').width * 0.9;
const KCAL_PER_REP = 0.5;

export default function ProgressScreen() {
  const { palette } = useTheme();
  const chatCount = useSelector((s: RootState) => s.chat.messages.length);
  const workoutPlan = useSelector(
    (s: RootState) => s.workout.plan
  ) as WorkoutPlan | null;
  const nutritionPlan = useSelector(
    (s: RootState) => s.nutrition.plan
  ) as NutritionPlan | null;

  const labels = workoutPlan?.week.map((d) => d.day.substring(0, 3)) ?? [];
  const dataSet = workoutPlan?.week.map((d) =>
    d.exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * KCAL_PER_REP, 0)
  ) ?? [];

  const chartData = { labels, datasets: [{ data: dataSet }] };

  const chartConfig = {
    backgroundGradientFrom: palette.bg,
    backgroundGradientTo: palette.bg,
    decimalPlaces: 0,
    color: () => palette.accent,
    labelColor: () => palette.text,
    fillShadowGradient: palette.accent,
    fillShadowGradientOpacity: 1,
    propsForBackgroundLines: { stroke: palette.text + '40', strokeDasharray: '' },
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {workoutPlan && (
          <View style={[styles.card, { backgroundColor: palette.card }]}>
            <Text style={[styles.chartTitle, { color: palette.text }]}>
              Estimated Calories/Day
            </Text>
            <BarChart
              data={chartData}
              width={screenWidth}
              height={240}
              yAxisLabel=""
              yAxisSuffix=" kcal"
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        )}

        {/* Chat Messages */}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Ionicons name="chatbubbles-outline" size={32} color={palette.accent} />
          <Text style={[styles.cardTitle, { color: palette.text }]}>
            Chat Messages
          </Text>
          <Text style={[styles.cardValue, { color: palette.text }]}>
            {chatCount}
          </Text>
        </View>

        {/* Workout Days */}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Ionicons name="barbell-outline" size={32} color={palette.accent} />
          <Text style={[styles.cardTitle, { color: palette.text }]}>
            Workout Days Planned
          </Text>
          <Text style={[styles.cardValue, { color: palette.text }]}>
            {workoutPlan?.week.length ?? 0}
          </Text>
        </View>

        {/* Nutrition Days */}
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Ionicons name="restaurant-outline" size={32} color={palette.accent} />
          <Text style={[styles.cardTitle, { color: palette.text }]}>
            Meal Days Planned
          </Text>
          <Text style={[styles.cardValue, { color: palette.text }]}>
            {nutritionPlan?.week.length ?? 0}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, alignItems: 'center', gap: 16 },
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
  chartTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  chart: { borderRadius: 12 },
  cardTitle: { marginTop: 8, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  cardValue: { marginTop: 4, fontSize: 24, fontWeight: '700' },
});
