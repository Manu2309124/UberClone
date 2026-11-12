// AI-assisted: see docs/AI_LOG.md #24, #30
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { useActiveTrip } from "../hooks/useActiveTrip";

const ActiveTripContext = createContext(null);

// Shares the trip the driver is working on with every screen, and keeps the
// payment summary open after the trip is paid until the driver closes it.
// The open summary is saved in AsyncStorage (only a trip id, nothing
// sensitive) so it survives a reload or iOS closing the app while the
// passenger pays in the browser.
export function ActiveTripProvider({ children }) {
  const { user } = useAuth();
  const activeTrip = useActiveTrip(user?.uid);
  const [summaryTripId, setSummaryTripId] = useState(null);
  // Last known driver location, reported by Inicio (which tracks the GPS)
  // so the trip screens of the Stack can draw the car
  const [driverLocation, setDriverLocation] = useState(null);
  const storageKey = user ? `openSummary:${user.uid}` : null;

  // Restore a summary that was open before the app reloaded
  useEffect(() => {
    setSummaryTripId(null);
    if (!storageKey) return;
    let ignore = false;
    AsyncStorage.getItem(storageKey).then((id) => {
      if (!ignore && id) setSummaryTripId((current) => current ?? id);
    });
    return () => {
      ignore = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (activeTrip?.status !== "completed") return;
    setSummaryTripId(activeTrip.id);
    if (storageKey)
      AsyncStorage.setItem(storageKey, activeTrip.id).catch(() => {});
  }, [activeTrip?.id, activeTrip?.status, storageKey]);

  const closeSummary = useCallback(() => {
    setSummaryTripId(null);
    if (storageKey) AsyncStorage.removeItem(storageKey).catch(() => {});
  }, [storageKey]);

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
      driverLocation,
      reportLocation: setDriverLocation,
    };
  }, [activeTrip, summaryTripId, closeSummary, driverLocation]);

  return (
    <ActiveTripContext.Provider value={value}>
      {children}
    </ActiveTripContext.Provider>
  );
}

export const useActiveTripContext = () => useContext(ActiveTripContext);
