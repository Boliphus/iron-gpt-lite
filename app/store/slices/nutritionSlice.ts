// app/store/slices/nutritionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { NutritionPlan } from '../../types/plans';
import { generateNutritionPlan } from '../../services/openai';

export interface NutritionState {
  plan: NutritionPlan | null;
  generating: boolean;
  error?: string;
}

const initialState: NutritionState = {
  plan: null,
  generating: false,
};

export const fetchNutritionPlan = createAsyncThunk<
  NutritionPlan,      // return type
  string,             // arg type (requirements)
  { rejectValue: string }
>(
  'nutrition/fetchPlan',
  async (req, { rejectWithValue }) => {
    try {
      return await generateNutritionPlan(req);
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutritionPlan.pending, (state) => {
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
