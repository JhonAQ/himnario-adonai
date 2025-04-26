# Scrum - Adonai

## **Sprint 1: Integración de la Base de Datos Preconstruida y Capa de Servicios**

### **Objetivo Principal:**

- Tener la base de datos local lista y funcional, y contar con una capa de acceso a datos que permita consultar metadatos y detalles (por ejemplo, la letra de los himnos).

### **Tickets Detallados:**

1. **Ticket 1.1: Preparación y Ubicación de la Base de Datos**
   - **Descripción:** Crear la base de datos SQLite preconstruida con la tabla `himnos` y sus campos (id, title, note, author, number, verses, lyrics, type, etc.) y colocar el archivo `hymns.db` en `assets/database/`.
   - **Subtareas:**
     - [x] Usar una herramienta (DB Browser for SQLite u otra) para diseñar la tabla `himnos` y poblarla con datos de prueba.
     - [x] Exportar el archivo `hymns.db` y moverlo a la carpeta `assets/database/` dentro de tu proyecto.
     - [x] Documentar la estructura de la tabla en un README o documento.

2. **Ticket 1.2: Implementar setupDatabase()**
   - **Descripción:** Desarrollar una función `setupDatabase()` que verifique si la base de datos ya existe en el directorio interno (FileSystem.documentDirectory) y, si no, la copie desde `assets/database/hymns.db`.
   - **Subtareas:**
     - [x] Investigar cómo usar `expo-file-system` para verificar la existencia de archivos.
     - [x] Escribir la función `setupDatabase()` que realice la verificación y copia.
     - [x] Probar la función en un simulador o dispositivo, comprobando con logs si la copia se realiza solo la primera vez.

3. **Ticket 1.3: Crear la Capa de Servicio (databaseService.js)**
   - **Descripción:** Crear un módulo que contenga funciones para acceder a los datos de la DB.
   - **Subtareas:**
     - [x] Implementar la función `getAllHymnsMetadata()` que realice una consulta SQL y devuelva los metadatos (sin la letra completa).
     - [x] Implementar la función `getHimnoById(id)` para recuperar el detalle completo de un himno (incluyendo la letra).
     - [x] (Opcional) Definir funciones para gestionar favoritos, si se decide integrarlos en la DB.
     - [x] Probar cada función mediante consultas simples e imprimir resultados en la consola.

4. **Ticket 1.4: Integrar setupDatabase() en App.js y Pruebas Básicas**
   - **Descripción:** Asegurarse de que la base de datos se configure correctamente al iniciar la app.
   - **Subtareas:**
     - [x] Incluir una llamada a `setupDatabase()` en un `useEffect` en App.js.
     - [x] Realizar una consulta de prueba (por ejemplo, listar todos los himnos) y mostrar los resultados en la consola o en una pantalla de prueba.
     - [x] Verificar que la DB no se copie de nuevo en reinicios de la app.

---

## **Sprint 2: Contexto Global, Metadatos y Search Bar**

### **Objetivo Principal:**

- Centralizar la carga de metadatos mediante un Context global y habilitar la búsqueda filtrada en tiempo real.

### **Tickets Detallados:**

1. **Ticket 2.1: Crear el Context Global (HimnosContext)**
   - **Descripción:** Implementar un Context que cargue y almacene los metadatos de todos los himnos y genere una lista única de categorías.
   - **Subtareas:**
     - [ ] Crear `HimnosContext.js` con el proveedor `HimnosProvider`.
     - [ ] En el `useEffect` del proveedor, invocar `getAllHymnsMetadata()` y guardar los datos en el state.
     - [ ] Extraer y guardar en el state una lista de categorías únicas basadas en el campo `type`.
     - [ ] Incluir un state para “recentlyViewed” (inicialmente vacío) y otros que consideres necesarios.
     - [ ] Probar el Context envolviendo la app y mostrar algunos datos en consola o en una vista de prueba.

