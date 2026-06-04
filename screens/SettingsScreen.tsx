import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

export default function SettingsScreen() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setEmail(user?.email ?? "");
    setFirstName(user?.user_metadata?.full_name ?? "");
    const { data } = await supabase.from("profiles").select("university").eq("id", user?.id).single();
    if (data) setUniversity(data.university ?? "");
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.auth.updateUser({ data: { full_name: firstName } });
    await supabase.from("profiles").upsert({ id: user?.id, business_name: firstName, university });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your profile</Text>

              <View style={styles.card}>
                <Text style={styles.fieldLabel}>First name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Your first name"
                  placeholderTextColor={COLORS.gray400}
                />

                <Text style={styles.fieldLabel}>University</Text>
                <TextInput
                  style={styles.input}
                  value={university}
                  onChangeText={setUniversity}
                  placeholder="Your university"
                  placeholderTextColor={COLORS.gray400}
                />

                <Text style={styles.fieldLabel}>Email</Text>
                <View style={styles.emailRow}>
                  <Text style={styles.emailText}>{email}</Text>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color={COLORS.white} size="small" /> : <Text style={styles.saveBtnText}>{saved ? "✓ Saved" : "Save changes"}</Text>}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.card}>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>App</Text>
                  <Text style={styles.aboutValue}>Campus Calm</Text>
                </View>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Version</Text>
                  <Text style={styles.aboutValue}>2.0.0</Text>
                </View>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Research</Text>
                  <Text style={styles.aboutValue}>Northumbria University 2026</Text>
                </View>
                <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.aboutLabel}>Website</Text>
                  <Text style={[styles.aboutValue, { color: COLORS.primary }]}>campuscalm.co.uk</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.researchCard}>
                <Text style={styles.researchTitle}>🌿 Our mission</Text>
                <Text style={styles.researchText}>Campus Calm was built on research identifying financial pressure as the number one anxiety trigger for students. We exist to bridge the gap between financial stress and mental wellbeing support.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { padding: 20, backgroundColor: COLORS.white, marginBottom: 8 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16 },
  fieldLabel: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 14, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50 },
  emailRow: { backgroundColor: COLORS.gray100, borderRadius: 12, padding: 14 },
  emailText: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 16 },
  saveBtnText: { color: COLORS.white, fontWeight: "600", fontSize: FONTS.size.md },
  aboutRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.gray200 },
  aboutLabel: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  aboutValue: { fontSize: FONTS.size.md, color: COLORS.text, fontWeight: "500" },
  researchCard: { backgroundColor: COLORS.primaryBg, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  researchTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
  researchText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20 },
  signOutBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: "center", borderWidth: 1, borderColor: COLORS.danger, marginBottom: 24 },
  signOutText: { fontSize: FONTS.size.md, color: COLORS.danger, fontWeight: "600" },
});