// AI-assisted: see docs/AI_LOG.md #22
// Point at a fraction (0 to 1) of the way along a route, measured by
// distance, so the simulated car moves smoothly even when the route only has
// two points (straight line). Pure function: easy to test in Node.
export function pointAlong(coordinates, fraction) {
  if (!coordinates?.length) return null;
  if (coordinates.length === 1 || fraction <= 0) return coordinates[0];
  if (fraction >= 1) return coordinates[coordinates.length - 1];

  const segment = (a, b) =>
    Math.hypot(b.latitude - a.latitude, b.longitude - a.longitude);
  let total = 0;
  for (let i = 1; i < coordinates.length; i++)
    total += segment(coordinates[i - 1], coordinates[i]);
  if (total === 0) return coordinates[0];

  let remaining = total * fraction;
  for (let i = 1; i < coordinates.length; i++) {
    const a = coordinates[i - 1];
    const b = coordinates[i];
    const length = segment(a, b);
    if (remaining <= length) {
      const t = length === 0 ? 0 : remaining / length;
      return {
        latitude: a.latitude + (b.latitude - a.latitude) * t,
        longitude: a.longitude + (b.longitude - a.longitude) * t,
      };
    }
    remaining -= length;
  }
  return coordinates[coordinates.length - 1];
}
