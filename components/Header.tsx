import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function Header() {
  return (
    <View style={styles.dashboardHeader}>
            <Text style={styles.menuIcon}>☰</Text>

            <Text style={styles.dashboardLogo}>proGrad</Text>

            <Text style={styles.notificationIcon}>🔔</Text>
          </View>
  )
}

export default Header

const styles = StyleSheet.create({
    
  dashboardHeader: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
   
    backgroundColor: "#000",
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
})