// AI-assisted: see docs/AI_LOG.md #6
import { validateVehicle } from "./vehicleValidators.js";

const today = new Date(2026, 10, 2);
const valid = {
  category: "economy",
  plate: "abc123",
  brand: "Chevrolet",
  model: "Spark",
  year: "2020",
  color: "white",
  capacity: "4",
  vehiclePhotoUri: "file://carro.jpg",
};

console.log("Válido (esperado {}):", validateVehicle(valid, today));
console.log(
  "Placa mala:",
  validateVehicle({ ...valid, plate: "AB1234" }, today).plate,
);
console.log(
  "Año futuro:",
  validateVehicle({ ...valid, year: "2027" }, today).year,
);
console.log(
  "XL con 4 pasajeros:",
  validateVehicle({ ...valid, category: "xl", capacity: "4" }, today).capacity,
);
console.log(
  "XL con 6 pasajeros (esperado undefined):",
  validateVehicle({ ...valid, category: "xl", capacity: "6" }, today).capacity,
);
console.log(
  "Marca larga:",
  validateVehicle({ ...valid, brand: "x".repeat(31) }, today).brand,
);
