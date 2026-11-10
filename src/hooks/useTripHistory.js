// AI-assisted: see docs/AI_LOG.md #18
import { useEffect, useMemo, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { filterTrips } from "../utils/historyFilters";

const PAGE_SIZE = 20;
const HISTORY = ["paid", "completed", "cancelled", "rejected"];

export function useTripHistory(uid, filters) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "trips"),
      where("driverId", "==", uid),
      where("status", "in", HISTORY),
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setTrips(
          snap.docs.map((d) => {
            const data = d.data();
            const date =
              data.paidAt?.toDate?.() ??
              data.completedAt?.toDate?.() ??
              data.createdAt?.toDate?.() ??
              new Date();
            return { id: d.id, ...data, date };
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

  // Reset pagination when filters change
  useEffect(
    () => setLimit(PAGE_SIZE),
    [filters.period, filters.method, filters.from, filters.to],
  );

  const filtered = useMemo(
    () => filterTrips(trips, filters).sort((a, b) => b.date - a.date),
    [trips, filters],
  );

  return {
    trips: filtered.slice(0, limit),
    total: filtered.length,
    hasMore: filtered.length > limit,
    loadMore: () => setLimit((l) => l + PAGE_SIZE),
    loading,
  };
}
