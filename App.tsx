// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import ThemeProvider from './app/providers/ThemeProvider';
import HUD from './app/screens/HUD';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <HUD />
    </ThemeProvider>
  );
}
