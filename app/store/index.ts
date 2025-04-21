// app/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatReducer } from './slices/chatSlice';
import { workoutReducer } from './slices/workoutSlice';
import { nutritionReducer } from './slices/nutritionSlice';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['chat','workout', 'nutrition'],
  
};

const rootReducer = {
  chat: persistReducer(persistConfig, chatReducer),
  workout: persistReducer(persistConfig, workoutReducer),
  nutrition: persistReducer(persistConfig, nutritionReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);

/* 🔑 Type exports */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
