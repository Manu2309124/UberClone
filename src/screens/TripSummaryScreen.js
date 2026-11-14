// AI-assisted: see docs/AI_LOG.md #16, #20, #23, #30, #31
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
import { paymentStatusKey } from "../utils/paymentStatus";
import { useLanguage } from "../context/LanguageContext";

const STATUS_COLOR = {
  "pay.approved": "#2e7d32",
  "pay.cash": "#2e7d32",
  "pay.rejected": "#c62828",
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
  const { t, money } = useLanguage();
  const [error, setError] = useState(null);

  // A saved summary whose trip no longer exists: close it
  useEffect(() => {
    if (trip === null) onClose();
  }, [trip, onClose]);

  if (!trip) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const isCash = trip.paymentMethod === "cash";
  const paid = trip.status === "paid";
  const rejected = trip.paymentStatus === "rejected";
  const statusKey = paymentStatusKey(trip);

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
        {paid ? t("summary.confirmed") : t("summary.finished")}
      </Text>
      <Text>{t("summary.finalFare", { amount: money(trip.fare) })}</Text>
      <Text>
        {t("common.commission", {
          rate: Math.round(trip.commissionRate * 100),
        })}
        : {money(trip.commission)}
      </Text>
      {trip.tip > 0 ? (
        <Text>
          {t("common.tip")}: {money(trip.tip)}
        </Text>
      ) : null}
      <Text style={styles.earn}>
        {t("common.netEarnings")}: {money(trip.driverEarnings)}
      </Text>
      <Text>
        {t("summary.method", {
          method: t(isCash ? "method.cash" : "method.mercadopago"),
        })}
      </Text>
      <Text
        style={[styles.status, { color: STATUS_COLOR[statusKey] ?? "#333" }]}
      >
        {t("summary.status", { status: t(statusKey) })}
      </Text>

      {paid ? (
        <Button title={t("summary.continue")} onPress={onClose} />
      ) : isCash ? (
        <Button
          title={t("summary.cashReceived")}
          onPress={() => markPaidCash(trip.id)}
        />
      ) : (
        <>
          {rejected ? (
            <Text style={styles.error}>
              {t("summary.rejectedHint")}
            </Text>
          ) : null}
          <Button
            title={
              opening
                ? t("summary.opening")
                : rejected
                  ? t("summary.openNewLink")
                  : t("summary.openLink")
            }
            disabled={opening}
            onPress={payOnline}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text style={styles.hint}>
            {t("summary.waiting")}
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
