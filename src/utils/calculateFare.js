// AI-assisted: see docs/AI_LOG.md #4

import { PRICING } from "../config/pricing.js";

export function calculateFare({
  distanceKm,
  durationMin,
  category = "economy",
  tip = 0,
}) {
  const multiplier = PRICING.categoryMultiplier[category];
  if (multiplier === undefined) {
    throw new Error(`Invalid category: ${category}`);
  }

  const raw =
    (PRICING.baseFare +
      distanceKm * PRICING.perKm +
      durationMin * PRICING.perMinute) *
    multiplier;

  // Minimum fare applies first, then rounding to the nearest 100 COP
  const fare =
    Math.round(Math.max(PRICING.minimumFare, raw) / PRICING.roundingStep) *
    PRICING.roundingStep;

  const commission = Math.round(fare * PRICING.commissionRate);
  const safeTip = Math.max(0, Math.round(tip));
  const driverEarnings = fare - commission + safeTip;

  return { fare, commission, driverEarnings };
}
