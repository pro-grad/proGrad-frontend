// DashBoardScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";

// Sub-components & hooks from src/
import { usePosts } from "../src/hooks/usePosts";
import FeedVideoItem from "../src/components/FeedVideoItem";
import CreatePostModal from "../src/components/CreatePostModal";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DashBoardScreen() {
  const { posts, isLoadingFeed, isUploading, pickMedia, createPost } = usePosts();

  // Inline Calendar State & Calculations
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const getTotalDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstWeekdayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const getMondayStartOffset = (y, m) => {
    const day = getFirstWeekdayOfMonth(y, m);
    return day === 0 ? 6 : day - 1;
  };

  const buildCalendarGrid = () => {
    const startOffset = getMondayStartOffset(year, month);
    const totalDays = getTotalDaysInMonth(year, month);
    const grid = [];
    for (let i = 0; i < startOffset; i++) grid.push(null);
    for (let day = 1; day <= totalDays; day++) grid.push(day);
    return grid;
  };

  // Feed State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentsState, setCommentsState] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const toggleLike = (postId) => setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const addComment = (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    setCommentsState((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), text.trim()] }));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].toLowerCase();
    return [".mp4", ".mov", ".m4v", ".webm"].some((ext) => cleanUrl.endsWith(ext));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboard}>
        <View style={styles.dashboardHeader}>
          <Pressable style={styles.addButton} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.addIcon}>+</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.dashboardContent}>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.dashboardSubtitle}>Stay focused and keep pushing forward.</Text>

          {/* Calendar UI directly in screen */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Calendar</Text>
            <View style={styles.monthHeader}>
              <Pressable onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}>
                <Text style={styles.monthArrow}>‹</Text>
              </Pressable>
              <Text style={styles.month}>{monthNames[month]} {year}</Text>
              <Pressable onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}>
                <Text style={styles.monthArrow}>›</Text>
              </Pressable>
            </View>

            <View style={styles.calendarDays}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <Text key={i} style={styles.day}>{d}</Text>
              ))}
            </View>

            <View style={styles.calendarNumbers}>
              {buildCalendarGrid().map((number, index) => {
                const isSelected =
                  number !== null &&
                  number === selectedDay.getDate() &&
                  month === selectedDay.getMonth() &&
                  year === selectedDay.getFullYear();

                return (
                  <Pressable
                    key={index}
                    disabled={number === null}
                    onPress={() => number && setSelectedDay(new Date(year, month, number))}
                    style={[styles.calendarNumber, isSelected && styles.selectedDay]}
                  >
                    <Text style={[styles.numberText, isSelected && styles.selectedNumber]}>
                      {number}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Feed Section */}
          <View style={styles.feedSection}>
            <Text style={styles.feedHeading}>Feed</Text>
            {isLoadingFeed ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginTop: 20 }} />
            ) : posts.length === 0 ? (
              <Text style={styles.emptyFeedText}>No posts yet. Tap + to share one!</Text>
            ) : (
              posts.map((post) => {
                const isLiked = likedPosts[post.id];
                const postComments = commentsState[post.id] || [];
                const isVideo = isVideoUrl(post.image_url);

                return (
                  <View key={post.id} style={styles.postCard}>
                    <Text style={styles.postTitle}>{post.title}</Text>

                    {post.image_url && (
                      isVideo ? <FeedVideoItem uri={post.image_url} /> : <Image source={{ uri: post.image_url }} style={styles.postMedia} resizeMode="cover" />
                    )}

                    <View style={styles.actionsBar}>
                      <Pressable style={styles.actionBtn} onPress={() => toggleLike(post.id)}>
                        <Text style={styles.actionIcon}>{isLiked ? "❤️" : "🤍"}</Text>
                        <Text style={styles.actionText}>{isLiked ? 1 : 0}</Text>
                      </Pressable>

                      <Pressable style={styles.actionBtn} onPress={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}>
                        <Text style={styles.actionIcon}>💬</Text>
                        <Text style={styles.actionText}>{postComments.length}</Text>
                      </Pressable>
                    </View>

                    {postComments.length > 0 && (
                      <View style={styles.commentsList}>
                        {postComments.map((cmt, idx) => <Text key={idx} style={styles.commentItem}>• {cmt}</Text>)}
                      </View>
                    )}

                    {activeCommentPostId === post.id && (
                      <View style={styles.commentInputRow}>
                        <TextInput
                          style={styles.commentInput}
                          placeholder="Write a comment..."
                          placeholderTextColor="#666"
                          value={commentInputs[post.id] || ""}
                          onChangeText={(text) => setCommentInputs((prev) => ({ ...prev, [post.id]: text }))}
                        />
                        <Pressable style={styles.sendCommentBtn} onPress={() => addComment(post.id)}>
                          <Text style={styles.sendCommentText}>Send</Text>
                        </Pressable>
                      </View>
                    )}

                    <Text style={styles.postTime}>{new Date(post.created_at).toLocaleDateString()}</Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onPickMedia={pickMedia}
        onSubmit={createPost}
        isUploading={isUploading}
      />
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
  greeting: { color: "#fff", fontSize: 32, fontWeight: "600", marginTop: 10 },
  dashboardSubtitle: { color: "#999", fontSize: 15, marginTop: 8, marginBottom: 25 },
  card: { backgroundColor: "#080808", borderWidth: 1, borderColor: "#292929", borderRadius: 15, padding: 18, marginBottom: 15 },
  cardTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 20 },
  month: { color: "#aaa", fontSize: 14 },
  monthArrow: { color: "#fff", fontSize: 30, paddingHorizontal: 10 },
  calendarDays: { flexDirection: "row", justifyContent: "space-between" },
  day: { color: "#777", width: "14%", textAlign: "center" },
  calendarNumbers: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  calendarNumber: { width: "14.28%", height: 40, alignItems: "center", justifyContent: "center" },
  numberText: { color: "#fff" },
  selectedDay: { backgroundColor: "#fff", borderRadius: 20 },
  selectedNumber: { color: "#000", fontWeight: "600" },
  feedSection: { marginTop: 15 },
  feedHeading: { color: "#fff", fontSize: 20, fontWeight: "600", marginBottom: 15 },
  emptyFeedText: { color: "#666", textAlign: "center", marginTop: 20 },
  postCard: { backgroundColor: "#080808", borderWidth: 1, borderColor: "#292929", borderRadius: 15, padding: 15, marginBottom: 15 },
  postTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 12 },
  postMedia: { width: "100%", height: 250, borderRadius: 10, marginBottom: 12 },
  actionsBar: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionIcon: { fontSize: 18 },
  actionText: { color: "#aaa", marginLeft: 6, fontSize: 14 },
  commentsList: { marginBottom: 10, paddingLeft: 5 },
  commentItem: { color: "#ccc", fontSize: 13, marginTop: 4 },
  commentInputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  commentInput: { flex: 1, backgroundColor: "#111", borderColor: "#222", borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: "#fff", fontSize: 13 },
  sendCommentBtn: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  sendCommentText: { color: "#000", fontWeight: "600", fontSize: 12 },
  postTime: { color: "#555", fontSize: 12 },
});
