// AI-assisted: see docs/AI_LOG.md #23
import { paymentStatusLabel } from "./paymentStatus.js";

const mp = { paymentMethod: "mercadopago", status: "completed" };
console.log("MP sin respuesta (esperado Pendiente):", paymentStatusLabel(mp));
console.log(
  "MP aprobado (esperado Aprobado):",
  paymentStatusLabel({ ...mp, status: "paid", paymentStatus: "approved" }),
);
console.log(
  "MP rechazado (esperado Rechazado):",
  paymentStatusLabel({ ...mp, paymentStatus: "rejected" }),
);
console.log(
  "Efectivo cobrado (esperado Efectivo):",
  paymentStatusLabel({ paymentMethod: "cash", status: "paid" }),
);
console.log(
  "Efectivo sin cobrar (esperado Pendiente (efectivo)):",
  paymentStatusLabel({ paymentMethod: "cash", status: "completed" }),
);
console.log(
  "Cancelado (esperado Sin cobro (viaje cancelado)):",
  paymentStatusLabel({ paymentMethod: "cash", status: "cancelled" }),
);
