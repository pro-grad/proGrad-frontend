import { SafeAreaView, ScrollView } from 'react-native';

import { Text, View } from '@/components/Themed';
import { globalStyles } from '@/constants/Colors';

export default function TabOneScreen() {
  return (
     <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.dashboard}>
        

          {/* DASHBOARD CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={globalStyles.dashboardContent}
          >
            <Text style={globalStyles.greeting}>Hello! 👋</Text>

            <Text style={globalStyles.dashboardSubtitle}>
              Stay focused and keep pushing forward.
            </Text>

            {/* CALENDAR */}

            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>Calendar</Text>

              <Text style={globalStyles.month}>August 2026</Text>

              <View style={globalStyles.calendarDays}>
                <Text style={globalStyles.day}>M</Text>
                <Text style={globalStyles.day}>T</Text>
                <Text style={globalStyles.day}>W</Text>
                <Text style={globalStyles.day}>T</Text>
                <Text style={globalStyles.day}>F</Text>
                <Text style={globalStyles.day}>S</Text>
                <Text style={globalStyles.day}>S</Text>
              </View>

              <View style={globalStyles.calendarNumbers}>
                {[
                  " ",
                  " ",
                  " ",
                  " ",
                  " ",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "13",
                  "14",
                  "15",
                  "16",
                  "17",
                  "18",
                  "19",
                  "20",
                  "21",
                  "22",
                  "23",
                  "24",
                  "25",
                  "26",
                  "27",
                  "28",
                  "29",
                  "30",
                  "31",
                ].map((number, index) => (
                  <View
                    key={index}
                    style={[
                      globalStyles.calendarNumber,
                      number === "27" && globalStyles.selectedDay,
                    ]}
                  >
                    <Text
                      style={[
                        globalStyles.numberText,
                        number === "27" && globalStyles.selectedNumber,
                      ]}
                    >
                      {number}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* UPCOMING TASK */}

            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>Upcoming</Text>

              <View style={globalStyles.task}>
                <View style={globalStyles.taskDot} />

                <View style={globalStyles.taskInformation}>
                  <Text style={globalStyles.taskTitle}>Study Data Structures</Text>

                  <Text style={globalStyles.taskTime}>10:00 AM - 11:30 AM</Text>
                </View>
              </View>
            </View>

            {/* AI ASSISTANT */}

            <View style={globalStyles.chatCard}>
              <View style={globalStyles.chatHeader}>
                <Text style={globalStyles.robot}>🤖</Text>

                <Text style={globalStyles.chatTitle}>proGrad Assistant</Text>
              </View>

              <Text style={globalStyles.aiMessage}>
                Hi! 👋 How can I help you today?
              </Text>

              <View style={globalStyles.chatInput}>
                <Text style={globalStyles.placeholder}>Ask proGrad anything...</Text>

                <Text style={globalStyles.send}>➤</Text>
              </View>
            </View>
          </ScrollView>

        
        </View>
      </SafeAreaView>
  );
}

// const globalStyles = globalStylesheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });
