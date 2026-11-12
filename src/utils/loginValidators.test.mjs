// AI-assisted: see docs/AI_LOG.md #21, #31
import { validateLogin, loginErrorKey } from "./loginValidators.js";
import { translate } from "../i18n/strings.js";

const es = (key) => translate("es", key);
const errorsEs = (errors) =>
  Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, es(v)]));

console.log(
  "Válido (esperado {}):",
  validateLogin({ email: " manuela@correo.com ", password: "secreto1" }),
);
console.log(
  "Vacío (esperado correo y contraseña):",
  errorsEs(validateLogin({})),
);
console.log(
  "Correo sin dominio (esperado Correo no válido):",
  es(validateLogin({ email: "manuela@", password: "x" }).email),
);
console.log(
  "Credenciales malas (esperado Correo o contraseña incorrectos):",
  es(loginErrorKey("auth/invalid-credential")),
);
console.log(
  "Código desconocido (esperado mensaje genérico):",
  es(loginErrorKey("auth/algo-nuevo")),
);
console.log(
  "En inglés (esperado Wrong email or password):",
  translate("en", loginErrorKey("auth/invalid-credential")),
);
