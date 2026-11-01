// AI-assisted: see docs/AI_LOG.md #4
import { calculateFare } from "./calculateFare.js";

const eco = calculateFare({
  distanceKm: 8.5,
  durationMin: 22,
  category: "economy",
  tip: 0,
});
const xl = calculateFare({
  distanceKm: 8.5,
  durationMin: 22,
  category: "xl",
  tip: 0,
});

console.log("Economico:", eco); // expected: fare 19200, commission 3840, driverEarnings 15360
console.log("XL:", xl); // expected: fare 26900, commission 5380, driverEarnings 21520
