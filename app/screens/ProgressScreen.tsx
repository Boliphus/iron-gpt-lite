// app/screens/ProgressScreen.tsx
import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { WorkoutPlan, NutritionPlan } from '../types/plans';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH   = screenWidth * 0.95;
const CARD_PADDING = 16;
const CHART_WIDTH  = CARD_WIDTH - CARD_PADDING * 2;
const ALL_DAYS     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function ProgressScreen() {
  const { palette } = useTheme();
  const workoutPlan   = useSelector((s: RootState) => s.workout.plan)   as WorkoutPlan  | null;
  const nutritionPlan = useSelector((s: RootState) => s.nutrition.plan) as NutritionPlan|null;
  const workoutGoal   = useSelector((s: RootState) => s.workout.goal);
  const { weight, height, age, gender } = useSelector((s: RootState) => s.profile);

  // 1) BMR
  const bmr = useMemo(() => {
    const s = gender === 'male'   ? 5
            : gender === 'female' ? -161
            : -78;
    return 10 * weight + 6.25 * height - 5 * age + s;
  }, [weight, height, age, gender]);

  // 2) Burned per day
  const weekBurn: Record<string,number> = {};
  (workoutPlan?.week ?? []).forEach(d => {
    const ab = d.day.substring(0,3);
    const tot = d.exercises.reduce(
      (sum, ex) => sum + ex.met * weight * (ex.durationMin/60),
      0
    );
    weekBurn[ab] = Math.floor(tot);
  });
  const burned = ALL_DAYS.map(d => weekBurn[d] ?? 0);

  // 3) Intake per day
  const weekIntake: Record<string,number> = {};
  (nutritionPlan?.week ?? []).forEach(d => {
    weekIntake[d.day.substring(0,3)] = d.calories;
  });
  const intake = ALL_DAYS.map(d => weekIntake[d] ?? 0);

  // 4) TDEE
  const activityFactor = 1.3;
  const dailyTdee = burned.map(b => Math.floor(bmr * activityFactor + b));

  // 5) Summaries
  const hasPlan = !!workoutPlan && !!nutritionPlan;

  // use TDEE minus intake for deficit
  const dailyDeficits = dailyTdee.map((tdeeValue, i) => tdeeValue - intake[i]);
  const weeklyDeficit = dailyDeficits.reduce((sum, d) => sum + d, 0);
  const weeklyFatChange = weeklyDeficit / 7700;       // kg fat lost per week

 // estimate muscle gain from protein surplus:
  // weekly protein consumed
  const weeklyProtein = nutritionPlan?.week.reduce((sum, d) => sum + d.macros.protein, 0) ?? 0;
  // target intake ~1.6g per kg per day
  const proteinTargetWeekly = weight * 1.6 * 7;
  const proteinSurplus = weeklyProtein - proteinTargetWeekly;
  // assume ~30% of surplus protein converts to muscle; 1kg muscle ≈200g protein
  const weeklyMus = proteinSurplus > 0
    ? (proteinSurplus * 0.3) / 200
    : 0;
  
  // 6) Weekly macros
  const weekMacros = useMemo(() => {
    const m = { protein: 0, carbs: 0, fat: 0 };
    nutritionPlan?.week.forEach(d => {
      m.protein += d.macros.protein;
      m.carbs   += d.macros.carbs;
      m.fat     += d.macros.fat;
    });
    return m;
  }, [nutritionPlan]);

  const pieData = [
    {
      name: 'Protein',
      grams: weekMacros.protein,
      color: palette.accent,
      legendFontColor: palette.text,
      legendFontSize: 12,
    },
    {
      name: 'Carbs',
      grams: weekMacros.carbs,
      color: palette.text + '80',
      legendFontColor: palette.text,
      legendFontSize: 12,
    },
    {
      name: 'Fat',
      grams: weekMacros.fat,
      color: palette.text,
      legendFontColor: palette.text,
      legendFontSize: 12,
    },
  ];

  // Chart config
  const chartConfig = {
    backgroundGradientFrom: palette.card,
    backgroundGradientTo:   palette.card,
    decimalPlaces:          0 as const,
    color:                  () => palette.accent,
    labelColor:             () => palette.text,
    propsForBackgroundLines:{ stroke: palette.text + '20' },
    paddingRight:           0,
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {hasPlan && (
          <View style={[styles.chartCard, { backgroundColor: palette.card }]}>

            {/* Calories Out vs In */}
            <Text style={[styles.chartTitle, { color: palette.text }]}>
              Calories Out vs In
            </Text>
            <View style={{ width: CHART_WIDTH, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', height: 180 }}>
                {ALL_DAYS.map((day,i) => {
                  const intakeH = (intake[i] / Math.max(...intake.map((v,j) => intake[j]+burned[j]),1)) * 180;
                  const burnedH = (burned[i] / Math.max(...intake.map((v,j) => intake[j]+burned[j]),1)) * 180;
                  const net = intake[i] - burned[i];
                  return (
                    <View key={day} style={{ flex:1, alignItems:'center' }}>
                      <View style={{ width: CHART_WIDTH/ALL_DAYS.length * 0.6, height:180, justifyContent:'flex-end' }}>
                        <View style={{ height:intakeH, backgroundColor: palette.text+'80', width:'100%', borderTopLeftRadius:2, borderTopRightRadius:2 }}/>
                        <View style={{ height:burnedH, backgroundColor: palette.accent, width:'100%', borderBottomLeftRadius:2, borderBottomRightRadius:2 }}/>
                      </View>
                      <Text style={{ marginTop:4, fontSize:12, fontWeight:'600', color: palette.accent }}>{net}</Text>
                      <Text style={{ fontSize:12, color:palette.text, marginTop:2 }}>{day}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={{ flexDirection:'row', justifyContent:'center', marginTop:38 }}>
                <View style={{ flexDirection:'row', alignItems:'center', marginHorizontal:16 }}>
                  <View style={{ width:12, height:12, backgroundColor:palette.text+'80', marginRight:4, borderRadius:2 }}/>
                  <Text style={{ color:palette.text, fontSize:12 }}>Intake</Text>
                </View>
                <View style={{ flexDirection:'row', alignItems:'center', marginHorizontal:16 }}>
                  <View style={{ width:12, height:12, backgroundColor:palette.accent, marginRight:4, borderRadius:2 }}/>
                  <Text style={{ color:palette.text, fontSize:12 }}>Burned</Text>
                </View>
              </View>
            </View>

            {/* Daily TDEE */}
            <Text style={[styles.chartTitle, { color: palette.text, marginTop:16 }]}>
              Daily TDEE
            </Text>
            <LineChart
              data={{ labels: ALL_DAYS, datasets: [{ data: dailyTdee }] }}
              width={CHART_WIDTH} height={100} chartConfig={chartConfig}
              fromZero withDots={true}
              renderDotContent={({ x, y, index }) => (
                                <Text
                                  key={index}
                                  style={{
                                    position: 'absolute',
                                top: y - 12,
                                left: x - 6,
                                fontSize: 10,
                                color: palette.accent,
                          }}
                            >
                                  {dailyTdee[index]}
                            </Text>
                          )} withInnerLines={false}
              withVerticalLines={false} withVerticalLabels={false}

              style={{ backgroundColor: palette.card, borderRadius:8, marginVertical:8 }}
            />

            {/* Weekly Macronutrients */}
            <Text style={[styles.chartTitle, { color: palette.text, marginTop:16 }]}>
              Weekly Macronutrients
            </Text>
            <PieChart
              data={pieData}
              width={CHART_WIDTH}
              height={150}
              chartConfig={chartConfig}
              accessor="grams"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <Text style={[styles.legend, { color: palette.text }]}>
              Grams/week: P {weekMacros.protein.toFixed(0)} • C {weekMacros.carbs.toFixed(0)} • F {weekMacros.fat.toFixed(0)}
            </Text>

            {/* 4-Week Projection (weight) */}
            <View style={[styles.projectionRow, { marginTop:16 }]}>
              <View style={[styles.summaryCard, { backgroundColor: palette.card }]}>
                <Text style={[styles.summaryLabel, { color: palette.text }]}>
                  Current Weight
                </Text>
                <Text style={[styles.summaryValue, { color: palette.accent }]}>
                {weight.toFixed(1)} kg
                </Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: palette.card }]}>
                <Text style={[styles.summaryLabel, { color: palette.text }]}>
                  Weight in 4 Weeks
                </Text>
                <Text style={[styles.summaryValue, { color: palette.accent }]}>
                {(weight - weeklyFatChange * 4+weeklyMus*4).toFixed(2)} kg
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: palette.card }]}>
            <Text style={[styles.summaryLabel, { color: palette.text }]}>
              Est. Weight Δ
            </Text>
            <Text style={[styles.summaryValue, { color: palette.accent }]}>
            {hasPlan
                ? `${weeklyFatChange >= 0 ? '-' : '+'}${Math.abs(weeklyFatChange).toFixed(2)} kg`
                : '---'}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: palette.card }]}>
            <Text style={[styles.summaryLabel, { color: palette.text }]}>
              Est. Muscle ↑
            </Text>
            <Text style={[styles.summaryValue, { color: palette.accent }]}>
            {hasPlan
                ? `${weeklyMus >= 0 ? '+' : '-'}${Math.abs(weeklyMus).toFixed(2)} kg`
                : '---'}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: palette.card }]}>
            <Text style={[styles.summaryLabel, { color: palette.text }]}>
              Goal
            </Text>
            <Text style={[styles.summaryValue, { color: palette.text }]}>
              {workoutGoal ?? '---'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: CARD_PADDING,
    alignItems: 'center',
    gap: 16,
  },
  chartCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: CARD_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  legend: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CARD_WIDTH,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
