// app/store/slices/workoutSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { WorkoutPlan } from '../../types/plans';
import { generateWorkoutPlan } from '../../services/openai';
import type { RootState } from '../../store';

export interface WorkoutState {
  plan: WorkoutPlan | null;
  generating: boolean;
  error?: string;
  goal: string | null;
}

const initialState: WorkoutState = {
  plan: null,
  generating: false,
  error: undefined,
  goal: null,
};

export const fetchWorkoutPlan = createAsyncThunk<
  WorkoutPlan,
  { goal: string; preferences: string[] },
  { state: RootState; rejectValue: string }
>(
  'workout/fetchPlan',
  async ({ goal, preferences }, { getState, rejectWithValue }) => {
    // pull profile and compute TDEE
    const { weight, height, age, gender } = getState().profile;
    const s = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    const tdee = Math.floor(bmr * 1.55);

    try {
      return await generateWorkoutPlan(
        goal,
        preferences,
        gender,
        age,
        height,
        weight,
        tdee
      );
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'API error');
    }
  }
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    clearPlan(state) {
      state.plan = null;
      state.error = undefined;
      state.goal = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorkoutPlan.pending, (state, action) => {
        state.generating = true;
        state.error = undefined;
        state.goal = action.meta.arg.goal;
      })
      .addCase(
        fetchWorkoutPlan.fulfilled,
        (state, action: PayloadAction<WorkoutPlan>) => {
          state.generating = false;
          state.plan = action.payload;
        }
      )
      .addCase(fetchWorkoutPlan.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });
  },
});

export const { clearPlan } = workoutSlice.actions;
export const workoutReducer = workoutSlice.reducer;
