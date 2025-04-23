// app/services/opai.ts
import Constants from 'expo-constants';
import OpenAI from 'openai';
import type { WorkoutPlan, NutritionPlan } from '../types/plans';

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openAiApiKey,
  dangerouslyAllowBrowser: true,
});

/** Simple chat completion (unchanged) */
export async function chatCompletion(userText: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are IronGPT, an AI fitness coach.' },
      { role: 'user', content: userText },
    ],
  });
  const msg = res.choices[0].message;
  if (!msg?.content) throw new Error('OpenAI returned no content.');
  return msg.content.trim();
}

/**
 * Generate a structured workout plan via function-calling, with full profile context.
 */
export async function generateWorkoutPlan(
  goal: string,
  preferences: string[],
  gender: 'male' | 'female' | 'other',
  age: number,
  height: number,
  weight: number,
  tdee: number
): Promise<WorkoutPlan> {
  const prefText = preferences.length
    ? ` User preferences: ${preferences.join(', ')}.`
    : '';
  const systemContent = `
You are “Coach Morgan,” an expert fitness coach. Your client is a ${gender}, ${age} years old, ${height} cm tall, ${weight} kg, with a maintenance TDEE of ${tdee} kcal/day.
Their stated goal is: “${goal}” and their preferences are: ${preferences.length ? preferences.join(', ') : 'none'}.
Design a 7-day workout plan that strictly follows their goal in tandem with their nutrition plan.
- For weight/fat loss: focus on higher-intensity cardio plus resistance to preserve muscle.
- For muscle gain: prioritize progressive overload resistance and moderate cardio.
- For maintenance: balance resistance and cardio for overall fitness.
Honor any equipment or environment preferences and ensure each session is achievable yet challenging.
Do NOT include narrative—return only the JSON via the createWorkoutPlan function.
`.trim();

  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: goal },
        ],
        functions: [
          {
            name: 'createWorkoutPlan',
            description: 'Return a weekly workout plan as JSON with MET and duration per exercise',
            parameters: {
              type: 'object',
              properties: {
                week: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      day: { type: 'string' },
                      exercises: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            sets: { type: 'integer' },
                            reps: { type: 'integer' },
                            met: { type: 'number' },
                            durationMin: { type: 'number' },
                          },
                          required: ['name','sets','reps','met','durationMin'],
                        },
                      },
                    },
                    required: ['day','exercises'],
                  },
                },
              },
              required: ['week'],
            },
          },
        ],
        function_call: { name: 'createWorkoutPlan' },
      });

      const args = res.choices[0].message?.function_call?.arguments;
      if (!args) throw new Error('No workout JSON returned.');
      const plan = JSON.parse(args) as WorkoutPlan;

      // Validate all 7 days present
      const expected = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
      const got = plan.week.map(d => d.day);
      if (!expected.every(day => got.includes(day))) {
        throw new Error('Incomplete plan returned');
      }
      return plan;
    } catch (err: any) {
      if (attempt === maxRetries) {
        throw new Error(`Failed to generate workout plan: ${err.message || err}`);
      }
    }
  }
  throw new Error('Unexpected error generating workout plan.');
}

/**
 * Generate a structured nutrition plan via function-calling, with full profile context.
 */
export async function generateNutritionPlan(
  requirement: string,
  tdee: number,
  preferences: string[],
  gender: 'male' | 'female' | 'other',
  age: number,
  height: number,
  weight: number
): Promise<NutritionPlan> {
  const prefText = preferences.length
    ? ` User preferences: ${preferences.join(', ')}.`
    : '';
  const systemContent = `
You are “Chef Avery,” a registered dietitian specializing in personalized meal plans. Your client is a ${gender}, ${age} years old, ${height} cm tall, ${weight} kg, with a maintenance TDEE of ${tdee} kcal/day.
Their goal is: “${requirement}” and their preferences are: ${preferences.length ? preferences.join(', ') : 'none'}.
Create a 7-day menu that strictly follows their goal in tandem with their workout plan:
- For weight/fat loss: target 15–20% deficit below TDEE, protein ≥1.6 g/kg/day.
- For muscle gain: include 5–10% surplus, protein ≥1.8 g/kg/day.
- For maintenance: match TDEE with balanced macros.
Ensure meals align with any dietary preferences.
Do NOT include narrative—return only the JSON via the createNutritionPlan function.
`.trim();

  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: requirement },
        ],
        functions: [
          {
            name: 'createNutritionPlan',
            description: 'Return a 7-day meal plan as JSON, with macros',
            parameters: {
              type: 'object',
              properties: {
                week: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      day: { type: 'string' },
                      meals: {
                        type: 'object',
                        properties: {
                          breakfast: { type: 'string' },
                          lunch:     { type: 'string' },
                          dinner:    { type: 'string' },
                          snacks:    { type: 'string' },
                        },
                        required: ['breakfast','lunch','dinner','snacks'],
                      },
                      calories: { type: 'number' },
                      macros: {
                        type: 'object',
                        properties: {
                          protein: { type: 'number' },
                          carbs:   { type: 'number' },
                          fat:     { type: 'number' },
                        },
                        required: ['protein','carbs','fat'],
                      },
                    },
                    required: ['day','meals','calories','macros'],
                  },
                },
              },
              required: ['week'],
            },
          },
        ],
        function_call: { name: 'createNutritionPlan' },
      });

      const args = res.choices[0].message?.function_call?.arguments;
      if (!args) throw new Error('No nutrition JSON returned.');
      const plan = JSON.parse(args) as NutritionPlan;

      // Validate all 7 days present
      const expected = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
      const got = plan.week.map(d => d.day);
      if (!expected.every(d => got.includes(d))) {
        throw new Error('Incomplete nutrition plan returned');
      }
      return plan;
    } catch (err: any) {
      if (attempt === maxRetries) {
        throw new Error(`Failed to generate nutrition plan: ${err.message || err}`);
      }
    }
  }
  throw new Error('Unexpected error generating nutrition plan.');
}
