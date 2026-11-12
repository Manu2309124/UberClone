// AI-assisted: see docs/AI_LOG.md #16, #20
import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { markPaidCash } from "../services/trips";
import { openPaymentLink } from "../services/payments";

const money = (n) => `$${n.toLocaleString("es-CO")}`;

export default function TripSummaryScreen({ trip }) {
  const isCash = trip.paymentMethod === "cash";
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState(null);

  const payOnline = async () => {
    setOpening(true);
    setError(null);
    try {
      await openPaymentLink(trip.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setOpening(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viaje finalizado</Text>
      <Text>Tarifa final: {money(trip.fare)}</Text>
      <Text>
        Comisión ({Math.round(trip.commissionRate * 100)} %):{" "}
        {money(trip.commission)}
      </Text>
      {trip.tip > 0 ? <Text>Propina: {money(trip.tip)}</Text> : null}
      <Text style={styles.earn}>
        Ganancia neta: {money(trip.driverEarnings)}
      </Text>
      <Text>
        Método de pago: {isCash ? "Efectivo" : "Mercado Pago"}
      </Text>
      <Text>Estado del pago: {trip.paymentStatus ?? "Pendiente"}</Text>

      {isCash ? (
        <Button
          title="Cobro recibido (efectivo)"
          onPress={() => markPaidCash(trip.id)}
        />
      ) : (
        <>
          <Button
            title={opening ? "Abriendo..." : "Abrir link de pago"}
            disabled={opening}
            onPress={payOnline}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text style={styles.hint}>
            Esperando la confirmación de la pasarela de pago...
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 8 },
  title: { fontSize: 24, fontWeight: "bold" },
  earn: { fontSize: 18, fontWeight: "600", color: "#2e7d32" },
  hint: { color: "#666", marginTop: 12 },
  error: { color: "#c62828" },
});
