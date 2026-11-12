# UberClone — Versión Conductor

Aplicación móvil multiplataforma para conductores, inspirada en Uber, construida con React Native y Expo. Incluye el registro del conductor, la disponibilidad con ubicación en tiempo real, la gestión de viajes, el cobro en efectivo o con Mercado Pago, las ganancias, el historial, el perfil y la configuración.

## Tecnologías

- React Native con Expo (SDK 58)
- React Navigation (Stack, Tabs y Drawer)
- Firebase Authentication y Cloud Firestore
- Cloudinary (almacenamiento de fotos)
- React Native Maps, Expo Location y la Routes API de Google (ruta del viaje)
- Mercado Pago Checkout Pro, a través de un backend propio en Node.js + Express (`backend/`)

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
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`          | Llave de Google con la **Routes API** habilitada (ruta del viaje) |

Solo se usan credenciales de prueba. Las llaves secretas (como la de Mercado Pago) van únicamente en el backend, nunca en la app.

## Backend de pagos

La carpeta `backend/` tiene un servidor Express que habla con Mercado Pago, para que la llave secreta nunca esté en la app.

- `POST /create-preference`: recibe el `tripId`, lee el monto del viaje en Firestore (no lo toma de la app) y devuelve el link de pago.
- `POST /webhook`: Mercado Pago avisa el resultado; el backend vuelve a consultar el pago y, si está aprobado, marca el viaje como `paid`.

Variables (`backend/.env.example`):

| Variable                      | Descripción                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| `MP_ACCESS_TOKEN`             | Access token **de prueba** de Mercado Pago                      |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | Ruta a la cuenta de servicio de Firebase (`serviceAccountKey.json`) |
| `PUBLIC_URL`                  | URL pública del backend (por ejemplo, la que da ngrok)          |
| `PORT`                        | Puerto local (por defecto 3000)                                 |

Para iniciarlo:

```bash
cd backend
npm install
npm start
```

Mercado Pago necesita llegar al webhook, así que el backend debe tener una URL pública (por ejemplo, `ngrok http 3000`). Esa misma URL va en `PUBLIC_URL` y en `EXPO_PUBLIC_BACKEND_URL` de la app.

## Funcionalidades

- **Inicio de sesión** con correo y contraseña (Firebase Auth), recuperación de contraseña y enlace al registro.
- **Registro** en tres pestañas (Datos personales, Vehículo y Documentos) con validaciones y errores debajo de cada campo. Debajo de **Enviar registro** se lista lo que falta en cada pestaña.
- Creación de la cuenta en Firebase Authentication y guardado del perfil en Firestore (`drivers/{uid}`) con `status: "pending"`; fotos en Cloudinary.
- **Inicio**: estado de la cuenta en tiempo real (`onSnapshot`). El interruptor Disponible / No disponible está bloqueado hasta que `status` sea `approved`, y se recuerda en AsyncStorage al cerrar la app. Mientras está disponible (y durante el viaje), la ubicación se guarda en Firestore y el carro se ve en el mapa.
- **Solicitudes de viaje** con temporizador de 15 segundos para aceptar o rechazar. Para probar sin pasajero real: *Simular pasajero (efectivo)* y *Simular pasajero (Mercado Pago)*.
- **Flujo del viaje con Stack**: *Inicio → Viaje en curso → Cobro y resumen*. La app navega sola según el estado del viaje y no deja volver atrás a mitad del viaje.
- **Viaje en curso**: ruta por las calles (Routes API) hacia la recogida y, después de *Pasajero a bordo*, hacia el destino. El botón *Simular recorrido* (solo en desarrollo) mueve el carro por la ruta.
- **Cobro y resumen**: tarifa (`calculateFare`, comisión configurable en `src/config/pricing.js`), comisión, propina, ganancia neta y estado del pago (Aprobado, Pendiente, Rechazado o Efectivo) en tiempo real. En efectivo, el conductor confirma *Cobro recibido*; con Mercado Pago, abre el link de pago y el viaje pasa a `paid` cuando el backend recibe la confirmación.
- **Ganancias**: totales de hoy, la semana y el mes (viajes, facturado, comisiones, propinas, neto y promedio) y el saldo del conductor.
- **Historial**: lista de viajes con filtros por periodo, rango de fechas y método de pago, y detalle de cada viaje con su mapa.
- **Perfil**: edición de nombre, celular y documentos (licencia, SOAT, revisión técnico-mecánica y correo de Mercado Pago), y datos del vehículo.
- **Configuración**: idioma español / inglés (se guarda en AsyncStorage y en el perfil) y cerrar sesión. Las pestañas del registro y sus mensajes de validación están solo en español.

Para simular la aprobación, cambia el campo `status` del documento del conductor en Firestore de `pending` a `approved`.

## Estructura del proyecto

```
src/
  components/   Componentes reutilizables (FormField, ImagePickerField, ...)
  config/       Firebase y tarifas (firebase.js, pricing.js)
  context/      Sesión, viaje activo, idioma y formulario de registro
  hooks/        Hooks personalizados (perfil, ubicación, viajes, ruta, ganancias, historial)
  i18n/         Textos en español e inglés
  navigation/   Stack, Tabs y Drawer
  screens/      Pantallas
  services/     Registro, viajes, pagos y subida a Cloudinary
  utils/        Validaciones, tarifas, ganancias, saldo, filtros y rutas (con pruebas en Node)
backend/
  server.js     Servidor de pagos con Mercado Pago
docs/
  AI_LOG.md     Bitácora de uso de IA
```

## Pruebas

Las funciones puras se prueban con Node, sin el celular:

```bash
node src/utils/calculateFare.test.mjs
node src/utils/validators.test.mjs
node src/utils/vehicleValidators.test.mjs
node src/utils/documentValidators.test.mjs
node src/utils/loginValidators.test.mjs
node src/utils/balance.test.mjs
node src/utils/earnings.test.mjs
node src/utils/historyFilters.test.mjs
node src/utils/paymentStatus.test.mjs
node src/utils/polyline.test.mjs
node src/utils/routeProgress.test.mjs
node src/i18n/strings.test.mjs
```

## Uso de IA

Ver la bitácora en [docs/AI_LOG.md](docs/AI_LOG.md).
