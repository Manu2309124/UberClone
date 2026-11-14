// AI-assisted: see docs/AI_LOG.md #22
import { pointAlong } from "./routeProgress.js";

const line = [
  { latitude: 0, longitude: 0 },
  { latitude: 10, longitude: 0 },
];
const fmt = (p) => `${p.latitude.toFixed(2)},${p.longitude.toFixed(2)}`;

console.log("Inicio (esperado 0.00,0.00):", fmt(pointAlong(line, 0)));
console.log("Mitad de una recta (esperado 5.00,0.00):", fmt(pointAlong(line, 0.5)));
console.log("Final (esperado 10.00,0.00):", fmt(pointAlong(line, 1)));

const corner = [
  { latitude: 0, longitude: 0 },
  { latitude: 10, longitude: 0 },
  { latitude: 10, longitude: 10 },
];
console.log(
  "75 % de una ruta con esquina (esperado 10.00,5.00):",
  fmt(pointAlong(corner, 0.75)),
);
console.log("Sin puntos (esperado null):", pointAlong([], 0.5));
