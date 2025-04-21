// app/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

import ChatScreen from '../screens/ChatScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ProgressScreen from '../screens/ProgressScreen';

export type RootTabsParamList = {
  Chat: undefined;
  Workout: undefined;
  Nutrition: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  const { palette } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({
          route,
        }): BottomTabNavigationOptions => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: React.ComponentProps<typeof Ionicons>['name'];
            switch (route.name) {
              case 'Chat':      iconName = 'chatbubble-ellipses-outline'; break;
              case 'Workout':   iconName = 'barbell-outline';             break;
              case 'Nutrition': iconName = 'restaurant-outline';         break;
              case 'Progress':  iconName = 'stats-chart-outline';        break;
              default:          iconName = 'ellipse-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // white icon on a dark bg:
          tabBarActiveTintColor:   '#fff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: palette.bg,    // ← use dark bg
            borderTopWidth: 0,
            height: 64,
            paddingBottom: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 6,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: '#fff',                  // ensure label is white
          },
        })}
      >
        <Tab.Screen name="Chat"      component={ChatScreen} />
        <Tab.Screen name="Workout"   component={WorkoutScreen} />
        <Tab.Screen name="Nutrition" component={NutritionScreen} />
        <Tab.Screen name="Progress"  component={ProgressScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
