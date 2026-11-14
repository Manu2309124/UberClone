// AI-assisted: see docs/AI_LOG.md #14
import { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { paymentMethodLabel } from "../utils/paymentStatus";

const TIMEOUT_SECONDS = 15;

export default function TripRequestCard({ trip, onAccept, onReject }) {
  const [seconds, setSeconds] = useState(TIMEOUT_SECONDS);
  const { t, money, language } = useLanguage();

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


  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t("request.title", { seconds: Math.max(seconds, 0) })}
      </Text>
      <Text>
        {t("common.origin")}: {trip.origin.address}
      </Text>
      <Text>
        {t("common.destination")}: {trip.destination.address}
      </Text>
      <Text>
        {t("common.distanceDuration", {
          km: trip.distanceKm,
          min: trip.durationMin,
        })}
      </Text>
      <Text>
        {t("request.categoryPayment", {
          category: t(`category.${trip.category}`),
          method: paymentMethodLabel(trip.paymentMethod, language),
        })}
      </Text>
      <Text>{t("request.estimatedFare", { amount: money(trip.fare) })}</Text>
      <Text style={styles.earn}>
        {t("request.yourEarnings", { amount: money(trip.driverEarnings) })}
      </Text>
      <View style={styles.row}>
        <Button
          title={t("request.reject")}
          color="#d32f2f"
          onPress={handleReject}
        />
        <Button title={t("request.accept")} onPress={handleAccept} />
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
