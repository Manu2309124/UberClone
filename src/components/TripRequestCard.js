// AI-assisted: see docs/AI_LOG.md #14
import { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const TIMEOUT_SECONDS = 15;

export default function TripRequestCard({ trip, onAccept, onReject }) {
  const [seconds, setSeconds] = useState(TIMEOUT_SECONDS);

  useEffect(() => {
    setSeconds(TIMEOUT_SECONDS);
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer); // cleanup
  }, [trip.id]);

  const handleAccept = useCallback(() => onAccept(trip), [onAccept, trip]);
  const handleReject = useCallback(() => onReject(trip), [onReject, trip]);

  // Auto-reject when the time runs out
  useEffect(() => {
    if (seconds <= 0) handleReject();
  }, [seconds, handleReject]);

  const money = (n) => `$${n.toLocaleString("es-CO")}`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Nueva solicitud · {Math.max(seconds, 0)} s
      </Text>
      <Text>Origen: {trip.origin.address}</Text>
      <Text>Destino: {trip.destination.address}</Text>
      <Text>
        Distancia: {trip.distanceKm} km · {trip.durationMin} min
      </Text>
      <Text>
        Categoría: {trip.category} · Pago: {trip.paymentMethod}
      </Text>
      <Text>Tarifa estimada: {money(trip.fare)}</Text>
      <Text style={styles.earn}>
        Tu ganancia neta: {money(trip.driverEarnings)}
      </Text>
      <View style={styles.row}>
        <Button title="Rechazar" color="#d32f2f" onPress={handleReject} />
        <Button title="Aceptar" onPress={handleAccept} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 4,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  earn: { fontWeight: "600", color: "#2e7d32" },
  row: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
});
