// AI-assisted: see docs/AI_LOG.md #16, #20, #23, #30
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { markPaidCash } from "../services/trips";
import { openPaymentLink } from "../services/payments";
import { useTrip } from "../hooks/useTrip";
import { useActiveTripContext } from "../context/ActiveTripContext";
import { paymentStatusLabel } from "../utils/paymentStatus";

const money = (n) => `$${n.toLocaleString("es-CO")}`;

const STATUS_COLOR = {
  Aprobado: "#2e7d32",
  Efectivo: "#2e7d32",
  Rechazado: "#c62828",
};

// Listens to the trip in real time, so the payment result appears here
// as soon as the backend (or the driver, for cash) records it.
// "Cobro y resumen" screen of the trip Stack.
export default function TripSummaryScreen() {
  const { summaryTripId, closeSummary: onClose } = useActiveTripContext();
  // Keep the last id while the Stack animates back to Inicio
  const lastId = useRef(summaryTripId);
  if (summaryTripId) lastId.current = summaryTripId;
  const trip = useTrip(lastId.current);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState(null);

  // A saved summary whose trip no longer exists: close it
  useEffect(() => {
    if (trip === null) onClose();
  }, [trip, onClose]);

  if (!trip) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const isCash = trip.paymentMethod === "cash";
  const paid = trip.status === "paid";
  const rejected = trip.paymentStatus === "rejected";
  const label = paymentStatusLabel(trip);

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
      <Text style={styles.title}>
        {paid ? "Cobro confirmado" : "Viaje finalizado"}
      </Text>
      <Text>Tarifa final: {money(trip.fare)}</Text>
      <Text>
        Comisión ({Math.round(trip.commissionRate * 100)} %):{" "}
        {money(trip.commission)}
      </Text>
      {trip.tip > 0 ? <Text>Propina: {money(trip.tip)}</Text> : null}
      <Text style={styles.earn}>
        Ganancia neta: {money(trip.driverEarnings)}
      </Text>
      <Text>Método de pago: {isCash ? "Efectivo" : "Mercado Pago"}</Text>
      <Text style={[styles.status, { color: STATUS_COLOR[label] ?? "#333" }]}>
        Estado del pago: {label}
      </Text>

      {paid ? (
        <Button title="Continuar" onPress={onClose} />
      ) : isCash ? (
        <Button
          title="Cobro recibido (efectivo)"
          onPress={() => markPaidCash(trip.id)}
        />
      ) : (
        <>
          {rejected ? (
            <Text style={styles.error}>
              El pago fue rechazado. Pide al pasajero que intente con otro
              medio de pago.
            </Text>
          ) : null}
          <Button
            title={
              opening
                ? "Abriendo..."
                : rejected
                  ? "Abrir un nuevo link de pago"
                  : "Abrir link de pago"
            }
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
  status: { fontSize: 16, fontWeight: "600" },
  hint: { color: "#666", marginTop: 12 },
  error: { color: "#c62828" },
});
