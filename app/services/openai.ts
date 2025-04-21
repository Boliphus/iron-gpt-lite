// app/services/opai.ts
import Constants from 'expo-constants';
import OpenAI from 'openai';

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
  if (!msg?.content) throw new Error('OpenAI returned no content for this prompt.');
  return msg.content.trim();
}

/** Generate a structured workout plan via function-calling */
export async function generateWorkoutPlan(goal: string): Promise<{
  week: Array<{
    day: string;
    exercises: Array<{ name: string; sets: number; reps: number }>;
  }>;
}> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are IronGPT, an AI fitness coach.' },
      { role: 'user', content: goal },
    ],
    functions: [
      {
        name: 'createWorkoutPlan',
        description: 'Return a weekly workout plan as JSON',
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
                      },
                      required: ['name', 'sets', 'reps'],
                    },
                  },
                },
                required: ['day', 'exercises'],
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
  if (!args) throw new Error('No function arguments returned for workout plan.');
  return JSON.parse(args);
}

/** Generate a structured nutrition plan via function-calling */
export async function generateNutritionPlan(requirement: string): Promise<{
  week: Array<{
    day: string;
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string;
    };
  }>;
}> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are IronGPT, an AI nutrition coach.' },
      { role: 'user', content: requirement },
    ],
    functions: [
      {
        name: 'createNutritionPlan',
        description: 'Return a 7-day meal plan as JSON',
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
                    required: ['breakfast', 'lunch', 'dinner', 'snacks'],
                  },
                },
                required: ['day', 'meals'],
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
  if (!args) throw new Error('No function arguments returned for nutrition plan.');
  return JSON.parse(args);
}
