// AI-assisted: see docs/AI_LOG.md #22
import { decodePolyline } from "./polyline.js";

// Example from Google's polyline documentation
const points = decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
console.log(
  "Ejemplo de Google (esperado 38.5,-120.2 · 40.7,-120.95 · 43.252,-126.453):",
  points.map((p) => `${p.latitude},${p.longitude}`).join(" · "),
);
console.log("Vacío (esperado []):", decodePolyline(""));
