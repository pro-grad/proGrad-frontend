import React, { useState } from "react";
import {
    View
    , Text
    , StyleSheet
    , Pressable
    , SafeAreaView
} from "react-native";

export default function welcomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcomeScreen}>

             <View style={styles.centerContent}>
                <Text style={styles.logo}>proGrad</Text>  

            </View>

                <Pressable
                style={styles.proceedButton}
                onPress={() => navigation.navigate("Auth")} 
                >    

                 <Text style={styles.proceedText}>
                    Continue
                 </Text>
        
                 <Text style={styles.arrow}>
                    →
                 </Text>
                </Pressable>


             
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  welcomeScreen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 40,
    paddingBottom: 35,
    justifyContent: "space-between",
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    color: "#fff",
    fontSize: 54,
    fontWeight: "600",
    letterSpacing: -2,
    marginBottom: 25,
  },

  proceedButton: {
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  proceedText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },

  arrow: {
    color: "#000",
    fontSize: 28,
    marginLeft: 70,
  },
});