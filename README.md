# UberClone — Versión Conductor

App móvil en React Native con Expo para conductores.

## Instalación

1. `npm install`
2. Copiar `.env.example` a `.env` y completar los valores
3. `npx expo start`

## Uso de IA

Ver la bitácora en [docs/AI_LOG.md](docs/AI_LOG.md).

# UberClone — Versión Conductor

Aplicación móvil multiplataforma para conductores, inspirada en Uber, construida con React Native y Expo. Esta entrega incluye el registro del conductor (datos personales y vehículo), el guardado en Firestore, la subida de fotos a Cloudinary y el estado de la cuenta (pendiente / aprobado) en tiempo real.

## Tecnologías

- React Native con Expo (SDK 58)
- React Navigation (Stack, Tabs y Drawer)
- Firebase Authentication y Cloud Firestore
- Cloudinary (almacenamiento de fotos)

## Requisitos

- Node.js 18 o superior
- Git
- La app **Expo Go** en el celular (celular y computador en la misma red wifi)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Manu2309124/UberClone.git
   cd UberClone
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear el archivo `.env` a partir del ejemplo y completar los valores:
   ```bash
   cp .env.example .env
   ```
   En Windows (PowerShell): `Copy-Item .env.example .env`
4. Iniciar la app (con caché limpia la primera vez):
   ```bash
   npx expo start -c
   ```
5. Escanear el código QR con Expo Go.

## Variables de entorno

Los nombres están en `.env.example`. El archivo `.env` real **no se sube a Git**.

| Variable                                   | Descripción                                   |
| ------------------------------------------ | --------------------------------------------- |
| `EXPO_PUBLIC_FIREBASE_API_KEY`             | Clave de la app web de Firebase               |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Dominio de autenticación                      |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`          | ID del proyecto                               |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Bucket de almacenamiento                      |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID del remitente                              |
| `EXPO_PUBLIC_FIREBASE_APP_ID`              | ID de la app                                  |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`        | Cloud name de Cloudinary                      |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`     | Upload preset de Cloudinary (modo _unsigned_) |
| `EXPO_PUBLIC_BACKEND_URL`                  | URL pública del backend de pagos (`backend/`) |

Solo se usan credenciales de prueba. Las llaves secretas (por ejemplo, las de la pasarela de pagos en la entrega final) irán únicamente en un backend, nunca en la app.

## Funcionalidades de esta entrega

- Registro en dos pestañas (Datos personales y Vehículo) con validaciones y errores debajo de cada campo.
- El botón **Enviar registro** solo se habilita cuando ambas pestañas son válidas.
- Creación de la cuenta en Firebase Authentication y guardado del perfil en Firestore (`drivers/{uid}`) con `status: "pending"`.
- Subida de la foto de perfil y del vehículo a Cloudinary.
- Pantalla de Inicio que lee el estado de la cuenta en tiempo real (`onSnapshot`): el interruptor Disponible / No disponible está bloqueado hasta que `status` sea `approved`.
- Función `calculateFare` con comisión configurable (`src/config/pricing.js`).

Para simular la aprobación, cambia el campo `status` del documento del conductor en Firestore de `pending` a `approved`.

## Estructura del proyecto

```
src/
  components/   Componentes reutilizables (FormField, ImagePickerField, ...)
  config/       Firebase y tarifas (firebase.js, pricing.js)
  context/      Sesión y formulario de registro
  hooks/        Hooks personalizados (useDriverProfile)
  navigation/   Stack, Tabs y Drawer
  screens/      Pantallas
  services/     Registro en Firebase y subida a Cloudinary
  utils/        Validaciones y calculateFare (con pruebas en Node)
docs/
  AI_LOG.md     Bitácora de uso de IA
```

## Pruebas

Las funciones puras se prueban con Node, sin el celular:

```bash
node src/utils/calculateFare.test.mjs
node src/utils/validators.test.mjs
node src/utils/vehicleValidators.test.mjs
```

## Uso de IA

Ver la bitácora en [docs/AI_LOG.md](docs/AI_LOG.md).
