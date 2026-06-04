import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS, FONTS } from "../constants/colors";

const FINANCE_TIPS = [
  {
    category: "Student Loan",
    emoji: "🎓",
    tips: [
      "Your student loan is paid in three instalments — plan your spending around these dates",
      "Maintenance loan amounts vary by household income and where you study",
      "You only start repaying when you earn over £25,000 per year",
      "Repayments are 9% of everything you earn above the threshold",
      "If you earn under the threshold your debt is written off after 40 years",
    ],
  },
  {
    category: "Budgeting",
    emoji: "💷",
    tips: [
      "The 50/30/20 rule — 50% essentials, 30% wants, 20% savings",
      "Track every expense for one week — most people are shocked by what they find",
      "Meal prep on Sundays to avoid expensive daily food purchases",
      "Buy own brand supermarket products — often identical quality at half the price",
      "Use cashback apps like TopCashback or Quidco for everyday purchases",
    ],
  },
  {
    category: "Discounts",
    emoji: "🏷️",
    tips: [
      "TOTUM card gives student discounts at hundreds of retailers",
      "UNiDAYS and Student Beans are free and give instant discounts online",
      "Spotify, Apple Music and Amazon Prime all offer student rates",
      "Many cinemas offer student discount on weekdays",
      "Always ask — many businesses offer student discounts even if not advertised",
    ],
  },
  {
    category: "Emergency Help",
    emoji: "🆘",
    tips: [
      "Every university has a hardship fund for students in financial difficulty",
      "Apply early — funds are limited and given on a first come first served basis",
      "Student Loans Company has bursaries and grants you may not know about",
      "Turn2Us.org.uk helps you find grants and benefits you're entitled to",
      "StepChange offers free debt advice specifically for students",
    ],
  },
  {
    category: "Saving",
    emoji: "🏦",
    tips: [
      "Even saving £10 a week adds up to over £500 a year",
      "A Chase savings account currently offers 4.5% interest — better than most banks",
      "Set up a standing order on loan payment day before you can spend it",
      "Avoid buy now pay later schemes — they make overspending too easy",
      "Cook in bulk and freeze portions to reduce food waste and cost",
    ],
  },
];

const BUDGET_CATEGORIES = [
  { name: "Rent", emoji: "🏠", suggested: 500 },
  { name: "Food", emoji: "🛒", suggested: 150 },
  { name: "Transport", emoji: "🚌", suggested: 50 },
  { name: "Going out", emoji: "🎉", suggested: 80 },
  { name: "Subscriptions", emoji: "📱", suggested: 30 },
  { name: "Clothes", emoji: "👕", suggested: 40 },
  { name: "Other", emoji: "📦", suggested: 50 },
];

