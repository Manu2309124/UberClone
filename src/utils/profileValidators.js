// AI-assisted: see docs/AI_LOG.md #19
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;

export function validateProfileEdit(values) {
  const errors = {};
  const name = (values.fullName || "").trim();
  if (!name) errors.fullName = "El nombre es obligatorio";
  else if (name.length > 50) errors.fullName = "Máximo 50 caracteres";
  else if (!NAME_REGEX.test(name)) errors.fullName = "Solo letras y espacios";

  if (!values.phone) errors.phone = "El celular es obligatorio";
  else if (!/^\d{10}$/.test(values.phone))
    errors.phone = "Debe tener 10 dígitos";
  return errors;
}
