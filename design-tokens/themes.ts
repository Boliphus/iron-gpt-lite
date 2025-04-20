export type ThemeID = 'neon' | 'holo' | 'lofi' | 'sports';

export const themes = {
  neon: {
    accent: '#FF2EC4',         // hot magenta
    bg:     '#09090B',
    card:   'rgba(255,255,255,0.08)',
    text:   '#EDEDED',
  },
  holo: {
    accent: '#7CF0FF',         // holographic cyan
    bg:     '#050505',
    card:   'rgba(255,255,255,0.06)',
    text:   '#F5F5F5',
  },
  lofi: {
    accent: '#1D1D1D',         // inky black on paper
    bg:     '#FAFAF7',
    card:   '#FFFFFF',
    text:   '#1D1D1D',
  },
  sports: {
    accent: '#FF6B00',         // bold team orange
    bg:     '#101010',
    card:   '#1E1E1E',
    text:   '#FFFFFF',
  },
} as const;
