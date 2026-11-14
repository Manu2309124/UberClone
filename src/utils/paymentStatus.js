// AI-assisted: see docs/AI_LOG.md #23, #31
import { translate } from "../i18n/strings.js";

// Translation key of the payment state the driver sees
// (Aprobado, Pendiente, Rechazado o Efectivo). Pure function: easy to test.
export function paymentStatusKey(trip) {
  if (trip.status === "cancelled") return "pay.cancelled";
  if (trip.status === "rejected") return "pay.requestRejected";
  if (trip.paymentMethod === "cash")
    return trip.status === "paid" ? "pay.cash" : "pay.cashPending";
  switch (trip.paymentStatus) {
    case "approved":
      return "pay.approved";
    case "rejected":
      return "pay.rejected";
    default:
      return "pay.pending";
  }
}

export function paymentStatusLabel(trip, language = "es") {
  return translate(language, paymentStatusKey(trip));
}

export function paymentMethodLabel(method, language = "es") {
  return method ? translate(language, `method.${method}`) : "-";
}
