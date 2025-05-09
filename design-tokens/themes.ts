export type ThemeID = 'neon' | 'holo' | 'lofi' | 'sports';

export const themes = {
  neon: {
    accent: '#FF2EC4',         // hot magenta
    bg:     '#09090B',
    card:   '#1E1E1E',
    text:   '#EDEDED',
  },
  holo: {
    accent: '#7CF0FF',         // holographic cyan
    bg:     '#050505',
    card:   '#1E1E1E',
    text:   '#F5F5F5',
  },
  lofi: {
    accent: '#1D1D1D',         // inky black on paper
    bg:     '#FAFAF7',
    card:   '#1E1E1E',
    text:   '#1D1D1D',
  },
  sports: {
    accent: '#FF6B00',         // bold team orange
    bg:     '#101010',
    card:   '#1E1E1E',
    text:   '#FFFFFF',
  },
} as const;
