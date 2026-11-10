// AI-assisted: see docs/AI_LOG.md #17
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useEarnings } from "../hooks/useEarnings";
import { useAuth } from "../context/AuthContext";

const money = (n) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("es-CO")}`;

function Block({ title, data }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text>Viajes: {data.count}</Text>
      <Text>Total facturado: {money(data.billed)}</Text>
      <Text>Comisiones: {money(data.commissions)}</Text>
      <Text>Propinas: {money(data.tips)}</Text>
      <Text style={styles.net}>Ganancia neta: {money(data.net)}</Text>
      <Text>Promedio por viaje: {money(data.average)}</Text>
    </View>
  );
}

export default function EarningsScreen() {
  const { user } = useAuth();
  const { totals, balance, loading } = useEarnings(user?.uid);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.balanceBox}>
        <Text>Saldo del conductor</Text>
        <Text style={[styles.balance, balance < 0 && styles.negative]}>
          {money(balance)}
        </Text>
      </View>
      <Block title="Hoy" data={totals.today} />
      <Block title="Esta semana" data={totals.week} />
      <Block title="Este mes" data={totals.month} />
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
