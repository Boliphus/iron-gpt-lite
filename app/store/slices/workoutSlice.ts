// app/store/slices/workoutSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { WorkoutPlan } from '../../types/plans';
import { generateWorkoutPlan } from '../../services/openai';

export interface WorkoutState {
  plan: WorkoutPlan | null;
  generating: boolean;
  error?: string;
}

const initialState: WorkoutState = {
  plan: null,
  generating: false,
};

export const fetchWorkoutPlan = createAsyncThunk<
  WorkoutPlan,        // return type
  string,             // arg type (goal)
  { rejectValue: string }
>(
  'workout/fetchPlan',
  async (goal, { rejectWithValue }) => {
    try {
      return await generateWorkoutPlan(goal);
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkoutPlan.pending, (state) => {
        state.generating = true;
        state.error = undefined;
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
