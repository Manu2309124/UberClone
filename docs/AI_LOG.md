### Entrada #1

- Fecha: 2026-10-30
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Entender el proyecto, estimar el tiempo y crear el repositorio, el proyecto Expo y la estructura de carpetas
- Prompt: "(tu primer mensaje con el PDF: 'claude tengo el siguiente proyecto leelo y ya te doy las especificaciones ok?' y luego 'ok con que empezamos')"
- Resumen de la respuesta: Claude resumió el proyecto, estimó 110 a 180 horas y propuso un plan por días hasta el jueves 12. Guió la creación del repositorio, de la rama feature/setup, de las carpetas, del .env.example y de la primera bitácora.
- Qué se usó / modificó / descartó: Se usó la estructura de carpetas y el .env.example. Creé el proyecto Expo en la carpeta actual en vez de una subcarpeta. Reforcé el .gitignore con .env y .env.local, porque el original no protegía el archivo .env.
- Archivos y commit: .gitignore, .env.example, README.md, docs/AI_LOG.md, src/\* — 5904c90 y 7bd5801
- Verificación: npx expo start arrancó, git push subió la rama y el Pull Request se fusionó en main.
- Aprendizaje: (tus palabras)

### Entrada #2

- Fecha: 2026-10-31
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Configurar Firebase (Auth y Firestore) y el archivo firebase.js
- Prompt: "(por ejemplo: 'se necesita firebase')"
- Resumen de la respuesta: Claude explicó por qué usar Firebase, guió la creación del proyecto, de Authentication con correo y contraseña y de Firestore en modo de prueba, y entregó firebase.js leyendo las credenciales del .env, con sesión persistente en AsyncStorage.
- Qué se usó / modificó / descartó: Se usó firebase.js tal cual. Copié las credenciales a mi .env yo misma. Descarté el bloque firebaseConfig que muestra la consola, porque el código lee las variables del .env.
- Archivos y commit: src/config/firebase.js, package.json — (hash)
- Verificación: La app cargó sin errores en Expo Go y, más adelante, el registro creó usuarios en Authentication.
- Aprendizaje: (tus palabras)

### Entrada #3

- Fecha: 2026-10-31
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Crear la navegación (Stack, Tabs y Drawer) y el contexto de sesión
- Prompt: "(por ejemplo: 'sigamos')"
- Resumen de la respuesta: Claude entregó AuthContext (escucha la sesión con onAuthStateChanged), RootNavigator (muestra AuthStack o AppDrawer según haya sesión), TripStack, RegisterTabs, AppDrawer y PlaceholderScreen.
- Qué se usó / modificó / descartó: Se usó todo. La app mostró primero la pantalla de ejemplo de Expo porque no había guardado App.js; lo corregí. Creé la rama después de modificar archivos y la moví con git checkout -b.
- Archivos y commit: App.js, src/context/AuthContext.js, src/navigation/\*, src/components/PlaceholderScreen.js — (hash; el merge en main fue e045af4)
- Verificación: Expo Go mostró la pantalla Login (placeholder), lo esperado sin sesión.
- Aprendizaje: (tus palabras)

### Entrada #4

- Fecha: 2026-10-31
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Crear calculateFare y pricing.js
- Prompt: "(el mensaje en que pediste seguir con calculateFare)"
- Resumen de la respuesta: Claude entregó pricing.js con los valores configurables, calculateFare como función pura que devuelve fare, commission y driverEarnings, y una prueba en Node.
- Qué se usó / modificó / descartó: El flag --experimental-default-type no existe en mi Node 24, así que agregué .js a los imports y renombré la prueba a .mjs.
- Archivos y commit: src/config/pricing.js, src/utils/calculateFare.js, src/utils/calculateFare.test.mjs — (hash; merge e992932)
- Verificación: Con 8,5 km y 22 min: Económico 19.200 / 3.840 / 15.360 y XL 26.900 / 5.380 / 21.520, igual al enunciado.
- Aprendizaje: (tus palabras)

### Entrada #5

- Fecha: 2026-11-01
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Pestaña 1 del registro (Datos personales)
- Prompt: "sigamos con domingo 1"
- Resumen de la respuesta: validatePersonal con su prueba, RegistrationContext, FormField, ImagePickerField y PersonalDataScreen con errores debajo de cada campo, sin Alert.
- Qué se usó / modificó / descartó: Se usó el código. Corregí AuthStack.js, donde había anidado un Stack.Navigator por error. Se agregaron contraseña y confirmación porque Firebase Auth las necesita.
- Archivos y commit: validators.js, validators.test.mjs, RegistrationContext.js, FormField.js, ImagePickerField.js, PersonalDataScreen.js — cfb78b6
- Verificación: node src/utils/validators.test.mjs con siete casos correctos, incluido el límite de 18 años. En el celular comprobé errores, dígitos y fotos.
- Aprendizaje: (tus palabras)

