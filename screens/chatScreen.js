import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";

export default function ChatScreen() {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim() === "") return;

    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.autogeneral}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        {/* Scrollable chat area */}
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >

          <LottieView
            source={require("../assets/ai-blob.json")}
            autoPlay
            resizeMode="contain"
            loop
            style={[
              styles.animation,
              {
                transform: [{ scale: 0.0 }],
              },
            ]}
          />

          {/* Your future AI messages will go here */}

        </ScrollView>

        {/* Input stays at the bottom */}
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.promptbox}
            placeholder="Ask anything..."
            placeholderTextColor="#777"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="center"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={message.trim().length === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  autogeneral: {
    flex: 1,
    backgroundColor: "black",
  },

  keyboardView: {
    flex: 1,
  },

  chatArea: {
    flex: 1,
  },

  chatContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },

  animation: {
    width: 100,
    height: 100,
  },

  inputContainer: {
    width: "92%",
    minHeight: 65,
    maxHeight: 140,
    alignSelf: "center",
    marginBottom: 15,
    backgroundColor: "#0e0e0e",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  promptbox: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
  },

  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    opacity: 0.3,
  },

  sendIcon: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -3,
  },
});