// src/utils/slotManager.ts

import { Intent } from './intentClassifier';

export type SlotKey =
  | 'goal'
  | 'frequency'
  | 'equipment'
  | 'durationPerSession'
  | 'userLevel'
  | 'requirement'
  | 'targetCalories'
  | 'macros'
  | 'dietaryPrefs';

interface IntentSlots {
  generate_workout: SlotKey[];
  generate_nutrition: SlotKey[];
  log_feeling: [];
  ask_form_advice: [];
  swap_exercise: [];
  view_plan: [];
  clarify: [];
}

/**
 * Manages slot values for a given intent until all required slots are filled.
 */
export class SlotManager {
    public readonly intent: Intent;
  private slots: Partial<Record<SlotKey, any>> = {};

  constructor(intent: Intent) {
    this.intent = intent;
  }

  /** Get the list of slots still needed for this intent */
  getMissingSlots(): SlotKey[] {
    const mapping: IntentSlots = {
      generate_workout: ['goal', 'frequency', 'equipment', 'durationPerSession', 'userLevel'],
      generate_nutrition: ['requirement', 'targetCalories', 'macros', 'dietaryPrefs'],
      log_feeling: [],
      ask_form_advice: [],
      swap_exercise: [],
      view_plan: [],
      clarify: [],
    };
    const required = mapping[this.intent] || [];
    return required.filter((key) => this.slots[key] == null);
  }

  /** Record a filled slot value */
  recordSlot(key: SlotKey, value: any) {
    this.slots[key] = value;
  }

  /** Build arguments object for function-call from filled slots */
  buildFunctionArgs(): Record<string, any> {
    return { ...this.slots };
  }
}