### Entrada #6

- Fecha: 2026-11-02
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Pestaña 2 del registro (Vehículo)
- Prompt: "ok vamos a continuar"
- Resumen de la respuesta: vehicleValidators (placa ABC123 en mayúsculas, año no futuro, XL con mínimo 6 pasajeros), su prueba, ampliación del contexto y VehicleScreen.
- Qué se usó / modificó / descartó: (qué usaste, qué cambiaste)
- Archivos y commit: vehicleValidators.js, vehicleValidators.test.mjs, VehicleScreen.js, RegistrationContext.js, RegisterTabs.js — 64e92b8
- Verificación: node src/utils/vehicleValidators.test.mjs con seis casos correctos; en el celular, placa a mayúsculas y error de capacidad en XL.
- Aprendizaje: (tus palabras)

### Entrada #7

- Fecha: 2026-11-02
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Escribir la pestaña 3 (Documentos) para la entrega final
- Prompt: "(el mensaje en que pediste seguir con la pestaña 3)"
- Resumen de la respuesta: documentValidators (vencimientos posteriores a hoy, revisión técnico-mecánica solo con vehículos de 5 años o más), DateField, DocumentsScreen y ampliación del contexto.
- Qué se usó / modificó / descartó: Se usó Switch en lugar de checkbox. La profesora indicó que esta pestaña va en la entrega final, así que quedó guardada y fuera de la navegación.
- Archivos y commit: documentValidators.js, documentValidators.test.mjs, DateField.js, DocumentsScreen.js — a9a7722
- Verificación: (pega lo que imprima node src/utils/documentValidators.test.mjs, si lo corriste)
- Aprendizaje: (tus palabras)

### Entrada #8

- Fecha: 2026-11-03
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Guardar el registro en Firebase Auth y Firestore con estado pending
- Prompt: "(el mensaje en que pediste el guardado del registro)"
- Resumen de la respuesta: registerDriver crea el usuario y guarda drivers/{uid} con status "pending"; SubmitRegistration habilita el botón solo si las dos pestañas son válidas.
- Qué se usó / modificó / descartó: Se usó el código. Al probar, el .env tenía el texto de ejemplo en vez de la apiKey real; lo corregí y reinicié con npx expo start -c.
- Archivos y commit: registerDriver.js, SubmitRegistration.js, RegisterTabs.js — (hash; confírmalo con git log --oneline)
- Verificación: Apareció el usuario en Authentication y el documento en Firestore con status pending. Cambié a approved a mano.
- Aprendizaje: (tus palabras)

### Entrada #9

- Fecha: 2026-11-03
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Leer el estado de la cuenta en tiempo real en Inicio
- Prompt: "(el mensaje en que pediste seguir con el estado)"
- Resumen de la respuesta: useDriverProfile con onSnapshot y función de limpieza, y HomeScreen con el interruptor deshabilitado si status no es approved.
- Qué se usó / modificó / descartó: Se usó tal cual. Quité el login por indicación de la profesora (luego se retomó).
- Archivos y commit: useDriverProfile.js, HomeScreen.js, TripStack.js — 0b66449
- Verificación: En Expo Go, Pendiente con interruptor bloqueado; al cambiar status a approved en Firestore, la pantalla se actualizó sola.
- Aprendizaje: (tus palabras)

### Entrada #10

- Fecha: 2026-11-03
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Subir las fotos de perfil y vehículo a Cloudinary
- Prompt: "(el mensaje sobre Cloudinary)"
- Resumen de la respuesta: uploadImage envía la foto a Cloudinary con un upload preset unsigned y devuelve la URL; registerDriver sube las fotos antes de crear el usuario.
- Qué se usó / modificó / descartó: FormData con { uri, type, name } y con File fallaron con "Unsupported FormDataPart implementation". Terminé usando (Blob o base64: escribe la que funcionó).
- Archivos y commit: uploadImage.js, registerDriver.js — 6b5c996
- Verificación: En Firestore, photoUrl y vehiclePhotoUrl son enlaces de res.cloudinary.com.
- Aprendizaje: (tus palabras)

### Entrada #11

- Fecha: 2026-11-04
- Integrante: Manuela Gómez
- Herramienta: Claude
- Objetivo: Íconos en las pestañas del registro y README completo
- Prompt: "(copia el mensaje exacto: 'vamos a ponerle figuritas a los tabs...' y 'sigamos con la bitacora')"
- Resumen de la respuesta: tabBarIcon con Ionicons (relleno al estar activa, contorno al estar inactiva) y un README con instalación, variables de entorno y estructura.
- Qué se usó / modificó / descartó: (completa)
- Archivos y commit: RegisterTabs.js, README.md — (hash tras el commit)
- Verificación: (qué viste en el celular)
- Aprendizaje: (tus palabras)
