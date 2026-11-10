// AI-assisted: see docs/AI_LOG.md #18
import { filterTrips } from "./historyFilters.js";

const now = new Date(2026, 10, 9, 15, 0); // Monday
const trips = [
  { id: "a", date: new Date(2026, 10, 9, 9, 0), paymentMethod: "cash" },
  { id: "b", date: new Date(2026, 10, 8, 9, 0), paymentMethod: "cash" },
  { id: "c", date: new Date(2026, 10, 2, 9, 0), paymentMethod: "mercadopago" },
];
const ids = (r) => r.map((t) => t.id).join(",");

console.log(
  "Hoy (esperado a):",
  ids(filterTrips(trips, { period: "today", method: "all" }, now)),
);
console.log(
  "Semana (esperado a):",
  ids(filterTrips(trips, { period: "week", method: "all" }, now)),
);
console.log(
  "Mes (esperado a,b,c):",
  ids(filterTrips(trips, { period: "month", method: "all" }, now)),
);
console.log(
  "Efectivo (esperado a,b):",
  ids(filterTrips(trips, { period: "all", method: "cash" }, now)),
);
console.log(
  "Rango 1-3 nov (esperado c):",
  ids(
    filterTrips(
      trips,
      {
        period: "range",
        method: "all",
        from: new Date(2026, 10, 1),
        to: new Date(2026, 10, 3),
      },
      now,
    ),
  ),
);
