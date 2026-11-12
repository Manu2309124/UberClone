// AI-assisted: see docs/AI_LOG.md #24
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useActiveTrip } from "../hooks/useActiveTrip";

const ActiveTripContext = createContext(null);

// Shares the trip the driver is working on with every screen, and keeps the
// payment summary open after the trip is paid until the driver closes it.
export function ActiveTripProvider({ children }) {
  const { user } = useAuth();
  const activeTrip = useActiveTrip(user?.uid);
  const [summaryTripId, setSummaryTripId] = useState(null);

  useEffect(() => {
    if (activeTrip?.status === "completed") setSummaryTripId(activeTrip.id);
  }, [activeTrip?.id, activeTrip?.status]);

  // Forget the summary when the session ends
  useEffect(() => {
    if (!user) setSummaryTripId(null);
  }, [user]);

  const closeSummary = useCallback(() => setSummaryTripId(null), []);

  const value = useMemo(() => {
    const summaryId =
      summaryTripId ??
      (activeTrip?.status === "completed" ? activeTrip.id : null);
    return {
      activeTrip,
      // true while driving to the pickup or to the destination
      driving: Boolean(activeTrip) && activeTrip.status !== "completed",
      summaryTripId: summaryId,
      closeSummary,
    };
  }, [activeTrip, summaryTripId, closeSummary]);

  return (
    <ActiveTripContext.Provider value={value}>
      {children}
    </ActiveTripContext.Provider>
  );
}

export const useActiveTripContext = () => useContext(ActiveTripContext);