2. **Ticket 2.2: Integrar y Mejorar el Search Bar**
   - **Descripción:** Revisar e implementar la lógica de filtrado en el componente `SearchBar`.
   - **Subtareas:**
     - [ ] Revisar el componente `SearchBar` para asegurarse de que maneje el estado del texto.
     - [ ] Crear la función `filterHymns(query)` en el Context o en un helper, que filtre los metadatos según el texto ingresado.
     - [ ] Conectar el evento `onChangeText` del Search Bar para actualizar el filtro.
     - [ ] Mostrar visualmente un mensaje o indicador si no se encuentran himnos.
     - [ ] Probar el comportamiento en pantalla (por ejemplo, en Home) con datos del Context.

3. **Ticket 2.3: Integrar el Context en las Pantallas Existentes**
   - **Descripción:** Adaptar las pantallas Home, Categoría (Index) y Hymn para que usen los datos del Context.
   - **Subtareas:**
     - [ ] En la Home Screen:  
       - Conectar al Context para mostrar la lista de categorías y los himnos recientemente vistos.
       - Integrar el Search Bar en la parte superior.
     - [ ] En la Index Screen (por categoría):  
       - Filtrar los himnos del Context según la categoría seleccionada.
       - Renderizar la lista filtrada usando componentes como `CardHymn` o `ListCard`.
     - [ ] En la Hymn Screen (detalle):  
       - Recibir el id o metadato del himno vía navegación.
       - Invocar `getHimnoById(id)` para cargar los detalles completos de forma “on demand”.
     - [ ] Probar la navegación y la actualización del estado "recentlyViewed" al acceder a un himno.

4. **Ticket 2.4: Pruebas de Integración del Context y Search**
   - **Descripción:** Validar que la integración del Context y el Search Bar funcione en todas las pantallas.
   - **Subtareas:**
     - [ ] Verificar que al escribir en el Search Bar se actualice la lista mostrada en Home/Index.
     - [ ] Confirmar que los datos de categorías y metadatos se compartan correctamente en todas las vistas.
     - [ ] Documentar cualquier ajuste o bug encontrado durante las pruebas.

---

## **Sprint 3: Funcionalidades Adicionales y Mejoras en la UI**

### **Objetivo Principal:**
- Agregar funcionalidades complementarias y optimizar la experiencia de usuario.

### **Tickets Detallados:**

1. **Ticket 3.1: Gestión de Favoritos**
   - **Descripción:** Permitir que el usuario marque o desmarque himnos como favoritos.
   - **Subtareas:**
     - [ ] Definir si se usará SQLite o AsyncStorage para los favoritos.
     - [ ] Crear funciones en la capa de servicio: `addFavorite(himnoId)`, `removeFavorite(himnoId)`, y `getFavorites()`.
     - [ ] Integrar estas funciones en el Context y actualizar el estado global.
     - [ ] Modificar el componente `Like` para que refleje el estado favorito y permita togglearlo.
     - [ ] Probar la funcionalidad marcando y desmarcando favoritos, y verificar la persistencia.

2. **Ticket 3.2: Mejora de la UI en la Lista de Categorías**
   - **Descripción:** Optimizar la visualización y navegación en la pantalla de categorías.
   - **Subtareas:**
     - [ ] Revisar y ajustar el diseño de la Index Screen para mostrar categorías de forma clara.
     - [ ] Asegurar que los componentes `CardHymn` y `ListCard` tengan estilos consistentes y responsivos.
     - [ ] Implementar animaciones o transiciones suaves si es posible (opcional).
     - [ ] Probar la navegación y usabilidad en diferentes dispositivos.

3. **Ticket 3.3: Optimización del Search Bar**
   - **Descripción:** Añadir mejoras al Search Bar para optimizar la búsqueda.
   - **Subtareas:**
     - [ ] Implementar debounce en el Search Bar para evitar filtrados excesivos.
     - [ ] Añadir mensajes o placeholders informativos cuando la búsqueda no arroje resultados.
     - [ ] Realizar pruebas de rendimiento y ajustar la función de filtrado si es necesario.

