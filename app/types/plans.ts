// app/types/plans.ts

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  met: number;
  durationMin: number;
}

export interface WorkoutDay {
  day: string; // e.g. "Monday"
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  week: WorkoutDay[];
}

export interface NutritionDay {
  day: string; // e.g. "Monday"
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  calories: number;
  macros: {      // ← newly added
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutritionPlan {
  week: NutritionDay[];
}
