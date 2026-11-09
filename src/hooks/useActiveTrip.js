// AI-assisted: see docs/AI_LOG.md #15
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const ACTIVE = ["accepted", "driver_arriving", "in_progress", "completed"];

// Listens for the trip this driver is currently working on.
export function useActiveTrip(uid) {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (!uid) {
      setTrip(null);
      return;
    }
    const q = query(
      collection(db, "trips"),
      where("driverId", "==", uid),
      where("status", "in", ACTIVE),
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const d = snap.docs[0];
        setTrip(d ? { id: d.id, ...d.data() } : null);
      },
      (e) => console.log(e.code, e.message),
    );
    return unsubscribe; // cleanup
  }, [uid]);

  return trip;
}
