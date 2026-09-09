import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomeScreen from "./screens/welcomeScreen";
import AuthenticationScreen from "./screens/authenticationScreen";
import DashBoardScreen from "./screens/dashBoardScreen";

import CalendarScreen from "./screens/calendarScreen";
import TasksScreen from "./screens/tasksScreen";
import ChatScreen from "./screens/chatScreen";
import ProfileScreen from "./screens/profileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "#222",
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashBoardScreen}
        options={{ tabBarLabel: "Home" }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: "Calendar" }}
      />

      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ tabBarLabel: "Tasks" }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: "Chat" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="Auth"
          component={AuthenticationScreen}
        />

        <Stack.Screen
          name="Main"
          component={MainTabs}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}
