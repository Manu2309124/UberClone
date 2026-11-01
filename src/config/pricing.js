// AI-assisted: see docs/AI_LOG.md #4
// Single source of truth for pricing. All values in whole Colombian pesos (COP).
export const PRICING = {
  baseFare: 3500,
  perKm: 1200,
  perMinute: 250,
  minimumFare: 6000,
  commissionRate: 0.2,
  roundingStep: 100,
  categoryMultiplier: {
    economy: 1.0,
    xl: 1.4,
    premium: 1.8,
  },
};
