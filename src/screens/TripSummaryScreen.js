// AI-assisted: see docs/AI_LOG.md #15
import { View, Text, StyleSheet } from "react-native";

export default function TripSummaryScreen({ trip }) {
  const money = (n) => `$${n.toLocaleString("es-CO")}`;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viaje finalizado</Text>
      <Text>Tarifa: {money(trip.fare)}</Text>
      <Text>
        Comisión ({trip.commissionRate * 100} %): {money(trip.commission)}
      </Text>
      <Text style={styles.earn}>
        Ganancia neta: {money(trip.driverEarnings)}
      </Text>
      <Text>Pago: {trip.paymentMethod}</Text>
      <Text style={styles.hint}>
        El cobro se completa en el siguiente bloque.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 8 },
  title: { fontSize: 24, fontWeight: "bold" },
  earn: { fontSize: 18, fontWeight: "600", color: "#2e7d32" },
  hint: { color: "#666", marginTop: 12 },
});
