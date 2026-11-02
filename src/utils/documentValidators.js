// AI-assisted: see docs/AI_LOG.md #7
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Vehicles with this many years or more need the technical inspection
export const INSPECTION_MIN_AGE = 5;

export function requiresInspection(vehicleYear, today = new Date()) {
  const year = Number(vehicleYear);
  if (!year) return true; // unknown year: be strict
  return today.getFullYear() - year >= INSPECTION_MIN_AGE;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isFuture(date, today) {
  return startOfDay(date) > startOfDay(today);
}

export function validateDocuments(values, vehicleYear, today = new Date()) {
  const errors = {};

  if (!values.licenseNumber)
    errors.licenseNumber = "El número de licencia es obligatorio";
  else if (!/^\d{6,15}$/.test(values.licenseNumber))
    errors.licenseNumber = "Debe tener entre 6 y 15 dígitos";

  if (!values.licensePhotoUri)
    errors.licensePhotoUri = "La foto de la licencia es obligatoria";
  if (!values.licenseExpiry)
    errors.licenseExpiry = "La fecha de vencimiento es obligatoria";
  else if (!isFuture(values.licenseExpiry, today))
    errors.licenseExpiry = "La licencia está vencida";

  if (!values.soatPhotoUri)
    errors.soatPhotoUri = "La foto del SOAT es obligatoria";
  if (!values.soatExpiry)
    errors.soatExpiry = "La fecha de vencimiento es obligatoria";
  else if (!isFuture(values.soatExpiry, today))
    errors.soatExpiry = "El SOAT está vencido";

  if (requiresInspection(vehicleYear, today)) {
    if (!values.inspectionPhotoUri)
      errors.inspectionPhotoUri = "La foto de la revisión es obligatoria";
    if (!values.inspectionExpiry)
      errors.inspectionExpiry = "La fecha de vencimiento es obligatoria";
    else if (!isFuture(values.inspectionExpiry, today))
      errors.inspectionExpiry = "La revisión está vencida";
  }

  const email = (values.mercadoPagoEmail || "").trim();
  if (!email)
    errors.mercadoPagoEmail = "El correo de Mercado Pago es obligatorio";
  else if (!EMAIL_REGEX.test(email))
    errors.mercadoPagoEmail = "Correo no válido";

  if (!values.acceptedTerms)
    errors.acceptedTerms = "Debes aceptar los términos";

  return errors;
}
