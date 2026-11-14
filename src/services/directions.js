// AI-assisted: see docs/AI_LOG.md #22, #32
import { decodePolyline } from "../utils/polyline";

// Google Routes API (computeRoutes) replaces the legacy Directions API,
// which Google no longer enables for new projects.
const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

const toLatLng = (p) => ({
  location: { latLng: { latitude: p.latitude, longitude: p.longitude } },
});

// Returns the driving route between two points as map coordinates.
// Called once per trip leg, never on every location update, to save quota.
export async function fetchRoute(from, to) {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("Falta EXPO_PUBLIC_GOOGLE_MAPS_API_KEY");

  const res = await fetch(ROUTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({
      origin: toLatLng(from),
      destination: toLatLng(to),
      travelMode: "DRIVE",
      languageCode: "es",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "No se pudo trazar la ruta");

  const route = data.routes?.[0];
  if (!route) throw new Error("Google no encontró una ruta");
  return {
    coordinates: decodePolyline(route.polyline.encodedPolyline),
    polyline: route.polyline.encodedPolyline, // saved in the trip for the history
    distanceMeters: route.distanceMeters,
    duration: route.duration, // e.g. "1320s"
  };
}
