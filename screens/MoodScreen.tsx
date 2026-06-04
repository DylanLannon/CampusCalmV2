import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

interface MoodLog {
  id: string;
  mood: number;
  note: string;
  trigger: string;
  created_at: string;
}

const MOODS = [
  { emoji: "😰", label: "Stressed", value: 1, color: "#EF4444" },
  { emoji: "😟", label: "Worried", value: 2, color: "#F97316" },
  { emoji: "😐", label: "Okay", value: 3, color: "#F59E0B" },
  { emoji: "🙂", label: "Good", value: 4, color: "#22C55E" },
  { emoji: "😊", label: "Great", value: 5, color: "#2D6A4F" },
];

const TRIGGERS = [
  "Student loan", "Rent", "Food costs", "Going out", "Unexpected bill",
  "Part time work", "Family pressure", "Academic pressure", "Other"
];

export default function MoodScreen() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [todayLogged, setTodayLogged] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const loadLogs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(14);
    if (data) {
      setLogs(data);
      const today = new Date().toISOString().split("T")[0];
      setTodayLogged(data.some(log => log.created_at.startsWith(today)));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("mood_logs").insert({
      user_id: user?.id,
      mood: selectedMood,
      trigger: selectedTrigger || null,
      note: note || null,
    });
    setSelectedMood(null);
    setSelectedTrigger("");
    setNote("");
    setShowForm(false);
    loadLogs();
    setSaving(false);
  };

  const averageMood = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.mood, 0) / logs.length).toFixed(1)
    : null;

  const getMoodData = (value: number) => MOODS.find(m => m.value === value) ?? MOODS[2];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mood Tracker</Text>
          <Text style={styles.subtitle}>Track how financial stress affects your wellbeing</Text>
        </View>

        {!todayLogged && !showForm && (
          <TouchableOpacity style={styles.logTodayCard} onPress={() => setShowForm(true)}>
            <Text style={styles.logTodayEmoji}>💚</Text>
            <View style={styles.logTodayText}>
              <Text style={styles.logTodayTitle}>Log today's mood</Text>
              <Text style={styles.logTodaySubtitle}>How are you feeling about money today?</Text>
            </View>
            <Text style={styles.logTodayArrow}>→</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>How are you feeling?</Text>
            <View style={styles.moodRow}>
              {MOODS.map(mood => (
                <TouchableOpacity
                  key={mood.value}
                  style={[styles.moodBtn, selectedMood === mood.value && { borderColor: mood.color, borderWidth: 2, backgroundColor: mood.color + "20" }]}
                  onPress={() => setSelectedMood(mood.value)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>What's the main financial trigger? (optional)</Text>
            <View style={styles.chipRow}>
              {TRIGGERS.map(trigger => (
                <TouchableOpacity
                  key={trigger}
                  style={[styles.chip, selectedTrigger === trigger && styles.chipActive]}
                  onPress={() => setSelectedTrigger(selectedTrigger === trigger ? "" : trigger)}
                >
                  <Text style={[styles.chipText, selectedTrigger === trigger && styles.chipTextActive]}>{trigger}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Any notes? (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="How is money stress affecting you today..."
              placeholderTextColor={COLORS.gray400}
              value={note}
              onChangeText={setNote}
              multiline
            />

            <View style={styles.formBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, !selectedMood && styles.saveBtnDisabled]} onPress={handleSave} disabled={!selectedMood || saving}>
                {saving ? <ActivityIndicator color={COLORS.white} size="small" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {logs.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{logs.length}</Text>
              <Text style={styles.statLabel}>Days logged</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{averageMood}</Text>
              <Text style={styles.statLabel}>Avg mood</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{getMoodData(Math.round(parseFloat(averageMood ?? "3"))).emoji}</Text>
              <Text style={styles.statLabel}>Overall</Text>
            </View>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : logs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💚</Text>
            <Text style={styles.emptyTitle}>No mood logs yet</Text>
            <Text style={styles.emptyDesc}>Start tracking how financial stress affects your mood. Patterns help you understand your triggers and seek support sooner.</Text>
          </View>
        ) : (
          <View style={styles.logsList}>
            <Text style={styles.sectionTitle}>Recent logs</Text>
            {logs.map(log => {
              const moodData = getMoodData(log.mood);
              return (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logTop}>
                    <Text style={styles.logEmoji}>{moodData.emoji}</Text>
                    <View style={styles.logInfo}>
                      <Text style={styles.logMood}>{moodData.label}</Text>
                      <Text style={styles.logDate}>
                        {new Date(log.created_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                      </Text>
                    </View>
                    {log.trigger && (
                      <View style={styles.triggerTag}>
                        <Text style={styles.triggerTagText}>{log.trigger}</Text>
                      </View>
                    )}
                  </View>
                  {log.note && <Text style={styles.logNote}>{log.note}</Text>}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Struggling with financial stress?</Text>
          <Text style={styles.supportText}>If money worries are significantly affecting your mental health, please reach out. Your university wellbeing team and student services are there to help.</Text>
          <View style={styles.supportLinks}>
            <Text style={styles.supportLink}>🎓 Student Wellbeing: wellbeing@northumbria.ac.uk</Text>
            <Text style={styles.supportLink}>📞 Samaritans: 116 123 (free, 24/7)</Text>
            <Text style={styles.supportLink}>💚 Student Minds: studentminds.org.uk</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 4 },
  logTodayCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary, marginHorizontal: 16, marginBottom: 8, borderRadius: 16, padding: 16, gap: 12 },
  logTodayEmoji: { fontSize: 32 },
  logTodayText: { flex: 1 },
  logTodayTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.white },
  logTodaySubtitle: { fontSize: FONTS.size.sm, color: COLORS.primaryLight, marginTop: 2 },
  logTodayArrow: { fontSize: 20, color: COLORS.white },
  form: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 16, padding: 16 },
  formTitle: { fontSize: FONTS.size.lg, fontWeight: "600", color: COLORS.text, marginBottom: 16 },
  moodRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  moodBtn: { alignItems: "center", flex: 1, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: COLORS.gray200 },
  moodEmoji: { fontSize: 28, marginBottom: 4 },
  moodLabel: { fontSize: FONTS.size.xs, color: COLORS.textMuted },
  fieldLabel: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 8, marginTop: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONTS.size.xs, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.white, fontWeight: "600" },
  noteInput: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 12, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50, height: 80, textAlignVertical: "top", marginBottom: 12 },
  formBtns: { flexDirection: "row", gap: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 14, alignItems: "center" },
  cancelBtnText: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  saveBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: "center" },
  saveBtnDisabled: { backgroundColor: COLORS.gray200 },
  saveBtnText: { color: COLORS.white, fontWeight: "600", fontSize: FONTS.size.md },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, alignItems: "center" },
  statValue: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.primary },
  statLabel: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 2 },
  empty: { alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: FONTS.size.xl, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center", lineHeight: 22 },
  logsList: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  logCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 8 },
  logTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  logEmoji: { fontSize: 28 },
  logInfo: { flex: 1 },
  logMood: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  logDate: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 2 },
  triggerTag: { backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  triggerTagText: { fontSize: FONTS.size.xs, color: COLORS.primary, fontWeight: "600" },
  logNote: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 8 },
  supportCard: { backgroundColor: COLORS.primaryBg, marginHorizontal: 16, marginBottom: 24, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  supportTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
  supportText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20, marginBottom: 12 },
  supportLinks: { gap: 6 },
  supportLink: { fontSize: FONTS.size.sm, color: COLORS.text },
});