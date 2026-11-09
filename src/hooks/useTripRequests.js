// AI-assisted: see docs/AI_LOG.md #14
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

// Listens in real time for trips that are still waiting for a driver.
// `enabled` is true only while the driver is available.
export function useTripRequests(enabled) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!enabled) {
      setRequests([]);
      return;
    }
    const q = query(
      collection(db, "trips"),
      where("status", "==", "requested"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (e) => console.log(e.code, e.message),
    );
    return unsubscribe; // cleanup
  }, [enabled]);

  return requests;
}
