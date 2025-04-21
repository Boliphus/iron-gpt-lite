// app/types/plans.ts

/**
 * Type definitions for structured workout and nutrition plans
 */

/** A single exercise entry within a workout day */
export interface Exercise {
    name: string;
    sets: number;
    reps: number;
  }
  
  /** A workout plan for one day of the week */
  export interface WorkoutDay {
    day: string;
    exercises: Exercise[];
  }
  
  /** A full 7-day (or however long) workout plan */
  export interface WorkoutPlan {
    week: WorkoutDay[];
  }
  
  /** Meals for one day of the week */
  export interface NutritionMeals {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }
  
  /** A nutrition plan for one day */
  export interface NutritionDay {
    day: string;
    meals: NutritionMeals;
  }
  
  /** A full 7-day meal plan */
  export interface NutritionPlan {
    week: NutritionDay[];
  }
  