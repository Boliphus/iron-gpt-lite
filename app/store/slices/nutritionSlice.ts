// app/store/slices/nutritionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { NutritionPlan } from '../../types/plans';
import { generateNutritionPlan } from '../../services/openai';
import type { RootState } from '../../store';

export interface NutritionState {
  plan: NutritionPlan | null;
  generating: boolean;
  error?: string;
}

const initialState: NutritionState = {
  plan: null,
  generating: false,
  error: undefined,
};

export const fetchNutritionPlan = createAsyncThunk<
  NutritionPlan,
  { requirements: string; preferences: string[] },
  { state: RootState; rejectValue: string }
>(
  'nutrition/fetchPlan',
  async ({ requirements, preferences }, { getState, rejectWithValue }) => {
    // pull profile and compute TDEE
    const { weight, height, age, gender } = getState().profile;
    const s = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    const tdee = Math.floor(bmr * 1.55);

    try {
      return await generateNutritionPlan(
        requirements,
        tdee,
        preferences,
        gender,
        age,
        height,
        weight
      );
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'API error');
    }
  }
);

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    clearNutrition(state) {
      state.plan = null;
      state.error = undefined;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNutritionPlan.pending, state => {
        state.generating = true;
        state.error = undefined;
      })
      .addCase(
        fetchNutritionPlan.fulfilled,
        (state, action: PayloadAction<NutritionPlan>) => {
          state.generating = false;
          state.plan = action.payload;
        }
      )
      .addCase(fetchNutritionPlan.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });
  },
});

export const { clearNutrition } = nutritionSlice.actions;
export const nutritionReducer = nutritionSlice.reducer;
