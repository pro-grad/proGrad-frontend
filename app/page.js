"use client";

import React, { useState, useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import components
import DashBoardScreen from "../components/dashBoardScreen";
import CalendarScreen from "../components/calendarScreen";
import TasksScreen from "../components/tasksScreen";
import ChatScreen from "../components/ChatScreen";
import ProfileScreen from "../components/profileScreen";

const Tab = createBottomTabNavigator();

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Idle");
  const workerRef = useRef(null);

  useEffect(() => {
    // 1. Prevent Next.js SSR Hydration Mismatch
    setIsMounted(true);

    // 2. Initialize Transformers Web Worker
    workerRef.current = new Worker(new URL("./classifier.js", import.meta.url), {
      type: "module",
    });

    const handleMessage = (e) => {
      const { status: msgStatus, message, output } = e.data;

      if (msgStatus === "status") {
        setStatus(message);
      } else if (msgStatus === "complete" && output) {
        setMessages((prev) => [...prev, { sender: "ai", text: output }]);
      }
    };

    workerRef.current.addEventListener("message", handleMessage);

    return () => {
      if (workerRef.current) {
        workerRef.current.removeEventListener("message", handleMessage);
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleSendMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    if (workerRef.current) {
      workerRef.current.postMessage({ text });
    }
  };

  // Avoid SSR output to eliminate hydration warnings
  if (!isMounted) {
    return <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }} />;
  }

  return (
    <SafeAreaProvider style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#0a0a0a",
              borderColor: "#222222",
              height: 60,
            },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#777777",
            sceneContainerStyle: { backgroundColor: "black" },
          }}
        >
          <Tab.Screen name="Dashboard" component={DashBoardScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Chat">
            {(props) => (
              <ChatScreen
                {...props}
                messages={messages}
                onSendMessage={handleSendMessage}
                status={status}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}