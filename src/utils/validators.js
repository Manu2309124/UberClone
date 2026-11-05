// AI-assisted: see docs/AI_LOG.md #5
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getAge(birthDate, today = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age;
}

export function validatePersonal(values, today = new Date()) {
  const errors = {};

  if (!values.photoUri) errors.photoUri = "La foto de perfil es obligatoria";

  const name = (values.fullName || "").trim();
  if (!name) errors.fullName = "El nombre es obligatorio";
  else if (name.length > 50) errors.fullName = "Máximo 50 caracteres";
  else if (!NAME_REGEX.test(name)) errors.fullName = "Solo letras y espacios";

  if (!values.idNumber) errors.idNumber = "El documento es obligatorio";
  else if (!/^\d{6,10}$/.test(values.idNumber))
    errors.idNumber = "Debe tener entre 6 y 10 dígitos";

  if (!values.phone) errors.phone = "El celular es obligatorio";
  else if (!/^\d{10}$/.test(values.phone))
    errors.phone = "Debe tener 10 dígitos";

  if (!values.birthDate)
    errors.birthDate = "La fecha de nacimiento es obligatoria";
  else if (getAge(values.birthDate, today) < 18)
    errors.birthDate = "Debes ser mayor de 18 años";

  if (!values.gender) errors.gender = "Selecciona un género";

  const email = (values.email || "").trim();
  if (!email) errors.email = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Correo no válido";

  if (!values.language) errors.language = "Selecciona un idioma";

  if (!values.password) errors.password = "La contraseña es obligatoria";
  else if (values.password.length < 6) errors.password = "Mínimo 6 caracteres";

  if (!values.confirmPassword)
    errors.confirmPassword = "Confirma la contraseña";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Las contraseñas no coinciden";

  return errors;
}
