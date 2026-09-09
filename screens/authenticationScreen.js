import React, { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Pressable,
    ScrollView,
    TextInput
}from "react-native";

export default function authenticationScreen ({ navigation }) {

    const [authMode, setAuthMode] = useState("login");
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
              contentContainerStyle={styles.authScreen}
              keyboardShouldPersistTaps="handled"
            >

          

        
{/*Tabs*/}

<View style={styles.tabs}>

  <Pressable
    style={[
      styles.tab,
      authMode === "login" && styles.activeTab,
    ]}
    onPress={() => setAuthMode("login")}
  >
    <Text
      style={[
        styles.tabText,
        authMode === "login" && styles.activeTabText,
      ]}
    >
      Login
    </Text>
  </Pressable>

  <Pressable
    style={[
      styles.tab,
      authMode === "signup" && styles.activeTab,
    ]}
    onPress={() => setAuthMode("signup")}
  >
    <Text
      style={[
        styles.tabText,
        authMode === "signup" && styles.activeTabText,
      ]}
    >
      Sign Up
    </Text>
  </Pressable>

</View>

          {/*Email and Password*/}

          <Text style={styles.inputLabel}>
            Email
          </Text>

          <TextInput style={styles.input} placeholder="Enter Your Email"
            placeholderTextColor="#777" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" 
            />

            <Text style={styles.inputLabel}>
                Password
            </Text>

            <TextInput style={styles.input} placeholder="Enter Your Password"
                placeholderTextColor="#777" value={password} onChangeText={setPassword}
                secureTextEntry={true} 
            />

            {/*Forgot Password*/}
            {authMode === "login" && (
                <Pressable>
                    <Text style={styles.forgotPassword}>
                        Forgot Password 
                    </Text>
                </Pressable>
            )}

            {/*Main Button*/}
            <Pressable 
            
            style={styles.primaryButton} onPress={() => navigation.navigate("Main")}>
                 

            <Text 
              style={styles.primaryButtonText}> {authMode=== "login" ? "login" : "Create Account "}
            </Text>

            </Pressable>

       




         </ScrollView>

        </SafeAreaView>

        );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
       backgroundColor: "black",
  },

  authScreen: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: "center",
    
    paddingBottom: 50,
  },

  returnButton: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "200",
  },

  authHeader: {
    marginTop: 40,
    marginBottom: 35,
  },

  authTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "600",
  },

  authSubtitle: {
    color: "#aaa",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 10,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 30,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 15,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#fff",
  },

  tabText: {
    color: "#777",
    fontSize: 17,
  },

  activeTabText: {
    color: "#fff",
  },

  inputLabel: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 10,
    marginTop: 15,
  },

  input: {
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#292929",
    backgroundColor: "#111",
    color: "#fff",
    paddingHorizontal: 18,
    fontSize: 15,
  },

  forgotPassword: {
    color: "#bbb",
    textAlign: "right",
    marginTop: 15,
  },

  primaryButton: {
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  primaryButtonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#292929",
  },

  orText: {
    color: "#888",
    marginHorizontal: 15,
  },

  googleButton: {
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  googleG: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 12,
  },

  googleText: {
    color: "#fff",
    fontSize: 16,
  },

  accountSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  accountText: {
    color: "#777",
  },

  signUpText: {
    color: "#fff",
    fontWeight: "600",
  },

});
