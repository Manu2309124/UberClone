// AI-assisted: see docs/AI_LOG.md #18
import { startOfDay, startOfWeek, startOfMonth } from "./earnings.js";

// period: "all" | "today" | "week" | "month" | "range"
// method: "all" | "cash" | "mercadopago" | "stripe"
export function filterTrips(
  trips,
  { period, method, from, to },
  now = new Date(),
) {
  return trips.filter((t) => {
    if (method !== "all" && t.paymentMethod !== method) return false;

    const d = t.date;
    if (period === "today" && d < startOfDay(now)) return false;
    if (period === "week" && d < startOfWeek(now)) return false;
    if (period === "month" && d < startOfMonth(now)) return false;
    if (period === "range") {
      if (from && d < startOfDay(from)) return false;
      if (
        to &&
        d >= new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)
      )
        return false;
    }
    return true;
  });
}
