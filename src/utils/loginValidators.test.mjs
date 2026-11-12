// AI-assisted: see docs/AI_LOG.md #21
import { validateLogin, loginErrorMessage } from "./loginValidators.js";

console.log(
  "Válido (esperado {}):",
  validateLogin({ email: " manuela@correo.com ", password: "secreto1" }),
);
console.log("Vacío (esperado correo y contraseña):", validateLogin({}));
console.log(
  "Correo sin dominio (esperado Correo no válido):",
  validateLogin({ email: "manuela@", password: "x" }).email,
);
console.log(
  "Credenciales malas (esperado Correo o contraseña incorrectos):",
  loginErrorMessage("auth/invalid-credential"),
);
console.log(
  "Código desconocido (esperado mensaje genérico):",
  loginErrorMessage("auth/algo-nuevo"),
);
