// services/openai.ts
import Constants from 'expo-constants';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openAiApiKey,
  // required when running in Expo/React‑Native:
  dangerouslyAllowBrowser: true,
});

/**
 *  Send a chat message and get the assistant’s reply.
 *  Later we’ll extend this for streaming, function‑calling, etc.
 */
export async function chatCompletion(userText: string): Promise<string> {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are IronGPT, an AI fitness coach.' },
        { role: 'user',   content: userText },
      ],
    });
  
    const msg = res.choices[0].message;
  
    if (!msg || !msg.content) {
      // Handle rare empty‑message cases explicitly
      throw new Error('OpenAI returned no content for this prompt.');
    }
  
    return msg.content.trim();
  }
  export async function generateWorkoutPlan(goal: string) {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are IronGPT, an AI fitness coach. Given a training goal, output a weekly workout plan with days, exercises, sets, reps or durations.',
        },
        { role: 'user', content: `Create a workout plan: ${goal}` },
      ],
    });
  
    const msg = res.choices[0].message;
    if (!msg?.content) throw new Error('No workout plan returned.');
    return msg.content.trim();
  }
  export async function generateNutritionPlan(requirement: string) {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are IronGPT, an AI nutrition coach. Given dietary requirements, produce a 7‑day meal plan with breakfast, lunch, dinner, and snacks.',
        },
        { role: 'user', content: `Create a nutrition plan: ${requirement}` },
      ],
    });
  
    const msg = res.choices[0].message;
    if (!msg?.content) throw new Error('No nutrition plan returned.');
    return msg.content.trim();
  }
