import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS, FONTS } from "../constants/colors";

const RESOURCES = [
  {
    category: "Financial Support",
    emoji: "💷",
    items: [
      { title: "Student Finance England", desc: "Loans, grants and bursaries for UK students", contact: "0300 100 0607", type: "phone" },
      { title: "Turn2Us", desc: "Find grants and benefits you're entitled to", contact: "https://turn2us.org.uk", type: "web" },
      { title: "StepChange", desc: "Free debt advice and support", contact: "0800 138 1111", type: "phone" },
      { title: "National Debtline", desc: "Free debt advice for people in England and Wales", contact: "0808 808 4000", type: "phone" },
      { title: "Money Helper", desc: "Free financial guidance backed by the government", contact: "https://moneyhelper.org.uk", type: "web" },
    ],
  },
  {
    category: "University Support",
    emoji: "🎓",
    items: [
      { title: "Student Wellbeing", desc: "University mental health and wellbeing team", contact: "wellbeing@northumbria.ac.uk", type: "email" },
      { title: "Student Finance Office", desc: "University financial support and hardship funds", contact: "studentfinance@northumbria.ac.uk", type: "email" },
      { title: "Students Union Advice", desc: "Independent advice on financial and welfare issues", contact: "https://mynsu.co.uk", type: "web" },
      { title: "University Hardship Fund", desc: "Emergency financial support for students in difficulty", contact: "Check your student portal", type: "info" },
    ],
  },
  {
    category: "Mental Health",
    emoji: "💚",
    items: [
      { title: "Samaritans", desc: "Free confidential support 24 hours a day", contact: "116 123", type: "phone" },
      { title: "Student Minds", desc: "UK student mental health charity", contact: "https://studentminds.org.uk", type: "web" },
      { title: "Mind", desc: "Mental health advice and support", contact: "https://mind.org.uk", type: "web" },
      { title: "NHS Mental Health", desc: "Mental health support through the NHS", contact: "https://nhs.uk/mental-health", type: "web" },
      { title: "Shout", desc: "Free confidential text support 24/7", contact: "Text HELLO to 85258", type: "info" },
    ],
  },
  {
    category: "Food and Essentials",
    emoji: "🛒",
    items: [
      { title: "Trussell Trust Food Banks", desc: "Free food parcels for people in crisis", contact: "https://trusselltrust.org", type: "web" },
      { title: "OLIO", desc: "Free food sharing app — reduce waste and save money", contact: "https://olioapp.com", type: "web" },
      { title: "Too Good To Go", desc: "Heavily discounted food from local restaurants", contact: "https://toogoodtogo.com", type: "web" },
      { title: "Community Fridge Network", desc: "Find free food near you", contact: "https://hubbub.org.uk/community-fridge", type: "web" },
    ],
  },
];

export default function ResourcesScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Financial Support");

  const handleContact = (contact: string, type: string) => {
    if (type === "phone") Linking.openURL(`tel:${contact.replace(/\s/g, "")}`);
    else if (type === "web") Linking.openURL(contact);
    else if (type === "email") Linking.openURL(`mailto:${contact}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Resources</Text>
          <Text style={styles.subtitle}>Support available to you as a student</Text>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>💡 You don't have to manage financial stress alone. These organisations exist specifically to help students in your situation.</Text>
        </View>

        {RESOURCES.map(category => (
          <View key={category.category} style={styles.categoryCard}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
            >
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryTitle}>{category.category}</Text>
              </View>
              <Text style={styles.chevron}>{expandedCategory === category.category ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {expandedCategory === category.category && (
              <View style={styles.itemsList}>
                {category.items.map((item, i) => (
                  <View key={i} style={[styles.item, i === category.items.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDesc}>{item.desc}</Text>
                    </View>
                    {item.type !== "info" ? (
                      <TouchableOpacity style={styles.contactBtn} onPress={() => handleContact(item.contact, item.type)}>
                        <Text style={styles.contactBtnText}>
                          {item.type === "phone" ? "📞 Call" : item.type === "email" ? "✉️ Email" : "🌐 Visit"}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.infoTag}>
                        <Text style={styles.infoTagText}>{item.contact}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.researchCard}>
          <Text style={styles.researchTitle}>Why we built Campus Calm</Text>
          <Text style={styles.researchText}>Research at Northumbria University found that financial pressure is the number one anxiety trigger for students — identified by 10 out of 19 participants. Yet most mental health apps ignore financial stress entirely. Campus Calm exists to fill that gap.</Text>
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
  banner: { backgroundColor: COLORS.primaryBg, marginHorizontal: 16, marginBottom: 8, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  bannerText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20 },
  categoryCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 16, overflow: "hidden" },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  categoryLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  categoryEmoji: { fontSize: 24 },
  categoryTitle: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  chevron: { fontSize: 12, color: COLORS.textMuted },
  itemsList: { paddingHorizontal: 16, paddingBottom: 8 },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.gray200, gap: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  itemDesc: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 2 },
  contactBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  contactBtnText: { fontSize: FONTS.size.xs, color: COLORS.white, fontWeight: "600" },
  infoTag: { backgroundColor: COLORS.gray100, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, maxWidth: 120 },
  infoTagText: { fontSize: FONTS.size.xs, color: COLORS.textMuted, textAlign: "center" },
  researchCard: { backgroundColor: COLORS.primaryBg, marginHorizontal: 16, marginBottom: 24, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  researchTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
  researchText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20 },
});