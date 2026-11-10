// AI-assisted: see docs/AI_LOG.md #17
import { useEffect, useMemo, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  summarizeTrips,
  startOfDay,
  startOfWeek,
  startOfMonth,
} from "../utils/earnings";
import { calculateBalance } from "../utils/balance";

// Listens to the driver's paid trips and computes totals with useMemo.
export function useEarnings(uid) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "trips"),
      where("driverId", "==", uid),
      where("status", "==", "paid"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setTrips(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              paidDate:
                data.paidAt?.toDate?.() ??
                data.completedAt?.toDate?.() ??
                new Date(),
            };
          }),
        );
        setLoading(false);
      },
      (e) => {
        console.log(e.code, e.message);
        setLoading(false);
      },
    );
    return unsubscribe; // cleanup
  }, [uid]);

  const totals = useMemo(() => {
    const now = new Date();
    return {
      today: summarizeTrips(trips, startOfDay(now)),
      week: summarizeTrips(trips, startOfWeek(now)),
      month: summarizeTrips(trips, startOfMonth(now)),
    };
  }, [trips]);

  const balance = useMemo(() => calculateBalance(trips), [trips]);

  return { totals, balance, loading };
}
