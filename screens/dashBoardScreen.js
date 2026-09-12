import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";

import SocialFeed from "../components/SocialFeed";

// ==================================================
// CALENDAR FUNCTIONS
// ==================================================

function getTotalDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekdayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function getMondayStartOffset(year, month) {
  const day = getFirstWeekdayOfMonth(year, month);
  if (day === 0) return 6;
  return day - 1;
}

function buildCalendarGrid(year, month) {
  const startOffset = getMondayStartOffset(year, month);
  const totalDays = getTotalDaysInMonth(year, month);
  const grid = [];

  for (let i = 0; i < startOffset; i++) {
    grid.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    grid.push(day);
  }

  return grid;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ==================================================
// DASHBOARD
// ==================================================

export default function DashBoardScreen({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const sampleQuests = [
    { id: 1, title: "Complete a lesson", type: "daily", completed: false },
    { id: 2, title: "A", type: "daily", completed: false },
    { id: 3, title: "V", type: "daily", completed: false },
    { id: 4, title: "B", type: "daily", completed: false },
    { id: 5, title: "D", type: "daily", completed: false },
    { id: 6, title: "H", type: "daily", completed: false },
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const grid = buildCalendarGrid(year, month);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboard}>
        {/* HEADER */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.dashboardLogo}>ProGrad</Text>
          <Text style={styles.notificationIcon}>🔔</Text>
        </View>

        {/* DASHBOARD CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.dashboardContent}
        >
          {/* GREETING */}
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.dashboardSubtitle}>
            Stay focused and keep pushing forward.
          </Text>

          {/* CALENDAR */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Calendar</Text>

            <View style={styles.monthHeader}>
              <Pressable
                onPress={() =>
                  setCurrentMonth(new Date(year, month - 1, 1))
                }
              >
                <Text style={styles.monthArrow}>‹</Text>
              </Pressable>

              <Text style={styles.month}>
                {monthNames[month]} {year}
              </Text>

              <Pressable
                onPress={() =>
                  setCurrentMonth(new Date(year, month + 1, 1))
                }
              >
                <Text style={styles.monthArrow}>›</Text>
              </Pressable>
            </View>

            <View style={styles.calendarDays}>
              <Text style={styles.day}>M</Text>
              <Text style={styles.day}>T</Text>
              <Text style={styles.day}>W</Text>
              <Text style={styles.day}>T</Text>
              <Text style={styles.day}>F</Text>
              <Text style={styles.day}>S</Text>
              <Text style={styles.day}>S</Text>
            </View>

            <View style={styles.calendarNumbers}>
              {grid.map((number, index) => {
                const isSelected =
                  number !== null &&
                  number === selectedDay.getDate() &&
                  month === selectedDay.getMonth() &&
                  year === selectedDay.getFullYear();

                return (
                  <Pressable
                    key={index}
                    disabled={number === null}
                    onPress={() => {
                      if (number !== null) {
                        setSelectedDay(new Date(year, month, number));
                      }
                    }}
                    style={[
                      styles.calendarNumber,
                      isSelected && styles.selectedDay,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        isSelected && styles.selectedNumber,
                      ]}
                    >
                      {number}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* SOCIAL FEED */}
          <SocialFeed />
          
          {/* UPCOMING TASK */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Upcoming</Text>

            <View style={styles.task}>
              <View style={styles.taskDot} />
              <View style={styles.taskInformation}>
                <Text style={styles.taskTitle}>Study Data Structures</Text>
                <Text style={styles.taskTime}>10:00 AM - 11:30 AM</Text>
              </View>
            </View>
          </View>

          {/* QUESTS */}
          <View style={styles.questContainer}>
            <Text style={styles.questHeading}>Daily Quests</Text>

            {sampleQuests.map((quest) => (
              <View key={quest.id} style={styles.quest}>
                <Text style={styles.questText}>{quest.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  dashboard: {
    flex: 1,
    backgroundColor: "#000",
  },
  dashboardHeader: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuIcon: {
    color: "#fff",
    fontSize: 27,
  },
  dashboardLogo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  notificationIcon: {
    fontSize: 20,
  },
  dashboardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
    marginTop: 20,
  },
  dashboardSubtitle: {
    color: "#999",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  month: {
    color: "#aaa",
    fontSize: 14,
  },
  monthArrow: {
    color: "#fff",
    fontSize: 30,
    paddingHorizontal: 10,
  },
  calendarDays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  day: {
    color: "#777",
    width: "14%",
    textAlign: "center",
  },
  calendarNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  calendarNumber: {
    width: "14.28%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#fff",
  },
  selectedDay: {
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  selectedNumber: {
    color: "#000",
    fontWeight: "600",
  },
  task: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  taskDot: {
    width: 9,
    height: 9,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 12,
  },
  taskInformation: {
    flex: 1,
  },
  taskTitle: {
    color: "#fff",
    fontSize: 15,
  },
  taskTime: {
    color: "#777",
    fontSize: 13,
    marginTop: 6,
  },
  questContainer: {
    marginBottom: 20,
  },
  questHeading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  quest: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
  },
  questText: {
    color: "#fff",
  },
});