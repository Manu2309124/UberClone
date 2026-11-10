// AI-assisted: see docs/AI_LOG.md #18
import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateField from "../components/DateField";
import { useTripHistory } from "../hooks/useTripHistory";
import { useAuth } from "../context/AuthContext";

const PERIODS = [
  ["all", "Todo"],
  ["today", "Hoy"],
  ["week", "Semana"],
  ["month", "Mes"],
  ["range", "Rango"],
];
const METHODS = [
  ["all", "Todos"],
  ["cash", "Efectivo"],
  ["mercadopago", "Mercado Pago"],
  ["stripe", "Stripe"],
];
const money = (n) => `$${n.toLocaleString("es-CO")}`;

function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={active ? styles.chipTextActive : undefined}>{label}</Text>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [period, setPeriod] = useState("all");
  const [method, setMethod] = useState("all");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const filters = useMemo(
    () => ({ period, method, from, to }),
    [period, method, from, to],
  );
  const { trips, total, hasMore, loadMore, loading } = useTripHistory(
    user?.uid,
    filters,
  );

  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        {PERIODS.map(([v, l]) => (
          <Chip
            key={v}
            label={l}
            active={period === v}
            onPress={() => setPeriod(v)}
          />
        ))}
      </View>
      <View style={styles.chips}>
        {METHODS.map(([v, l]) => (
          <Chip
            key={v}
            label={l}
            active={method === v}
            onPress={() => setMethod(v)}
          />
        ))}
      </View>

      {period === "range" ? (
        <View style={styles.range}>
          <DateField label="Desde" value={from} onChange={setFrom} />
          <DateField label="Hasta" value={to} onChange={setTo} />
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No tienes viajes en este filtro.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() =>
                navigation.navigate("DetalleViaje", { trip: serialize(item) })
              }
            >
              <Text style={styles.itemTitle}>
                {item.date.toLocaleString("es-CO")}
              </Text>
              <Text>
                {item.origin.address} → {item.destination.address}
              </Text>
              <Text>
                {item.category} · Tarifa {money(item.fare)} · Neta{" "}
                {money(item.driverEarnings)}
              </Text>
              <Text>
                Estado: {item.status} · Pago: {item.paymentMethod}
              </Text>
            </Pressable>
          )}
          ListFooterComponent={
            hasMore ? (
              <Pressable style={styles.more} onPress={loadMore}>
                <Text>Cargar más ({total - trips.length} restantes)</Text>
              </Pressable>
            ) : null
          }
        />
      )}
    </View>
  );
}

// Navigation params must be serializable: convert the Date to a string
const serialize = (t) => ({ ...t, date: t.date.toISOString() });

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  chipActive: { backgroundColor: "#1a73e8", borderColor: "#1a73e8" },
  chipTextActive: { color: "#fff" },
  range: { marginBottom: 8 },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 8,
    gap: 2,
  },
  itemTitle: { fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 40, color: "#666" },
  more: { padding: 12, alignItems: "center" },
});
