import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1d1d1d',
        },
        tabBarLabelStyle: {
          fontFamily: 'GrenadineRegular',
          display: 'none'
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='home' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gameplay"
        options={{
          title: 'Play a game',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='chess-pawn' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
