"use client";

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


export default function ChatScreen({
  messages = [],
  onSendMessage,
  status = "Idle",
}) {
  const [message, setMessage] = useState("");

  const { View: LottieView } = useLottie({
    animationData: aiBlob,
    loop: true,
    autoplay: true,
  });

  const sendMessage = () => {
    if (message.trim() === "") return;

    if (onSendMessage) {
      onSendMessage(message);
    } else {
      console.log("Message sent:", message);
    }
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.autogeneral}>
      {/* Model Status Indicator */}
      <View style={styles.statusHeader}>
        <Text style={styles.statusText}>Status: {status}</Text>
      </View>

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

          {/* Render incoming chat messages */}
          {messages.map((item, index) => (
            <View
              key={index}
              style={
                item.sender === "user" ? styles.userBubble : styles.aiBubble
              }
            >
              <Text style={styles.chatText}>{item.text}</Text>
            </View>
          ))}
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
  statusHeader: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  statusText: {
    color: "#888888",
    fontSize: 13,
  },
  keyboardView: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    width: "100%",
  },
  chatContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  animation: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    width: "92%",
    maxWidth: 800,
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
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#222222",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: "80%",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#111111",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: "80%",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  chatText: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
  },
});
