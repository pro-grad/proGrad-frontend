import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import Header from '@/components/Header';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { globalStyles } from '@/constants/Colors';
import { Text } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
      backgroundColor: '#000',
      borderColor: "#000",
      
       
        
    },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        header: () => (
          <Header/>
        ),
      }}>
        
      <Tabs.Screen
        name="index"
        
        options={{
          title: 'Tab One',
       
          tabBarIcon: ({ color }) => <Text style={globalStyles.navigationIcon}>⌂</Text>,
      
          
       
        }}
      />
      <Tabs.Screen
        name="calender"
        
        options={{
          title: 'Calender',
       
          tabBarIcon: ({ color }) => <Text style={globalStyles.navigationIcon}>□</Text>,
      
          
       
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <Text style={globalStyles.navigationIcon}>✓</Text>,
        }}
        
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Text style={globalStyles.navigationIcon}>◯</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={globalStyles.navigationIcon}>○</Text>,
        }}
      />
    </Tabs>
  );
}
