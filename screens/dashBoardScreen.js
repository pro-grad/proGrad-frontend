import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";

export default function DashBoardScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState(3);

  const days = [
    { day: "Mon", date: 31 },
    { day: "Tue", date: 1 },
    { day: "Wed", date: 2 },
    { day: "Thu", date: 3 },
    { day: "Fri", date: 4 },
    { day: "Sat", date: 5 },
    { day: "Sun", date: 6 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.dashboard}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening</Text>
            <Text style={styles.userName}> 👋</Text>
          </View>

          <Pressable style={styles.profileButton}>
            <Text style={styles.profileText}>M</Text>
          </Pressable>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>
                Your Progress
              </Text>

              <Text style={styles.progressSubtitle}>
                Keep going, you're doing great!
              </Text>
            </View>

            <Text style={styles.progressPercentage}>
              68%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            This Week
          </Text>

          <Text style={styles.month}>
            September 2026
          </Text>
        </View>

        <View style={styles.calendar}>
          {days.map((item) => (
            <Pressable
              key={item.date}
              style={[
                styles.dayContainer,
                selectedDay === item.date &&
                  styles.selectedDay,
              ]}
              onPress={() => setSelectedDay(item.date)}
            >
              <Text
                style={[
                  styles.dayName,
                  selectedDay === item.date &&
                    styles.selectedText,
                ]}
              >
                {item.day}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  selectedDay === item.date &&
                    styles.selectedText,
                ]}
              >
                {item.date}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Upcoming Task */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Upcoming
          </Text>

          <Pressable>
            <Text style={styles.viewAll}>
              View all
            </Text>
          </Pressable>
        </View>

        <View style={styles.taskCard}>

          <View style={styles.taskIcon}>
            <Text style={styles.taskIconText}>
              ✓
            </Text>
          </View>

          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>
              Study Data Structures
            </Text>

            <Text style={styles.taskTime}>
              Today • 10:00 AM - 11:30 AM
            </Text>
          </View>

          <Text style={styles.taskArrow}>
            ›
          </Text>

        </View>

        {/* Assistant */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            ProGrad Assistant
          </Text>
        </View>

        <Pressable style={styles.assistantCard}>

          <View style={styles.assistantIcon}>
            <Text style={styles.assistantIconText}>
              ✦
            </Text>
          </View>

          <View style={styles.assistantInfo}>
            <Text style={styles.assistantTitle}>
              Need some help?
            </Text>

            <Text style={styles.assistantSubtitle}>
              Ask me about your studies, schedule or assignments.
            </Text>
          </View>

          <Text style={styles.assistantArrow}>
            →
          </Text>

        </Pressable>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />

      </ScrollView>

    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  dashboard: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  /* Header */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
  },

  userName: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "600",
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "600",
  },

  /* Progress */

  progressCard: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#222",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  progressSubtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 6,
  },

  progressPercentage: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#292929",
    borderRadius: 5,
    marginTop: 20,
    overflow: "hidden",
  },

  progressBar: {
    width: "68%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },

  /* Sections */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  month: {
    color: "#777",
    fontSize: 13,
  },

  viewAll: {
    color: "#aaa",
    fontSize: 13,
  },

  /* Calendar */

  calendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  dayContainer: {
    width: 43,
    height: 68,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },

  selectedDay: {
    backgroundColor: "#fff",
  },

  dayName: {
    color: "#777",
    fontSize: 11,
    marginBottom: 8,
  },

  dayNumber: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  selectedText: {
    color: "#000",
  },

  /* Task */

  taskCard: {
    backgroundColor: "#111",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#222",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  taskIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  taskIconText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },

  taskInfo: {
    flex: 1,
    marginLeft: 14,
  },

  taskTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  taskTime: {
    color: "#777",
    fontSize: 12,
    marginTop: 6,
  },

  taskArrow: {
    color: "#777",
    fontSize: 28,
  },

  /* Assistant */

  assistantCard: {
    backgroundColor: "#111",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#222",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  assistantIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  assistantIconText: {
    color: "#fff",
    fontSize: 22,
  },

  assistantInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  assistantTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  assistantSubtitle: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  assistantArrow: {
    color: "#fff",
    fontSize: 22,
  },

  bottomSpacing: {
    height: 20,
  },

  
});