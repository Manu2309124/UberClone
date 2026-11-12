// AI-assisted: see docs/AI_LOG.md #17, #31
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useEarnings } from "../hooks/useEarnings";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Block({ title, data }) {
  const { t, money } = useLanguage();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text>{t("earnings.trips", { count: data.count })}</Text>
      <Text>{t("earnings.billed", { amount: money(data.billed) })}</Text>
      <Text>
        {t("earnings.commissions", { amount: money(data.commissions) })}
      </Text>
      <Text>{t("earnings.tips", { amount: money(data.tips) })}</Text>
      <Text style={styles.net}>
        {t("earnings.net", { amount: money(data.net) })}
      </Text>
      <Text>{t("earnings.average", { amount: money(data.average) })}</Text>
    </View>
  );
}

export default function EarningsScreen() {
  const { user } = useAuth();
  const { totals, balance, loading } = useEarnings(user?.uid);
  const { t, money } = useLanguage();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.balanceBox}>
        <Text>{t("earnings.balance")}</Text>
        <Text style={[styles.balance, balance < 0 && styles.negative]}>
          {money(balance)}
        </Text>
      </View>
      <Block title={t("earnings.today")} data={totals.today} />
      <Block title={t("earnings.week")} data={totals.week} />
      <Block title={t("earnings.month")} data={totals.month} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  balanceBox: {
    padding: 16,
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    alignItems: "center",
  },
  balance: { fontSize: 28, fontWeight: "bold", color: "#2e7d32" },
  negative: { color: "#d32f2f" },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    gap: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  net: { fontWeight: "600", color: "#2e7d32" },
});
