// AI-assisted: see docs/AI_LOG.md #6
const PLATE_REGEX = /^[A-Z]{3}\d{3}$/;

export const MIN_CAPACITY = { economy: 1, xl: 6, premium: 1 };

export function validateVehicle(values, today = new Date()) {
  const errors = {};
  const currentYear = today.getFullYear();

  if (!values.category) errors.category = "Selecciona una categoría";

  const plate = (values.plate || "").trim().toUpperCase();
  if (!plate) errors.plate = "La placa es obligatoria";
  else if (!PLATE_REGEX.test(plate))
    errors.plate = "Formato inválido (ejemplo: ABC123)";

  const brand = (values.brand || "").trim();
  if (!brand) errors.brand = "La marca es obligatoria";
  else if (brand.length > 30) errors.brand = "Máximo 30 caracteres";

  const model = (values.model || "").trim();
  if (!model) errors.model = "El modelo es obligatorio";
  else if (model.length > 30) errors.model = "Máximo 30 caracteres";

  if (!values.year) errors.year = "El año es obligatorio";
  else if (!/^\d{4}$/.test(values.year)) errors.year = "Debe tener 4 dígitos";
  else if (Number(values.year) > currentYear)
    errors.year = `No puede ser mayor a ${currentYear}`;
  else if (Number(values.year) < 1990) errors.year = "Año no válido";

  if (!values.color) errors.color = "Selecciona un color";

  if (!values.capacity) errors.capacity = "La capacidad es obligatoria";
  else if (!/^\d+$/.test(values.capacity))
    errors.capacity = "Debe ser un número";
  else {
    const cap = Number(values.capacity);
    const min = MIN_CAPACITY[values.category] ?? 1;
    if (cap < min)
      errors.capacity = `Mínimo ${min} pasajeros para esta categoría`;
    else if (cap > 20) errors.capacity = "Capacidad no válida";
  }

  if (!values.vehiclePhotoUri)
    errors.vehiclePhotoUri = "La foto del vehículo es obligatoria";

  return errors;
}
