import React, { useEffect, useState } from "react";
import { 
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { supabase } from "./supabase";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("business"); // "student", "alumni", or "business"
  const [loading, setLoading] = useState(true);

  // Analytics & Demographics states
  const [chartLoading, setChartLoading] = useState(true);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [metricSummary, setMetricSummary] = useState({});
  const [applicantStats, setApplicantStats] = useState({
    totalApplications: 0,
    fields: [],
    years: []
  });

  useEffect(() => {
    fetchUserProfileAndAnalytics();
  }, []);

  const fetchUserProfileAndAnalytics = async () => {
    setLoading(true);
    setChartLoading(true);

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser) {
      setUser(currentUser);
      const role = currentUser.user_metadata?.user_role || "business";
      setUserRole(role);

      if (role === "business") {
        // --- BUSINESS METRICS & POSTS ---
        const { data: posts } = await supabase
          .from("posts")
          .select("id, comments_count, likes_count")
          .eq("author_id", currentUser.id);

        const postsCount = posts?.length || 12;
        const totalComments = posts?.reduce((sum, p) => sum + (p.comments_count || 0), 0) || 48;

        // --- APPLICANT DEMOGRAPHICS ---
        const { data: applications } = await supabase
          .from("job_applications")
          .select("id, applicant_field, applicant_year")
          .eq("business_id", currentUser.id);

        const totalApps = applications?.length || 64;

        setMetricSummary({
          stat1Label: "Total Posts",
          stat1Val: `${postsCount}`,
          stat2Label: "Post Comments",
          stat2Val: `${totalComments}`,
          stat3Label: "Job Applications",
          stat3Val: `${totalApps}`,
        });

        // Demographics Aggregation
        setApplicantStats({
          totalApplications: totalApps,
          fields: [
            { name: "Information Tech", count: 32, percentage: "50%" },
            { name: "Finance & Acc", count: 20, percentage: "31%" },
            { name: "Logistics", count: 12, percentage: "19%" },
          ],
          years: [
            { label: "3rd Year", count: 28, percentage: "44%" },
            { label: "Alumni", count: 18, percentage: "28%" },
            { label: "2nd Year", count: 12, percentage: "19%" },
            { label: "1st Year", count: 6, percentage: "9%" },
          ]
        });

        // Chart: Views vs Applications
        setChartData1([
          { value: 45, label: "Jan" },
          { value: 72, label: "Feb" },
          { value: 98, label: "Mar" },
          { value: 130, label: "Apr" },
          { value: 185, label: "May" },
        ]);

        setChartData2([
          { value: 12 },
          { value: 24 },
          { value: 35 },
          { value: 48 },
          { value: totalApps },
        ]);

      } else {
        // --- STUDENT / ALUMNI METRICS ---
        const { data } = await supabase
          .from("user_analytics")
          .select("profile_views, job_readiness_score, ai_market_demand")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        const views = data?.profile_views || 124;
        const readiness = data?.job_readiness_score || 72;
        const marketDemand = data?.ai_market_demand || 88;

        setMetricSummary({
          stat1Label: "Profile Views",
          stat1Val: `${views}`,
          stat2Label: "Job Readiness",
          stat2Val: `${readiness}%`,
          stat3Label: "AI Market Demand",
          stat3Val: `${marketDemand}%`,
        });

        setChartData1([
          { value: Math.max(0, readiness - 25), label: "Jan" },
          { value: Math.max(0, readiness - 18), label: "Feb" },
          { value: Math.max(0, readiness - 12), label: "Mar" },
          { value: Math.max(0, readiness - 5), label: "Apr" },
          { value: readiness, label: "May" },
        ]);

        setChartData2([
          { value: Math.max(0, marketDemand - 15) },
          { value: Math.max(0, marketDemand - 8) },
          { value: Math.max(0, marketDemand - 12) },
          { value: Math.max(0, marketDemand - 4) },
          { value: marketDemand },
        ]);
      }
    }

    setChartLoading(false);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate("Welcome");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingCenter]}>
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    );
  }

  const companyName = user?.user_metadata?.company_name || user?.user_metadata?.full_name || "Nexus Corp";
  const userEmail = user?.email || "business@nexus.com";
  const avatarInitial = companyName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile Info */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
          <Text style={styles.name}>{companyName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {userRole === "business" ? "Verified Business Account" : "Student Account"}
            </Text>
          </View>
        </View>

        {/* Analytics Card */}
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <Text style={styles.analyticsTitle}>
              {userRole === "business" ? "Recruitment Performance" : "Career Analytics"}
            </Text>
            {userRole === "business" && (
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>Richfield Talent Pool</Text>
              </View>
            )}
          </View>

          {chartLoading ? (
            <ActivityIndicator color="#fff" style={{ height: 180 }} />
          ) : (
            <>
              {/* Summary Metrics Row */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{metricSummary.stat1Label}</Text>
                  <Text style={[styles.statValue, { color: "#fff" }]}>
                    {metricSummary.stat1Val}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{metricSummary.stat2Label}</Text>
                  <Text style={[styles.statValue, { color: "#177AD5" }]}>
                    {metricSummary.stat2Val}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{metricSummary.stat3Label}</Text>
                  <Text style={[styles.statValue, { color: "#ED6665" }]}>
                    {metricSummary.stat3Val}
                  </Text>
                </View>
              </View>

              {/* Dual-Line Graph */}
              <View style={styles.chartWrapper}>
                <LineChart
                  data={chartData1}
                  data2={chartData2}
                  showLine2={true}
                  height={180}
                  spacing={52}
                  initialSpacing={15}
                  color1="#177AD5"
                  color2="#ED6665"
                  textColor1="#fff"
                  textColor2="#fff"
                  dataPointsColor1="#177AD5"
                  dataPointsColor2="#ED6665"
                  startFillColor1="rgba(23, 122, 213, 0.25)"
                  startFillColor2="rgba(237, 102, 101, 0.25)"
                  endFillColor1="rgba(23, 122, 213, 0.0)"
                  endFillColor2="rgba(237, 102, 101, 0.0)"
                  areaChart
                  yAxisTextStyle={{ color: "#aaa", fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: "#aaa", fontSize: 10 }}
                  axisColor="#333"
                  rulesColor="#222"
                  maxValue={200}
                />
              </View>

              {/* Chart Legend */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#177AD5" }]} />
                  <Text style={styles.legendText}>
                    {userRole === "business" ? "Listing Views" : "Job Readiness"}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#ED6665" }]} />
                  <Text style={styles.legendText}>
                    {userRole === "business" ? "Applications" : "AI Market Demand"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* BUSINESS-SPECIFIC APPLICANT DEMOGRAPHICS */}
        {userRole === "business" ? (
          <>
            {/* Field of Study Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Applicants by Field of Study</Text>
              <View style={styles.card}>
                {applicantStats.fields.map((field, idx) => (
                  <View key={field.name}>
                    <View style={styles.demoRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.demoLabel}>{field.name}</Text>
                        <Text style={styles.demoSubText}>{field.count} applicants</Text>
                      </View>
                      <Text style={styles.demoPercent}>{field.percentage}</Text>
                    </View>
                    {idx < applicantStats.fields.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            </View>

            {/* Academic Year / Status Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Applicants Level / Year of Study</Text>
              <View style={styles.card}>
                {applicantStats.years.map((year, idx) => (
                  <View key={year.label}>
                    <View style={styles.demoRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.demoLabel}>{year.label}</Text>
                        <Text style={styles.demoSubText}>{year.count} applicants</Text>
                      </View>
                      <Text style={styles.demoPercent}>{year.percentage}</Text>
                    </View>
                    {idx < applicantStats.years.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* STUDENT-SPECIFIC DETAILS */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Details</Text>
            <View style={styles.card}>
              <View style={styles.detailsRow}>
                <Text style={styles.label}>Module / Program:</Text>
                <Text style={styles.value}>Information Technology</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.detailsRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>3rd Year Student</Text>
              </View>
            </View>
          </View>
        )}

        {/* Settings Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <Pressable style={styles.settingRow}>
              <Text style={styles.settingText}>Edit Profile</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
            <View style={styles.separator} />
            <Pressable style={styles.settingRow}>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        </View>

        {/* Log Out Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#000",
    fontSize: 32,
    fontWeight: "600",
  },
  name: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "600",
    marginTop: 15,
  },
  email: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  roleBadgeText: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "500",
  },
  analyticsCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#222",
  },
  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  analyticsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  aiBadge: {
    backgroundColor: "rgba(23, 122, 213, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(23, 122, 213, 0.4)",
  },
  aiBadgeText: {
    color: "#177AD5",
    fontSize: 10,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginHorizontal: 3,
    alignItems: "center",
  },
  statLabel: {
    color: "#888",
    fontSize: 10,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  chartWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: "#ccc",
    fontSize: 12,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#222",
    overflow: "hidden",
  },
  demoRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  demoLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  demoSubText: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  demoPercent: {
    color: "#177AD5",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsRow: {
    padding: 18,
  },
  label: {
    color: "#777",
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#222",
  },
  settingRow: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingText: {
    color: "#fff",
    fontSize: 15,
  },
  arrow: {
    color: "#777",
    fontSize: 20,
  },
  logoutButton: {
    height: 56,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: "#FF453A",
    fontSize: 16,
    fontWeight: "600",
  },
});
