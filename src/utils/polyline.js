// AI-assisted: see docs/AI_LOG.md #22
// Decodes a Google encoded polyline into [{ latitude, longitude }].
// Pure function: easy to test in Node.
export function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  const nextValue = () => {
    let result = 0;
    let shift = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };

  while (index < encoded.length) {
    lat += nextValue();
    lng += nextValue();
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}
