// AI-assisted: see docs/AI_LOG.md #5
import { validatePersonal } from "./validators.js";

const today = new Date(2026, 10, 1);
const valid = {
  photoUri: "file://foto.jpg",
  fullName: "Manuela Pérez",
  idNumber: "1234567890",
  phone: "3001234567",
  birthDate: new Date(2000, 0, 15),
  gender: "female",
  email: "manuela@correo.com",
  language: "es",
  password: "secreto1",
  confirmPassword: "secreto1",
};

console.log("Válido (esperado {}):", validatePersonal(valid, today));
console.log("Vacío:", validatePersonal({}, today));
console.log(
  "Menor de edad:",
  validatePersonal({ ...valid, birthDate: new Date(2010, 5, 1) }, today)
    .birthDate,
);
console.log(
  "Nombre con números:",
  validatePersonal({ ...valid, fullName: "Ana 123" }, today).fullName,
);
console.log(
  "Celular corto:",
  validatePersonal({ ...valid, phone: "300123" }, today).phone,
);
console.log(
  "Cumple 18 mañana:",
  validatePersonal({ ...valid, birthDate: new Date(2008, 10, 2) }, today)
    .birthDate,
);
console.log(
  "Cumple 18 hoy (esperado undefined):",
  validatePersonal({ ...valid, birthDate: new Date(2008, 10, 1) }, today)
    .birthDate,
);
