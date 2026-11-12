// AI-assisted: see docs/AI_LOG.md #23
// The four payment states the driver sees. Pure function: easy to test in Node.
export function paymentStatusLabel(trip) {
  if (trip.status === "cancelled") return "Sin cobro (viaje cancelado)";
  if (trip.status === "rejected") return "Sin cobro (solicitud rechazada)";
  if (trip.paymentMethod === "cash")
    return trip.status === "paid" ? "Efectivo" : "Pendiente (efectivo)";
  switch (trip.paymentStatus) {
    case "approved":
      return "Aprobado";
    case "rejected":
      return "Rechazado";
    default:
      return "Pendiente";
  }
}

export const PAYMENT_METHOD_LABEL = {
  cash: "Efectivo",
  mercadopago: "Mercado Pago",
  stripe: "Stripe",
};
