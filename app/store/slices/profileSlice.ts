// app/store/slices/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Gender = 'male' | 'female' | 'other';

export interface ProfileState {
  weight: number;       // kg
  height: number;       // cm
  age: number;          // years
  gender: Gender;
}

const initialState: ProfileState = {
  weight: 70,
  height: 170,
  age: 25,
  gender: 'male',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Partial<ProfileState>>) {
      return { ...state, ...action.payload };
    },
    clearProfile() {
      return initialState;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
