import React, { useState, useRef } from "react";
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
import { WebView } from "react-native-webview";

const AI_ENGINE_URL = "https://6f5345d8.aiengine-2hm.pages.dev/";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState("Initializing Engine...");

  const webViewRef = useRef(null);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.status === "ready" || data.type === "STATUS") {
        setStatus("Model Ready");
      } else if (data.status === "start" || data.status === "update") {
        setStatus("Processing...");
      } else if (data.status === "complete" || data.type === "AI_RESPONSE") {
        const responseText =
          typeof data.output === "string"
            ? data.output
            : JSON.stringify(data.output || data.text || data.payload);

        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: responseText },
        ]);
        setStatus("Model Ready");
      }
    } catch (e) {
      if (typeof event.nativeEvent.data === "string") {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: event.nativeEvent.data },
        ]);
        setStatus("Model Ready");
      }
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const userPrompt = messageText.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userPrompt }]);
    setMessageText("");
    setStatus("Processing...");

    if (webViewRef.current) {
      webViewRef.current.postMessage(userPrompt);
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
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              messageText.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={messageText.trim().length === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.hiddenContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: AI_ENGINE_URL }}
          onMessage={handleWebViewMessage}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          cacheEnabled={true}
          allowFileAccess={true}
          originWhitelist={["*"]}
        />
      </View>
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
  hiddenContainer: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
