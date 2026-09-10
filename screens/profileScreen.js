import React from "react";
import { 
   View,
   StyleSheet,
   SafeAreaView,
   Text,
   ScrollView,
   Pressable
   } from "react-native";

import { Card } from "react-native-paper";

export default function ProfileScreen({navigation}) {
  return (

    <SafeAreaView style = {styles.container}>
      <ScrollView
       contentContainerStyle={styles.content}
       showsHorizontalScrollIndicator = {false} >

       </ScrollView> 
    

  <View style = {styles.header}>

  <View style = {styles.avatar}>
    <Text style = {styles.avatarText}>
      U
    </Text>
  </View>

  <Text style = {styles.name}>
    User
  </Text>

  <Text style = {styles.email}>
    useremail@xample.com
  </Text>

  </View>

  <View style = {styles.section}>
    <Text style = {styles.sectionTitle}>
      Academic Details
    </Text>

    <View style = {styles.card}>
      
      <View style = {styles.detailsRow}>
        <Text style = {styles.label}>
          Module:
        </Text>
        <Text style = {styles.value}>
          Information Technology
        </Text>
      </View>

      <View style = {styles.separator}>
        <Text style = {styles.label}>
          Year of study
        </Text>
        <Text style = {styles.value}>
          3rd
        </Text>
      </View>

    </View>

    <View style = {styles.section}>
      <Text style = {styles.sectionTitle}>
        Setting
      </Text>

      <View style = {styles.card}>

        <Pressable style = {styles.settingRow}>
          <Text style = {styles.settingText}>
            Edit Profile
          </Text>
          <Text style = {styles.arrow}>
            →
          </Text>
        </Pressable>


        
        <View style = {styles.separator}  />

        <Pressable style = {styles.settingRow} >
          <Text style = {styles.settingText}>
            Notifications
          </Text>

          <Text style = {styles.arrow}>
            →
          </Text>

        </Pressable>
        <View style = {styles.separator}  />

        <Pressable style = {styles.settingRow}>
          <Text style = {styles.settingText}>
            Settings
          </Text>
          <Text style = {styles.arrow}>
            →
          </Text>
        </Pressable>

      </View>
    </View>

    <Pressable style = {styles.logoutButton}

      onPress={() => navigation.navigate("Welcome") }
      >
        
      <Text style = {styles.logoutText}>
        Log Out
      </Text>
    </Pressable>

  </View>
  

  </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingButton: 100,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#000",
    fontSize: 32,
    fontWeight:"600",

  },

  name: {
    color:"#fff",
    fontSize: 25,
    fontWeight: "600",
    marginTop: 15,
  },

  email: {
    color: "#777",
    fontSize: 14,
    marginTop: 6,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "600",
    marginTop: 15,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#222",
    overflow: "hidden",
  },

  detailsRow: {
    padding: 18,
  },

  label: {
    color: "#777",
    fontSize: 12,
    marginBottom: 6,
  },

  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#222",
  },

  settingRow: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  settingText: {
    color: "#fff",
    fontSize: 15,
  },

  arrow: {
    color: "#777",
    fontSize: 28,
  },

  logoutButton: {
    height: 60,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5, 
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },


});
