// AI-assisted: see docs/AI_LOG.md #17
export const startOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Week starts on Monday
export function startOfWeek(d) {
  const day = (d.getDay() + 6) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
}

export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

// Totals for the trips paid on or after `from`.
export function summarizeTrips(trips, from) {
  const list = trips.filter((t) => t.paidDate >= from);
  const count = list.length;
  const billed = list.reduce((s, t) => s + t.fare, 0);
  const commissions = list.reduce((s, t) => s + t.commission, 0);
  const tips = list.reduce((s, t) => s + (t.tip || 0), 0);
  const net = list.reduce((s, t) => s + t.driverEarnings, 0);
  return {
    count,
    billed,
    commissions,
    tips,
    net,
    average: count ? Math.round(net / count) : 0,
  };
}
