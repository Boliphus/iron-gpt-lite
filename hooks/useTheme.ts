// hooks/useTheme.ts
import { create } from 'zustand';
import { themes, ThemeID } from '../design-tokens/themes';
type Palette = typeof themes[keyof typeof themes];  // union of all palettes

type ThemeStore = {
  id: ThemeID;
  set: (id: ThemeID) => void;
  palette: Palette;
};

export const useTheme = create<ThemeStore>((set, get) => ({
  id: 'neon',
  set: (id) => set({ id, palette: themes[id] }),
  palette: themes.neon,   // initial
}));

