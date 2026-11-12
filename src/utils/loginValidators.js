// AI-assisted: see docs/AI_LOG.md #21, #31
import { EMAIL_REGEX } from "./validators.js";

// Pure functions: easy to test in Node. They return translation keys
// (see src/i18n/strings.js) so the screen shows them in the app language.
export function validateLogin({ email = "", password = "" }) {
  const errors = {};
  const cleanEmail = email.trim();
  if (!cleanEmail) errors.email = "login.err.emailRequired";
  else if (!EMAIL_REGEX.test(cleanEmail)) errors.email = "login.err.emailInvalid";
  if (!password) errors.password = "login.err.passwordRequired";
  return errors;
}

// Turns Firebase Auth error codes into messages for the driver.
// Firebase answers "invalid-credential" for a wrong email or password on
// purpose, so the app does not reveal which accounts exist.
export function loginErrorKey(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "login.err.credentials";
    case "auth/invalid-email":
      return "login.err.emailInvalid";
    case "auth/user-disabled":
      return "login.err.disabled";
    case "auth/too-many-requests":
      return "login.err.tooMany";
    case "auth/network-request-failed":
      return "login.err.network";
    default:
      return "login.err.generic";
  }
}
