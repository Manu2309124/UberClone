// AI-assisted: see docs/AI_LOG.md #23
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

// Listens to one trip in real time (for example, to see the payment arrive).
// Returns undefined while loading and null if the trip does not exist.
export function useTrip(tripId) {
  const [trip, setTrip] = useState(undefined);

  useEffect(() => {
    setTrip(undefined);
    if (!tripId) {
      setTrip(null);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "trips", tripId),
      (snap) => setTrip(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (e) => console.log(e.code, e.message),
    );
    return unsubscribe; // cleanup
  }, [tripId]);

  return trip;
}
