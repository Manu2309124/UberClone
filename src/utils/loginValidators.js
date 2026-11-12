// AI-assisted: see docs/AI_LOG.md #21
import { EMAIL_REGEX } from "./validators.js";

// Pure function: easy to test in Node.
export function validateLogin({ email = "", password = "" }) {
  const errors = {};
  const cleanEmail = email.trim();
  if (!cleanEmail) errors.email = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(cleanEmail)) errors.email = "Correo no válido";
  if (!password) errors.password = "La contraseña es obligatoria";
  return errors;
}

// Turns Firebase Auth error codes into messages for the driver.
// Firebase answers "invalid-credential" for a wrong email or password on
// purpose, so the app does not reveal which accounts exist.
export function loginErrorMessage(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos";
    case "auth/invalid-email":
      return "Correo no válido";
    case "auth/user-disabled":
      return "Esta cuenta está deshabilitada";
    case "auth/too-many-requests":
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo";
    case "auth/network-request-failed":
      return "Sin conexión a internet";
    default:
      return "No se pudo iniciar sesión. Intenta de nuevo";
  }
}
