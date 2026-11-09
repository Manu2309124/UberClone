// AI-assisted: see docs/AI_LOG.md #16
import { calculateBalance } from "./balance.js";

const trips = [
  {
    status: "paid",
    paymentMethod: "cash",
    commission: 3840,
    driverEarnings: 15360,
  },
  {
    status: "paid",
    paymentMethod: "mercadopago",
    commission: 5380,
    driverEarnings: 21520,
  },
  {
    status: "completed",
    paymentMethod: "cash",
    commission: 1000,
    driverEarnings: 4000,
  },
];

// Expected: 21520 - 3840 = 17680 (the unpaid trip is ignored)
console.log("Saldo:", calculateBalance(trips));
