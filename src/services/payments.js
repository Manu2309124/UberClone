// AI-assisted: see docs/AI_LOG.md #20
import { Linking } from "react-native";

// The secret Mercado Pago token lives only in the backend (backend/server.js).
// The app only sends the trip id; the backend reads the amount from Firestore.
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Asks the backend for a Mercado Pago checkout link for a completed trip.
export async function createPaymentLink(tripId) {
  if (!BACKEND_URL) throw new Error("Falta EXPO_PUBLIC_BACKEND_URL en el .env");

  const res = await fetch(`${BACKEND_URL}/create-preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tripId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudo crear el pago");
  return data.url;
}

// Opens the checkout. The trip changes to "paid" when the webhook confirms it.
export async function openPaymentLink(tripId) {
  const url = await createPaymentLink(tripId);
  await Linking.openURL(url);
}
