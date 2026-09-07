import { globalStyles } from "@/constants/Colors";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";

function welcome() {
     const setSawWelcomeMes = useAppStore((s) => s.setSawWelcomeMes);
  return (
    <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.welcomeScreen}>
          {/* APP NAME */}
          <View style={globalStyles.centerContent}>
            <Text style={globalStyles.logo}>proGrad</Text>

            <Text style={globalStyles.tagline}>Plan. Learn. Achieve.</Text>

            <Text style={globalStyles.tagline}>Graduate with purpose.</Text>
          </View>

          {/* PROCEED BUTTON */}
          <Pressable
            style={globalStyles.proceedButton}
            onPress={() => router.push("/login")}
          >
            <Text style={globalStyles.proceedText}>Proceed</Text>

            <Text style={globalStyles.arrow}>→</Text>
          </Pressable>
        </View>
      </SafeAreaView>
  )
}

export default welcome
