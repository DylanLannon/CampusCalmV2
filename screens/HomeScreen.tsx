import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const DAILY_TIPS = [
  { emoji: "💷", tip: "Check your student loan balance and upcoming payment dates so you're never caught short." },
  { emoji: "🛒", tip: "Meal planning for the week can save up to £30 compared to buying daily." },
  { emoji: "📱", tip: "Most streaming services offer student discounts — check if you're paying full price." },
  { emoji: "🏦", tip: "Keep a buffer of at least £100 in your account for unexpected expenses." },
  { emoji: "☕", tip: "Making your own coffee 5 days a week saves around £600 a year compared to buying out." },
  { emoji: "📚", tip: "Check your university library before buying textbooks — most are available free." },
  { emoji: "🎟️", tip: "NUS card or TOTUM card gives discounts at hundreds of brands — worth getting if you haven't." },
  { emoji: "💡", tip: "If you're struggling financially, your university hardship fund is there for exactly this situation." },
];

export default function HomeScreen() {
  const [firstName, setFirstName] = useState("");
  const [university, setUniversity] = useState("");
  const [tipIndex] = useState(Math.floor(Math.random() * DAILY_TIPS.length));
  const [moodLogged, setMoodLogged] = useState(false);
  const [todayMood, setTodayMood] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      checkTodayMood();
    }, [])
  );

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setFirstName(user?.user_metadata?.full_name ?? "");
    const { data } = await supabase.from("profiles").select("university").eq("id", user?.id).single();
    if (data) setUniversity(data.university ?? "");
  };

  const checkTodayMood = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("mood_logs")
      .select("mood")
      .eq("user_id", user?.id)
      .gte("created_at", today)
      .limit(1);
    if (data && data.length > 0) {
      setTodayMood(data[0].mood);
      setMoodLogged(true);
    }
  };

  const logMood = async (mood: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("mood_logs").insert({ user_id: user?.id, mood, trigger: "financial" });
    setTodayMood(mood);
    setMoodLogged(true);
  };

  const MOODS = [
    { emoji: "😰", label: "Stressed", value: 1 },
    { emoji: "😟", label: "Worried", value: 2 },
    { emoji: "😐", label: "Okay", value: 3 },
    { emoji: "🙂", label: "Good", value: 4 },
    { emoji: "😊", label: "Great", value: 5 },
  ];

  const tip = DAILY_TIPS[tipIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}{firstName ? `, ${firstName}` : ""} 👋</Text>
            {university ? <Text style={styles.university}>{university}</Text> : null}
          </View>
          <Text style={styles.logo}>🌿</Text>
        </View>

        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>students stressed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>#1</Text>
            <Text style={styles.statLabel}>financial pressure</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10/19</Text>
            <Text style={styles.statLabel}>cited money stress</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>💡 Today's tip</Text>
          <Text style={styles.tipEmoji}>{tip.emoji}</Text>
          <Text style={styles.tipText}>{tip.tip}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>How are you feeling about money today?</Text>
          {moodLogged ? (
            <View style={styles.moodLogged}>
              <Text style={styles.moodLoggedEmoji}>{MOODS.find(m => m.value === todayMood)?.emoji}</Text>
              <Text style={styles.moodLoggedText}>Logged — {MOODS.find(m => m.value === todayMood)?.label}</Text>
            </View>
          ) : (
            <View style={styles.moodRow}>
              {MOODS.map(mood => (
                <TouchableOpacity key={mood.value} style={styles.moodBtn} onPress={() => logMood(mood.value)}>
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick access</Text>
          <View style={styles.actionsRow}>
            <View style={styles.actionCard}>
              <Text style={styles.actionEmoji}>💷</Text>
              <Text style={styles.actionTitle}>Finance Tools</Text>
              <Text style={styles.actionDesc}>Budgeting and money tips</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionEmoji}>📚</Text>
              <Text style={styles.actionTitle}>Resources</Text>
              <Text style={styles.actionDesc}>Support and guidance</Text>
            </View>
          </View>
        </View>

        <View style={styles.researchCard}>
          <Text style={styles.researchTitle}>About Campus Calm</Text>
          <Text style={styles.researchText}>Built on dissertation research at Northumbria University. Financial pressure was identified as the number one anxiety trigger for students — ahead of academic pressure and social stress. Campus Calm exists to address this gap.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  greeting: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text },
  university: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 2 },
  logo: { fontSize: 32 },
  statsBanner: { flexDirection: "row", backgroundColor: COLORS.primary, marginHorizontal: 16, marginBottom: 8, borderRadius: 16, padding: 16, justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.white },
  statLabel: { fontSize: FONTS.size.xs, color: COLORS.primaryLight, marginTop: 2, textAlign: "center" },
  statDivider: { width: 1, backgroundColor: COLORS.primaryLight, opacity: 0.4 },
  card: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 16, padding: 16 },
  cardLabel: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  tipEmoji: { fontSize: 32, marginBottom: 8 },
  tipText: { fontSize: FONTS.size.md, color: COLORS.text, lineHeight: 22 },
  moodRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  moodBtn: { alignItems: "center", flex: 1 },
  moodEmoji: { fontSize: 28, marginBottom: 4 },
  moodLabel: { fontSize: FONTS.size.xs, color: COLORS.textMuted },
  moodLogged: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  moodLoggedEmoji: { fontSize: 36 },
  moodLoggedText: { fontSize: FONTS.size.md, color: COLORS.primary, fontWeight: "600" },
  quickActions: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  actionsRow: { flexDirection: "row", gap: 8 },
  actionCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16 },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
  actionTitle: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  actionDesc: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  researchCard: { backgroundColor: COLORS.primaryBg, marginHorizontal: 16, marginBottom: 24, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  researchTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
  researchText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20 },
});