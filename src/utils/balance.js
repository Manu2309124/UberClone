// AI-assisted: see docs/AI_LOG.md #16
// Pure function: easy to test in Node.
export function calculateBalance(trips) {
  return trips
    .filter((t) => t.status === "paid")
    .reduce((total, t) => {
      if (t.paymentMethod === "cash") return total - t.commission;
      return total + t.driverEarnings;
    }, 0);
}
