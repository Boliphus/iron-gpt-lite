// app/providers/ThemeProvider.tsx
import React, { useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { themes } from '../../design-tokens/themes';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { id } = useTheme();

  /* Inject CSS vars on web */
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const palette = themes[id];
      Object.entries(palette).forEach(([k, v]) =>
        document.documentElement.style.setProperty(`--color-${k}`, v),
      );
    }
  }, [id]);

  /* 🔑  Remove newline / whitespace text nodes */
  const clean = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string',
  );

  return <>{clean}</>;
}
