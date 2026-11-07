// AI-assisted: see docs/AI_LOG.md #13
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// While `active` is true, watches the device location and saves it to
// drivers/{uid}. The cleanup stops tracking when the driver goes unavailable
// or leaves the screen.
export function useDriverLocation(uid, active) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!active || !uid) return;

    let subscription = null;
    let cancelled = false;
    let lastSaved = 0;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        return;
      }
      setError(null);

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(coords);

          // Save to Firestore at most once every 5 seconds
          const now = Date.now();
          if (now - lastSaved >= 5000) {
            lastSaved = now;
            updateDoc(doc(db, "drivers", uid), {
              location: { ...coords, updatedAt: serverTimestamp() },
            }).catch((e) => console.log(e.code));
          }
        },
      );

      if (cancelled) sub.remove();
      else subscription = sub;
    })();

    return () => {
      cancelled = true;
      if (subscription) subscription.remove();
    };
  }, [uid, active]);

  return { location, error };
}
