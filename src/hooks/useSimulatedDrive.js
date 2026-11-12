// AI-assisted: see docs/AI_LOG.md #22
import { useEffect, useState } from "react";

const STEP_MS = 400;

// Demo only: moves a fake position along the route points so the car can be
// seen moving without driving. Returns null while it is off.
export function useSimulatedDrive(coordinates, enabled) {
  const [index, setIndex] = useState(0);

  // Start again from the first point when the route changes
  useEffect(() => {
    setIndex(0);
  }, [coordinates]);

  useEffect(() => {
    if (!enabled || !coordinates?.length) return;
    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, coordinates.length - 1));
    }, STEP_MS);
    return () => clearInterval(timer); // cleanup
  }, [enabled, coordinates]);

  if (!enabled || !coordinates?.length) return null;
  return coordinates[index];
}
