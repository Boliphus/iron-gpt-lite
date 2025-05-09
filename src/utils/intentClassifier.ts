// src/utils/intentClassifier.ts

export type Intent =
  | 'ask_form_advice'
  | 'generate_workout'
  | 'generate_nutrition'
  | 'log_feeling'
  | 'swap_exercise'
  | 'view_plan'
  | 'clarify';

// Define simple keyword-based intents; you can refine or replace with ML later
const intentKeywords: Record<Intent, string[]> = {
  ask_form_advice: ['form', 'technique', 'posture', 'alignment', 'cue'],
  generate_workout: [
    'workout', 'plan', 'exercise', 'routine', 'training',
    'lose', 'lose weight', 'fat loss', 'gain', 'muscle', 'bulk', 'strength',
  ],
  generate_nutrition: [
    'meal', 'nutrition', 'diet', 'calories', 'macros',
    'eat', 'diet plan', 'meal plan',
  ],
  log_feeling: ['felt', 'feeling', 'sore', 'tired', 'energy'],
  swap_exercise: ['swap', 'change', 'alternate', 'replace'],
  view_plan: ['view', 'show', 'open', 'display'],
  clarify: ['what', 'repeat', 'did you mean', 'clarify'],
};

/**
 * Classify a user message into a single Intent.
 * Falls back to 'clarify' if nothing matches.
 */
export function classifyIntent(text: string): Intent {
  const lower = text.toLowerCase();
  for (const intent of Object.keys(intentKeywords) as Intent[]) {
    if (intentKeywords[intent].some((kw) => lower.includes(kw))) {
      return intent;
    }
  }
  return 'clarify';
}


