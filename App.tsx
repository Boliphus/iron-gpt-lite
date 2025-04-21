import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';

import { store, persistor } from './app/store';
import ThemeProvider from './app/providers/ThemeProvider';
import RootNavigator from './app/navigation';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
