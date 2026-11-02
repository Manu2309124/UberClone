# Bitácora de uso de IA

### Entrada #1

- Fecha: 2026-10-31
- Integrante: Manuela Apellido
- Herramienta: Claude
- Objetivo: Planear el proyecto y crear la estructura inicial
- Prompt: "(pega aquí tu prompt tal cual lo escribiste)"
- Resumen de la respuesta: Plan de trabajo por días y pasos para crear el repo, Expo y las carpetas base.
- Qué se usó / modificó / descartó: ...
- Archivos y commit: estructura de carpetas, .env.example, docs/AI_LOG.md
- Verificación: El proyecto arranca con npx expo start y el push a GitHub funcionó
- Aprendizaje: ...

Entrada #2 en docs/AI_LOG.md (objetivo: crear firebase.js; prompt tal cual; archivo src/config/firebase.js; hash del commit, que ves con git log -1). La subes con la siguiente rama.

Entrada #4 en docs/AI_LOG.md. Usa esta verificación, que ya la tienes comprobada: “Probado con el ejemplo de 8,5 km y 22 min (sección 5): Económico 19.200 / 3.840 / 15.360 y XL 26.900 / 5.380 / 21.520 COP, coinciden con el enunciado.” Y apunta que cambiaste los imports a .js y renombraste la prueba a .mjs para que Node la ejecutara; eso entra en “qué se modificó”.

### Entrada #5

- Fecha: 2026-11-01
- Integrante: Manuela (tu apellido)
- Herramienta: Claude
- Objetivo: Crear la pestaña 1 del registro (Datos personales) con validaciones, contexto del formulario y componentes reutilizables
- Prompt: "(pega aquí tal cual el mensaje con el que pediste empezar el registro, por ejemplo: 'sigamos con domingo 1')"
- Resumen de la respuesta: Claude entregó una función de validación pura (validatePersonal) con su prueba en Node, un contexto (RegistrationContext) que comparte el estado entre las tres pestañas, los componentes FormField e ImagePickerField, la pantalla PersonalDataScreen con errores debajo de cada campo (sin Alert) y la conexión en RegisterTabs.
- Qué se usó / modificó / descartó: Se usó todo el código tal cual. Se modificó AuthStack.js: Claude indicó cambiar solo la línea del Navigator a initialRouteName="Registro" (temporal, para llegar al registro mientras no existe el login), pero yo había anidado un segundo Stack.Navigator por error; lo corregí dejando un solo Navigator. Se agregaron los campos de contraseña y confirmación porque Firebase Auth los necesita. No se descartó nada.
- Archivos y commit: src/utils/validators.js, src/utils/validators.test.mjs, src/context/RegistrationContext.js, src/components/FormField.js, src/components/ImagePickerField.js, src/screens/PersonalDataScreen.js, src/navigation/RegisterTabs.js, src/navigation/AuthStack.js — (hash del commit; lo ves con git log -1)
- Verificación: Ejecuté node src/utils/validators.test.mjs y los siete casos dieron lo esperado, incluido el límite de edad (cumple 18 mañana: rechazado; cumple 18 hoy: aceptado). En el celular con Expo Go comprobé que los errores salen debajo de cada campo, que documento y celular solo aceptan dígitos, que la foto funciona con cámara y galería y que lo escrito se conserva al cambiar de pestaña.
- Aprendizaje: (escríbelo con tus palabras. Ideas: por qué separar la validación en una función pura la hace fácil de probar sin el celular; para qué sirve el contexto cuando varias pestañas comparten el mismo formulario; qué aprendí del error de anidar dos Navigator.)

### Entrada #5

- Fecha: 2026-11-01
- Integrante: (tu nombre y apellido)
- Herramienta: Claude
- Objetivo: Crear la pestaña 1 del registro (Datos personales) con validaciones, contexto del formulario y componentes reutilizables
- Prompt: "sigamos con domingo 1"
- Resumen de la respuesta: Claude entregó la función validatePersonal con su prueba en Node, el contexto RegistrationContext que comparte el estado entre pestañas, los componentes FormField e ImagePickerField, la pantalla PersonalDataScreen con errores debajo de cada campo (sin Alert) y la conexión en RegisterTabs.
- Qué se usó / modificó / descartó: Se usó el código tal cual. Modifiqué AuthStack.js: había anidado un segundo Stack.Navigator por error y lo corregí dejando uno solo con initialRouteName="Registro" (temporal). Se agregaron contraseña y confirmación porque Firebase Auth las necesita. No se descartó nada.
- Archivos y commit: validators.js, validators.test.mjs, RegistrationContext.js, FormField.js, ImagePickerField.js, PersonalDataScreen.js, RegisterTabs.js, AuthStack.js — cfb78b6
- Verificación: node src/utils/validators.test.mjs, siete casos correctos (incluido cumple 18 mañana: rechazado, hoy: aceptado). En Expo Go comprobé errores bajo cada campo, solo dígitos en documento y celular, foto con cámara y galería, y que el estado se conserva al cambiar de pestaña.
- Aprendizaje: (con tus palabras: por qué la validación como función pura se prueba sin el celular, para qué sirve el contexto con varias pestañas, qué pasó al anidar dos Navigator)

### Entrada #6

- Fecha: 2026-11-02
- Integrante: (tu nombre y apellido)
- Herramienta: Claude
- Objetivo: Crear la pestaña 2 del registro (Vehículo) con validaciones
- Prompt: "(pega tal cual tu mensaje, por ejemplo: 'si la primera entrega incluye lo que acabas de mencionar' no; usa el que pidió continuar con la pestaña 2: 'ok vamos a continuar')"
- Resumen de la respuesta: Claude entregó vehicleValidators (placa ABC123 en mayúsculas, año no mayor al actual, XL con mínimo 6 pasajeros, marca y modelo máx. 30), su prueba en Node, la ampliación del contexto y la pantalla VehicleScreen.
- Qué se usó / modificó / descartó: (qué usaste tal cual, qué cambiaste, qué descartaste)
- Archivos y commit: vehicleValidators.js, vehicleValidators.test.mjs, RegistrationContext.js, VehicleScreen.js, RegisterTabs.js — 64e92b8
- Verificación: node src/utils/vehicleValidators.test.mjs, seis casos correctos (XL con 4 rechazado, con 6 aceptado). En el celular: placa pasa a mayúsculas, año solo dígitos, error de capacidad en XL.
- Aprendizaje: (con tus palabras)

### Entrada #7

- Fecha: 2026-11-02
- Integrante: (tu nombre y apellido)
- Herramienta: Claude
- Objetivo: Crear la pestaña 3 del registro (Documentos y pagos)
- Prompt: "(pega tal cual el mensaje con que pediste seguir con la pestaña 3)"
- Resumen de la respuesta: Claude entregó documentValidators (vencimientos posteriores a hoy, revisión técnico-mecánica solo si el vehículo tiene 5 años o más, correo de Mercado Pago, términos), su prueba, el componente DateField, la ampliación del contexto y DocumentsScreen con la comisión leída de pricing.js.
- Qué se usó / modificó / descartó: (completa; menciona que se usó Switch en lugar de checkbox)
- Archivos y commit: documentValidators.js, documentValidators.test.mjs, DateField.js, RegistrationContext.js, DocumentsScreen.js, RegisterTabs.js — (hash tras el commit)
- Verificación: (pega aquí lo que imprima node src/utils/documentValidators.test.mjs y lo que veas en el celular)
- Aprendizaje: (con tus palabras)
