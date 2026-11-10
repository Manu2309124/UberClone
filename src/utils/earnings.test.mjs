// AI-assisted: see docs/AI_LOG.md #17
import { summarizeTrips, startOfDay } from "./earnings.js";

const now = new Date(2026, 10, 9, 15, 0);
const trips = [
  {
    paidDate: new Date(2026, 10, 9, 9, 0),
    fare: 19200,
    commission: 3840,
    tip: 0,
    driverEarnings: 15360,
  },
  {
    paidDate: new Date(2026, 10, 9, 11, 0),
    fare: 26900,
    commission: 5380,
    tip: 1000,
    driverEarnings: 22520,
  },
  {
    paidDate: new Date(2026, 10, 2, 11, 0),
    fare: 19200,
    commission: 3840,
    tip: 0,
    driverEarnings: 15360,
  },
];

// Expected today: 2 trips, billed 46100, net 37880, average 18940
console.log("Hoy:", summarizeTrips(trips, startOfDay(now)));
