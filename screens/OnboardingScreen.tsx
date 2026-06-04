import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS, FONTS } from "../constants/colors";
import { supabase } from "../services/supabase";

const UNIVERSITIES = [
  "Northumbria University",
  "Newcastle University",
  "Durham University",
  "Sunderland University",
  "Teesside University",
  "Other",
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"];

interface Props { onComplete: () => void; }

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStep1 = async () => {
    if (!firstName.trim()) { setError("Please enter your first name"); return; }
    setError(null);
    setStep(2);
  };

  const handleComplete = async () => {
    if (!university || !yearOfStudy) { setError("Please select your university and year"); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.auth.updateUser({ data: { full_name: firstName } });
    await supabase.from("profiles").upsert({
      id: user?.id,
      business_name: firstName,
      university,
      year_of_study: YEAR_OPTIONS.indexOf(yearOfStudy) + 1,
    });
    setLoading(false);
    onComplete();
  };

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>Welcome to Campus Calm</Text>
          <Text style={styles.subtitle}>Your financial wellbeing companion for university life.</Text>

          <View style={styles.stepRow}>
            <View style={[styles.step, styles.stepActive]} />
            <View style={styles.step} />
          </View>

          <Text style={styles.stepTitle}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Your first name"
            placeholderTextColor={COLORS.gray400}
            value={firstName}
            onChangeText={setFirstName}
            autoFocus
          />

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statText}>of students experience anxiety during their university transition</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>#1</Text>
            <Text style={styles.statText}>Financial pressure is the biggest trigger — ahead of academic and social stress</Text>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={handleStep1}>
            <Text style={styles.btnText}>Continue →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={onComplete}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>🎓</Text>
        <Text style={styles.title}>About your studies</Text>
        <Text style={styles.subtitle}>We'll tailor your experience based on where you are in your journey.</Text>

        <View style={styles.stepRow}>
          <View style={[styles.step, styles.stepDone]} />
          <View style={[styles.step, styles.stepActive]} />
        </View>

        <Text style={styles.fieldLabel}>Your university</Text>
        <View style={styles.chipRow}>
          {UNIVERSITIES.map(uni => (
            <TouchableOpacity key={uni} style={[styles.chip, university === uni && styles.chipActive]} onPress={() => setUniversity(uni)}>
              <Text style={[styles.chipText, university === uni && styles.chipTextActive]}>{uni}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Year of study</Text>
        <View style={styles.chipRow}>
          {YEAR_OPTIONS.map(year => (
            <TouchableOpacity key={year} style={[styles.chip, yearOfStudy === year && styles.chipActive]} onPress={() => setYearOfStudy(year)}>
              <Text style={[styles.chipText, yearOfStudy === year && styles.chipTextActive]}>{year}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.btn} onPress={handleComplete} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.btnText}>Get started 🌿</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={onComplete}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  inner: { padding: 24, alignItems: "stretch" },
  logo: { fontSize: 56, textAlign: "center", marginBottom: 12, marginTop: 20 },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.primary, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: FONTS.size.md, color: COLORS.textMuted, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  stepRow: { flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 32 },
  step: { width: 32, height: 4, borderRadius: 2, backgroundColor: COLORS.gray200 },
  stepActive: { backgroundColor: COLORS.primary },
  stepDone: { backgroundColor: COLORS.success },
  stepTitle: { fontSize: FONTS.size.lg, fontWeight: "600", color: COLORS.text, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 14, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50, marginBottom: 24 },
  statCard: { backgroundColor: COLORS.primaryBg, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  statNumber: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.primary, marginBottom: 4 },
  statText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20 },
  fieldLabel: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 10, marginTop: 16 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONTS.size.sm, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.white, fontWeight: "600" },
  btn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  btnText: { color: COLORS.white, fontSize: FONTS.size.md, fontWeight: "600" },
  skipBtn: { padding: 12, alignItems: "center", marginTop: 8 },
  skipText: { color: COLORS.textMuted, fontSize: FONTS.size.md },
  error: { fontSize: FONTS.size.sm, color: COLORS.danger, marginTop: 4 },
});