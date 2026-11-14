// AI-assisted: see docs/AI_LOG.md #22
import { useEffect, useState } from "react";
import { pointAlong } from "../utils/routeProgress";

const STEP_MS = 250;
const DURATION_MS = 20000; // the whole leg takes about 20 seconds
const STEPS = DURATION_MS / STEP_MS;

// Demo only: moves a fake position along the route so the car can be seen
// moving without driving. It advances by distance, not by route point, so it
// is smooth even on a straight line. Returns null while it is off.
export function useSimulatedDrive(coordinates, enabled) {
  const [step, setStep] = useState(0);

  // Start again from the beginning when the route changes
  useEffect(() => {
    setStep(0);
  }, [coordinates]);

  useEffect(() => {
    if (!enabled || !coordinates?.length) return;
    const timer = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS));
    }, STEP_MS);
    return () => clearInterval(timer); // cleanup
  }, [enabled, coordinates]);

  if (!enabled || !coordinates?.length) return null;
  return pointAlong(coordinates, step / STEPS);
}
