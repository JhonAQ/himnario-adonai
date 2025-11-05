# Himnario Adonai

> [!IMPORTANT]
> ✨ **Nueva versión web con Next.js** ✨
> 
> El proyecto ha sido migrado exitosamente a Next.js para despliegue web. 
> La aplicación está lista para producción y puede ser desplegada en Vercel, Netlify, o cualquier plataforma de hosting estático.
>
> 📱 **Versión móvil**: El código original de React Native/Expo se mantiene para desarrollo móvil futuro.

## Descripción
Himnario Adonai es una aplicación web que facilita el acceso a los himnos del grupo cristiano 'Adonai'. Los usuarios pueden explorar la base de datos de himnos, buscar por número o título, y acceder a los contenidos de forma rápida y eficiente.

La aplicación está optimizada para ser rápida, ligera y fácil de usar, con un enfoque en la experiencia del usuario.

## Características Principales
- **Explorar Himnos**: Accede a un índice completo de himnos
- **Búsqueda Rápida**: Busca himnos por número o título
- **Base de Datos Local**: Funciona completamente en el navegador sin necesidad de backend
- **Diseño Moderno**: Interfaz limpia y responsive
- **Optimizado para Web**: Carga rápida y rendimiento óptimo

## Tecnologías Utilizadas
- **Next.js 15** - Framework React para aplicaciones web
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **SQL.js** - SQLite en el navegador
- **Vercel** - Plataforma de despliegue recomendada

## Instalación y Desarrollo

### Para desarrollo web (Next.js)

1. Clona este repositorio:
    ```bash
    git clone https://github.com/JhonAQ/himnario-adonai.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd himnario-adonai
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
5. Abre tu navegador en `http://localhost:3000`

### Para desarrollo móvil (Expo/React Native)

1. Instala las dependencias:
    ```bash
    npm install
    ```
2. Inicia Expo:
    ```bash
    npm run expo:start
    ```
3. Sigue las instrucciones de Expo para ejecutar en Android/iOS

## Despliegue

Para instrucciones detalladas de despliegue, consulta [DEPLOYMENT.md](./DEPLOYMENT.md).

### Despliegue Rápido en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js y configurará el build
3. Tu aplicación estará en línea en minutos

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo Next.js
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run expo:start` - Inicia Expo para desarrollo móvil
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS

## Contribuciones
¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

## Contacto
Para cualquier consulta o sugerencia, por favor contacta a [dev.dczel@gmail.com](mailto:dev.dczel@gmail.com).