4. **Ticket 3.4: Implementación del Splash Screen con Indicadores de Carga**
   - **Descripción:** Crear un Splash Screen que muestre el progreso de carga de fuentes, copia de DB y metadatos.
   - **Subtareas:**
     - [ ] Configurar `expo-splash-screen` para mantener el splash hasta que se completen las cargas.
     - [ ] Crear componentes visuales que indiquen el progreso (por ejemplo, una barra de carga o spinners).
     - [ ] Integrar la lógica en App.js para ocultar el splash solo cuando todo esté listo.
     - [ ] Probar el comportamiento en condiciones de red lenta y en dispositivos reales.

5. **Ticket 3.5: Pruebas y Refinamiento de la UI General**
   - **Descripción:** Realizar pruebas finales y ajustar estilos para asegurar una experiencia de usuario óptima.
   - **Subtareas:**
     - [ ] Revisar la interfaz en dispositivos Android (principal) y en emuladores de iOS.
     - [ ] Recoger feedback personal y ajustar estilos utilizando NativeWind.
     - [ ] Documentar y corregir bugs o inconsistencias encontradas.

---

## **Sprint 4: Funcionalidades Avanzadas y Requisitos Generales Futuros**

### **Objetivo Principal:**
- Agregar funcionalidades extra que aporten valor al himnario y preparar la app para futuras actualizaciones.

### **Tickets Detallados (Planificados para Futuros Sprints):**

1. **Ticket 4.1: Actualización Remota de Himnos**
   - [ ] Diseñar el endpoint o recurso remoto para actualizaciones.
   - [ ] Crear funciones en la capa de servicio para sincronizar la DB local con datos remotos.
   - [ ] Integrar un botón o mecanismo de “Actualizar Himnario” en la UI.
   - [ ] Probar la sincronización y manejo de conflictos.

2. **Ticket 4.2: Visualización Avanzada de Acordes**
   - [ ] Implementar vistas para mostrar acordes junto a los himnos.
   - [ ] Permitir la visualización de figuras de acordes para distintos instrumentos.
   - [ ] Ajustar el diseño para asegurar claridad y usabilidad.

3. **Ticket 4.3: Reproducción de Canciones y Transporte de Acordes**
   - [ ] Integrar funcionalidades para reproducir audio de los himnos.
   - [ ] Desarrollar la funcionalidad para transponer acordes dinámicamente.
   - [ ] Probar la reproducción y ajuste de tonalidades en la pantalla de detalle.

4. **Ticket 4.4: Exportación a PDF y Compartir Himnos**
   - [ ] Investigar y elegir una librería para generación de PDF.
   - [ ] Implementar la función para exportar un himno a PDF.
   - [ ] Agregar funcionalidad para compartir himnos como imágenes (por ejemplo, para WhatsApp).
   - [ ] Validar la legibilidad y calidad del PDF o imagen generada.

5. **Ticket 4.5: Registro de Himnos Mediante Foto (Integración con OCR)**
   - [ ] Investigar servicios de OCR o bibliotecas compatibles.
   - [ ] Diseñar el flujo para capturar la foto, procesarla y extraer texto.
   - [ ] Integrar el proceso para validar y agregar un nuevo himno al catálogo.

6. **Ticket 4.6: Personalización y Pantalla de Inicio**
   - [ ] Crear una pantalla de inicio personalizada que salude al usuario.
   - [ ] Permitir la personalización de temas, fuentes y otros ajustes.
   - [ ] Guardar las preferencias del usuario (por ejemplo, en AsyncStorage).
   - [ ] Probar la persistencia de las opciones de personalización.

---

Esta planificación te proporciona tickets específicos y manejables para cada sprint, permitiéndote avanzar de manera constante y medible. Cada ticket está pensado para que puedas completarlo en una o pocas sesiones de trabajo, y se puede ajustar según avances o surjan nuevos requerimientos. 

¿Te parece adecuado este desglose o necesitas algún ajuste o mayor detalle en alguna de las tareas?
