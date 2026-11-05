// AI-assisted: see docs/AI_LOG.md #7
import { validateDocuments, requiresInspection } from "./documentValidators.js";

const today = new Date(2026, 10, 2);
const valid = {
  licenseNumber: "123456789",
  licensePhotoUri: "file://l.jpg",
  licenseExpiry: new Date(2028, 0, 1),
  soatPhotoUri: "file://s.jpg",
  soatExpiry: new Date(2027, 5, 1),
  inspectionPhotoUri: "file://r.jpg",
  inspectionExpiry: new Date(2027, 5, 1),
  mercadoPagoEmail: "cuenta@correo.com",
  acceptedTerms: true,
};

console.log("Válido (esperado {}):", validateDocuments(valid, "2018", today));
console.log(
  "Licencia vencida:",
  validateDocuments(
    { ...valid, licenseExpiry: new Date(2026, 10, 1) },
    "2018",
    today,
  ).licenseExpiry,
);
console.log(
  "Vence hoy (esperado error):",
  validateDocuments(
    { ...valid, soatExpiry: new Date(2026, 10, 2) },
    "2018",
    today,
  ).soatExpiry,
);
console.log(
  "Vence mañana (esperado undefined):",
  validateDocuments(
    { ...valid, soatExpiry: new Date(2026, 10, 3) },
    "2018",
    today,
  ).soatExpiry,
);
console.log(
  "Carro 2023 sin revisión (esperado {}):",
  validateDocuments(
    { ...valid, inspectionPhotoUri: null, inspectionExpiry: null },
    "2023",
    today,
  ),
);
console.log(
  "Carro 2018 sin revisión:",
  validateDocuments(
    { ...valid, inspectionPhotoUri: null, inspectionExpiry: null },
    "2018",
    today,
  ),
);
console.log(
  "Sin términos:",
  validateDocuments({ ...valid, acceptedTerms: false }, "2018", today)
    .acceptedTerms,
);
console.log(
  "Antigüedad 2021 (5 años, esperado true):",
  requiresInspection("2021", today),
);
console.log(
  "Antigüedad 2022 (4 años, esperado false):",
  requiresInspection("2022", today),
);