export default function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<"tips" | "budget">("tips");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<{ [key: string]: string }>({});

  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const remaining = (parseFloat(income) || 0) - totalExpenses;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Finance</Text>
        <Text style={styles.subtitle}>Tools and tips for student money management</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, activeTab === "tips" && styles.tabActive]} onPress={() => setActiveTab("tips")}>
          <Text style={[styles.tabText, activeTab === "tips" && styles.tabTextActive]}>💡 Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === "budget" && styles.tabActive]} onPress={() => setActiveTab("budget")}>
          <Text style={[styles.tabText, activeTab === "budget" && styles.tabTextActive]}>📊 Budget</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {activeTab === "tips" ? (
          <View style={styles.section}>
            {FINANCE_TIPS.map(category => (
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
                  <View style={styles.tipsList}>
                    {category.tips.map((tip, i) => (
                      <View key={i} style={styles.tipItem}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <View style={styles.helpCard}>
              <Text style={styles.helpTitle}>🆘 Need urgent help?</Text>
              <Text style={styles.helpText}>If you're struggling financially right now, contact your university's student services team. Every university has emergency funds available — you just need to ask.</Text>
              <View style={styles.helpLinks}>
                <View style={styles.helpLink}><Text style={styles.helpLinkText}>💷 Student Finance England: 0300 100 0607</Text></View>
                <View style={styles.helpLink}><Text style={styles.helpLinkText}>🌐 Turn2Us: turn2us.org.uk</Text></View>
                <View style={styles.helpLink}><Text style={styles.helpLinkText}>📞 StepChange: 0800 138 1111</Text></View>
                <View style={styles.helpLink}><Text style={styles.helpLinkText}>🎓 University Hardship Fund: check student portal</Text></View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.budgetCard}>
              <Text style={styles.budgetLabel}>Monthly income (£)</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="e.g. 900"
                placeholderTextColor={COLORS.gray400}
                value={income}
                onChangeText={setIncome}
                keyboardType="decimal-pad"
              />
              <Text style={styles.budgetHint}>Include student loan, part time work and any other income</Text>
            </View>

            <Text style={styles.sectionTitle}>Monthly expenses</Text>
            {BUDGET_CATEGORIES.map(cat => (
              <View key={cat.name} style={styles.expenseRow}>
                <Text style={styles.expenseEmoji}>{cat.emoji}</Text>
                <Text style={styles.expenseName}>{cat.name}</Text>
                <View style={styles.expenseInputWrapper}>
                  <Text style={styles.expensePound}>£</Text>
                  <TextInput
                    style={styles.expenseInput}
                    placeholder={cat.suggested.toString()}
                    placeholderTextColor={COLORS.gray400}
                    value={expenses[cat.name] || ""}
                    onChangeText={val => setExpenses(prev => ({ ...prev, [cat.name]: val }))}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            ))}

            {income !== "" && (
              <View style={[styles.summaryCard, { backgroundColor: remaining >= 0 ? COLORS.primaryBg : "#FEF2F2" }]}>
                <Text style={styles.summaryTitle}>Monthly summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Income</Text>
                  <Text style={styles.summaryValue}>£{parseFloat(income).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total expenses</Text>
                  <Text style={styles.summaryValue}>£{totalExpenses.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>Remaining</Text>
                  <Text style={[styles.summaryTotalValue, { color: remaining >= 0 ? COLORS.primary : COLORS.danger }]}>
                    £{remaining.toFixed(2)}
                  </Text>
                </View>
                {remaining < 0 && (
                  <Text style={styles.overspendWarning}>⚠️ You're spending more than you earn. Consider reaching out to your university's financial support team.</Text>
                )}
                {remaining >= 0 && remaining < 50 && (
                  <Text style={styles.tightWarning}>Your budget is very tight. Try to build up a small emergency buffer if possible.</Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { padding: 20, backgroundColor: COLORS.white },
  title: { fontSize: FONTS.size.xxl, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: FONTS.size.sm, color: COLORS.textMuted, marginTop: 4 },
  tabRow: { flexDirection: "row", backgroundColor: COLORS.white, paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: COLORS.gray100 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },
  scroll: { flex: 1 },
  section: { padding: 16 },
  categoryCard: { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 8, overflow: "hidden" },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  categoryLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  categoryEmoji: { fontSize: 24 },
  categoryTitle: { fontSize: FONTS.size.md, fontWeight: "600", color: COLORS.text },
  chevron: { fontSize: 12, color: COLORS.textMuted },
  tipsList: { paddingHorizontal: 16, paddingBottom: 16 },
  tipItem: { flexDirection: "row", gap: 8, marginBottom: 8 },
  tipBullet: { fontSize: FONTS.size.md, color: COLORS.primary, marginTop: 1 },
  tipText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20, flex: 1 },
  helpCard: { backgroundColor: COLORS.primaryBg, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  helpTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
  helpText: { fontSize: FONTS.size.sm, color: COLORS.text, lineHeight: 20, marginBottom: 12 },
  helpLinks: { gap: 8 },
  helpLink: { backgroundColor: COLORS.white, borderRadius: 8, padding: 10 },
  helpLinkText: { fontSize: FONTS.size.sm, color: COLORS.text },
  budgetCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  budgetLabel: { fontSize: FONTS.size.sm, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  budgetInput: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 12, padding: 14, fontSize: FONTS.size.md, color: COLORS.text, backgroundColor: COLORS.gray50 },
  budgetHint: { fontSize: FONTS.size.xs, color: COLORS.textMuted, marginTop: 6 },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  expenseRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 8, gap: 10 },
  expenseEmoji: { fontSize: 20 },
  expenseName: { flex: 1, fontSize: FONTS.size.md, color: COLORS.text },
  expenseInputWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 8, paddingHorizontal: 8, backgroundColor: COLORS.gray50 },
  expensePound: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  expenseInput: { width: 70, padding: 8, fontSize: FONTS.size.md, color: COLORS.text },
  summaryCard: { borderRadius: 16, padding: 16, marginTop: 8 },
  summaryTitle: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: FONTS.size.md, color: COLORS.textMuted },
  summaryValue: { fontSize: FONTS.size.md, color: COLORS.text, fontWeight: "600" },
  summaryTotal: { borderTopWidth: 1, borderTopColor: COLORS.gray200, paddingTop: 8, marginTop: 4 },
  summaryTotalLabel: { fontSize: FONTS.size.md, fontWeight: "700", color: COLORS.text },
  summaryTotalValue: { fontSize: FONTS.size.xl, fontWeight: "700" },
  overspendWarning: { fontSize: FONTS.size.sm, color: COLORS.danger, marginTop: 8, lineHeight: 20 },
  tightWarning: { fontSize: FONTS.size.sm, color: COLORS.warning, marginTop: 8, lineHeight: 20 },
});