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
  ActivityIndicator,
} from "react-native";

// Change port/IP according to environment
const OLLAMA_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:11434/api/generate"
    : "http://localhost:11434/api/generate";

// Target GGUF model name loaded in Ollama
const MODEL_NAME = "prograd";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState("Model Ready");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!messageText.trim() || loading) return;

    const userPrompt = messageText.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userPrompt }]);
    setMessageText("");
    setStatus("Processing...");
    setLoading(true);

    try {
      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: userPrompt,
          stream: false,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.response },
      ]);
      setStatus("Model Ready");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error connecting to local Ollama instance." },
      ]);
      setStatus("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.autogeneral}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusText}>Status: {status}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.promptbox}
            placeholder="Ask anything..."
            placeholderTextColor="#777"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            textAlignVertical="center"
            editable={!loading}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (messageText.trim().length === 0 || loading) &&
                styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={messageText.trim().length === 0 || loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text style={styles.sendIcon}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  autogeneral: { flex: 1, backgroundColor: "black" },
  statusHeader: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  statusText: { color: "#888888", fontSize: 13 },
  keyboardView: { flex: 1 },
  chatArea: { flex: 1, width: "100%" },
  chatContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 16,
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
  sendButtonDisabled: { opacity: 0.3 },
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
  chatText: { color: "white", fontSize: 15, lineHeight: 20 },
});
