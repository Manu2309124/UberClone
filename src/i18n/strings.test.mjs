// AI-assisted: see docs/AI_LOG.md #31
import { STRINGS, translate } from "./strings.js";

console.log("Español (esperado Hola, Ana):", translate("es", "home.hello", { name: "Ana" }));
console.log("Inglés (esperado Hi, Ana):", translate("en", "home.hello", { name: "Ana" }));
console.log("Clave inexistente (esperado la clave):", translate("en", "no.existe"));

const es = Object.keys(STRINGS.es);
const en = Object.keys(STRINGS.en);
console.log(
  "Faltan en inglés (esperado []):",
  es.filter((k) => !en.includes(k)),
);
console.log(
  "Sobran en inglés (esperado []):",
  en.filter((k) => !es.includes(k)),
);
