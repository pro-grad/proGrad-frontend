import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";

// Sub-components & hooks from src/
import { useJobs } from "../src/hooks/useJobs";
import FeedVideoItem from "../src/components/FeedVideoItem";
import CreateJobModal from "../src/components/CreateJobModal";
import { supabase } from "./supabase"; // Adjust path if needed

export default function JobsScreen() {
  const { jobs, isLoadingJobs, isUploading, pickMedia, createJob } = useJobs();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const roleFromMetadata = user.user_metadata?.user_role;

        if (roleFromMetadata) {
          setUserRole(roleFromMetadata.toLowerCase());
        } else {
          const fallbackRole = user.user_metadata?.role || user.user_metadata?.account_type;
          if (fallbackRole) {
            setUserRole(fallbackRole.toLowerCase());
          }
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    }

    fetchUserRole();
  }, []);

  const isBusiness = userRole === "business";

  const isVideoUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].toLowerCase();
    return [".mp4", ".mov", ".m4v", ".webm"].some((ext) => cleanUrl.endsWith(ext));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboard}>
        <View style={styles.dashboardHeader}>
          {isBusiness && (
            <Pressable style={styles.addButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addIcon}>+</Text>
            </Pressable>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.dashboardContent}>
          <Text style={styles.greeting}>Experiences & Jobs</Text>

          {/* Jobs Feed Section */}
          <View style={styles.feedSection}>
            <Text style={styles.feedHeading}>Listings</Text>
            {isLoadingJobs ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginTop: 20 }} />
            ) : jobs.length === 0 ? (
              <Text style={styles.emptyFeedText}>No job listings yet.</Text>
            ) : (
              jobs.map((job) => {
                const isVideo = isVideoUrl(job.media_url);

                return (
                  <View key={job.id} style={styles.postCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.postTitle}>{job.title}</Text>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{job.job_type === "ejob" ? "E-Job" : "Job"}</Text>
                      </View>
                    </View>

                    {job.media_url && (
                      isVideo ? <FeedVideoItem uri={job.media_url} /> : <Image source={{ uri: job.media_url }} style={styles.postMedia} resizeMode="cover" />
                    )}

                    {job.description ? (
                      <View style={styles.fieldSection}>
                        <Text style={styles.fieldLabel}>Description:</Text>
                        <Text style={styles.fieldValue}>{job.description}</Text>
                      </View>
                    ) : null}

                    {job.requirements ? (
                      <View style={styles.fieldSection}>
                        <Text style={styles.fieldLabel}>Requirements:</Text>
                        <Text style={styles.fieldValue}>{job.requirements}</Text>
                      </View>
                    ) : null}

                    {job.application_link ? (
                      <Pressable
                        style={styles.applyBtn}
                        onPress={() => Linking.openURL(job.application_link)}
                      >
                        <Text style={styles.applyBtnText}>Apply Now</Text>
                      </Pressable>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      {isBusiness && (
        <CreateJobModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onPickMedia={pickMedia}
          onSubmit={createJob}
          isUploading={isUploading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  dashboard: { flex: 1, backgroundColor: "#000" },
  dashboardHeader: { height: 60, paddingHorizontal: 20, justifyContent: "center", alignItems: "flex-end" },
  addButton: { padding: 5 },
  addIcon: { color: "#fff", fontSize: 32, fontWeight: "300" },
  dashboardContent: { paddingHorizontal: 20, paddingBottom: 20 },
  greeting: { color: "#fff", fontSize: 32, fontWeight: "600", marginTop: 10, marginBottom: 15 },
  feedSection: { marginTop: 15 },
  feedHeading: { color: "#fff", fontSize: 20, fontWeight: "600", marginBottom: 15 },
  emptyFeedText: { color: "#666", textAlign: "center", marginTop: 20 },
  postCard: { backgroundColor: "#080808", borderWidth: 1, borderColor: "#292929", borderRadius: 15, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  postTitle: { color: "#fff", fontSize: 18, fontWeight: "600", flex: 1 },
  badge: { backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
  badgeText: { color: "#000", fontSize: 11, fontWeight: "700" },
  postMedia: { width: "100%", height: 200, borderRadius: 10, marginVertical: 10 },
  fieldSection: { marginTop: 8 },
  fieldLabel: { color: "#777", fontSize: 12, fontWeight: "600" },
  fieldValue: { color: "#ccc", fontSize: 14, marginTop: 2 },
  applyBtn: { backgroundColor: "#fff", paddingVertical: 10, borderRadius: 8, alignItems: "center", marginTop: 12 },
  applyBtnText: { color: "#000", fontWeight: "600", fontSize: 14 },
});