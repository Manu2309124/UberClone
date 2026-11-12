// AI-assisted: see docs/AI_LOG.md #16
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { calculateFare } from "../utils/calculateFare";
import { PRICING } from "../config/pricing";

// Creates a fake passenger request so the driver app can be tested.
export async function createFakeTrip(
  category = "economy",
  paymentMethod = "cash",
) {
  const distanceKm = 8.5;
  const durationMin = 22;
  const { fare, commission, driverEarnings } = calculateFare({
    distanceKm,
    durationMin,
    category,
    tip: 0,
  });

  return addDoc(collection(db, "trips"), {
    driverId: null,
    passengerId: "simulated-passenger",
    origin: {
      lat: 6.3031,
      lng: -75.5489,
      address: "Bello, Antioquia (origen)",
    },
    destination: {
      lat: 6.2442,
      lng: -75.5812,
      address: "Medellín, centro (destino)",
    },
    distanceKm,
    durationMin,
    category,
    paymentMethod,
    fare,
    commission,
    tip: 0,
    driverEarnings,
    commissionRate: PRICING.commissionRate, // saved so future changes don't alter history
    status: "requested",
    createdAt: serverTimestamp(),
  });
}

export function acceptTrip(tripId, driverId) {
  return updateDoc(doc(db, "trips", tripId), { status: "accepted", driverId });
}

export function rejectTrip(tripId) {
  return updateDoc(doc(db, "trips", tripId), { status: "rejected" });
}

// Moves the trip to the next state. Saves completedAt when it finishes.
export function updateTripStatus(tripId, status) {
  const extra =
    status === "completed" ? { completedAt: serverTimestamp() } : {};
  return updateDoc(doc(db, "trips", tripId), { status, ...extra });
}

// Cash payment: the driver confirms the money was received.
export function markPaidCash(tripId) {
  return updateDoc(doc(db, "trips", tripId), {
    status: "paid",
    paymentStatus: "cash",
    paidAt: serverTimestamp(),
  });
}
