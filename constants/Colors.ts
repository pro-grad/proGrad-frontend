import { StyleSheet } from "react-native";

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#000',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};


// ==================================================
// STYLES
// ==================================================

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // =========================
  // WELCOME SCREEN
  // =========================

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

  tagline: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
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

  // =========================
  // LOGIN SCREEN
  // =========================

  authScreen: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 50,
  },

  backButton: {
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

  // =========================
  // TABS
  // =========================

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

  // =========================
  // INPUTS
  // =========================

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

  // =========================
  // MAIN BUTTON
  // =========================

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

  // =========================
  // DIVIDER
  // =========================

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

  // =========================
  // GOOGLE
  // =========================

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

  // =========================
  // ACCOUNT SWITCH
  // =========================

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

  // =========================
  // DASHBOARD
  // =========================

  dashboard: {
    flex: 1,
    backgroundColor: "#000",
  },

  dashboardHeader: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  dashboardContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  greeting: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
    marginTop: 20,
  },

  dashboardSubtitle: {
    color: "#999",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  month: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
  },

  calendarDays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  day: {
    color: "#777",
    width: "14%",
    textAlign: "center",
  },

  calendarNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  calendarNumber: {
    width: "14.28%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    color: "#fff",
  },

  selectedDay: {
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  selectedNumber: {
    color: "#000",
    fontWeight: "600",
  },

  task: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  taskDot: {
    width: 9,
    height: 9,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 12,
  },

  taskInformation: {
    flex: 1,
  },

  taskTitle: {
    color: "#fff",
    fontSize: 15,
  },

  taskTime: {
    color: "#777",
    fontSize: 13,
    marginTop: 6,
  },

  chatCard: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  robot: {
    fontSize: 22,
    marginRight: 10,
  },

  chatTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  aiMessage: {
    color: "#fff",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    lineHeight: 22,
  },

  chatInput: {
    height: 55,
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    marginTop: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  placeholder: {
    color: "#666",
  },

  send: {
    color: "#fff",
    fontSize: 20,
  },

  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: "#080808",
    borderTopWidth: 1,
    borderTopColor: "#222",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navigationItem: {
    alignItems: "center",
  },

  navigationIcon: {
    color: "#fff",
    fontSize: 21,
  },

  navigationText: {
    color: "#777",
    fontSize: 10,
    marginTop: 4,
  },
});

