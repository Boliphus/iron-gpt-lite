// app/providers/ThemeProvider.tsx
import React, { useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useTheme }   from '../../hooks/useTheme';
import { themes }     from '../../design-tokens/themes';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { id } = useTheme();

  useEffect(() => {
    // Only on web do we have a document to inject CSS vars into
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const palette = themes[id];
      Object.entries(palette).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });
    }
  }, [id]);

  return <>{children}</>;
}
