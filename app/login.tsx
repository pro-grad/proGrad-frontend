import { globalStyles } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';

function login() {
    // const setSawWelcomeMes = useAppStore((s) => s.setSawWelcomeMes);
    // const setSawWelcomeMes = useAppStore((s) => s.is);
     // Controls Login or Sign Up
  const [authMode, setAuthMode] = useState("login");
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={globalStyles.authScreen}
        keyboardShouldPersistTaps="handled"
      >
        {/* BACK BUTTON */}

        <Pressable onPress={() => router.back()}>
          <Text style={globalStyles.backButton}>‹</Text>
        </Pressable>

        {/* HEADER */}

        <View style={globalStyles.authHeader}>
          <Text style={globalStyles.authTitle}>
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </Text>

          <Text style={globalStyles.authSubtitle}>
            {authMode === "login"
              ? "Login to continue your journey\nwith proGrad."
              : "Sign up to start your journey\nwith proGrad."}
          </Text>
        </View>

        {/* LOGIN / SIGN UP TABS */}

        <View style={globalStyles.tabs}>
          <Pressable
            style={[globalStyles.tab, authMode === "login" && globalStyles.activeTab]}
            onPress={() => setAuthMode("login")}
          >
            <Text
              style={[
                globalStyles.tabText,
                authMode === "login" && globalStyles.activeTabText,
              ]}
            >
              Login
            </Text>
          </Pressable>

          <Pressable
            style={[globalStyles.tab, authMode === "signup" && globalStyles.activeTab]}
            onPress={() => setAuthMode("signup")}
          >
            <Text
              style={[
                globalStyles.tabText,
                authMode === "signup" && globalStyles.activeTabText,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>

        {/* EMAIL */}

        <Text style={globalStyles.inputLabel}>Email</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* PASSWORD */}

        <Text style={globalStyles.inputLabel}>Password</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Enter your password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* FORGOT PASSWORD */}

        {authMode === "login" && (
          <Pressable>
            <Text style={globalStyles.forgotPassword}>Forgot password?</Text>
          </Pressable>
        )}

        {/* LOGIN / SIGN UP BUTTON */}

        <Pressable
          style={globalStyles.primaryButton}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={globalStyles.primaryButtonText}>
            {authMode === "login" ? "Login" : "Create Account"}
          </Text>
        </Pressable>

        {/* OR */}

        <View style={globalStyles.dividerContainer}>
          <View style={globalStyles.divider} />

          <Text style={globalStyles.orText}>or</Text>

          <View style={globalStyles.divider} />
        </View>

        {/* GOOGLE */}

        <Pressable style={globalStyles.googleButton}>
          <Text style={globalStyles.googleG}>G</Text>

          <Text style={globalStyles.googleText}>Continue with Google</Text>
        </Pressable>

        {/* ACCOUNT SWITCH */}

        <View style={globalStyles.accountSwitch}>
          <Text style={globalStyles.accountText}>
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
          </Text>

          <Pressable
            onPress={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            <Text style={globalStyles.signUpText}>
              {authMode === "login" ? "Sign Up" : "Login"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default login
