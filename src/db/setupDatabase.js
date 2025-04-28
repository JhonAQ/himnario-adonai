import * as SQLite from "expo-sqlite";
import { Alert, Platform } from "react-native";
import LoggerService from "../services/LoggerService";
import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';

// Variable global para la base de datos
let databaseInstance = null;

/**
 * Realiza la configuración y apertura de la base de datos
 */
export async function setupDatabase() {
  await LoggerService.info('Setup', '🚀 Iniciando proceso setupDatabase()');
  
  // PASO 1: VERIFICAR SI YA EXISTE UNA INSTANCIA
  if (databaseInstance) {
    await LoggerService.debug('Setup', 'Reutilizando instancia existente de BD');
    return databaseInstance;
  }

  const DB_NAME = "himnario.db";
  const DB_DIR = FileSystem.documentDirectory + 'SQLite/';
  const DB_PATH = DB_DIR + DB_NAME;
  
  await LoggerService.debug('Setup', `Base de datos: ${DB_NAME}`);
  await LoggerService.debug('Setup', `Ruta de BD: ${DB_PATH}`);
  await LoggerService.debug('Setup', `Plataforma: ${Platform.OS}, Modo desarrollo: ${__DEV__}`);

  try {
    // PASO 2: VERIFICAR ASSET DE BASE DE DATOS
    await LoggerService.info('Setup', '📦 Verificando assets de base de datos');
    try {
      // Verificar si el asset existe
      const asset = Asset.Asset.fromModule(require("../../assets/database/himnario.db"));
      await asset.downloadAsync();
      
      if (asset.downloaded) {
        await LoggerService.success('Setup', `Asset de base de datos encontrado: ${asset.name} (${asset.type})`);
        await LoggerService.debug('Setup', `Tamaño del asset: ${asset.fileSize} bytes`);
        await LoggerService.debug('Setup', `Localización del asset: ${asset.localUri || 'Desconocida'}`);
      } else {
        await LoggerService.error('Setup', '❌ El asset de base de datos no se pudo descargar');
      }
    } catch (assetError) {
      await LoggerService.error('Setup', '❌ Error al verificar el asset de la base de datos', assetError);
    }

    // PASO 3: VERIFICAR DIRECTORIO Y ARCHIVOS
    await LoggerService.info('Setup', '📁 Verificando existencia de directorios y archivos');
    
    // Verificar si el directorio SQLite existe
    const dirInfo = await FileSystem.getInfoAsync(DB_DIR);
    await LoggerService.debug('Setup', `Directorio SQLite ${dirInfo.exists ? 'existe ✓' : 'no existe ✗'}`);
    
    // Si no existe el directorio, crearlo
    if (!dirInfo.exists) {
      await LoggerService.debug('Setup', '🔨 Creando directorio SQLite...');
      await FileSystem.makeDirectoryAsync(DB_DIR, { intermediates: true });
      await LoggerService.success('Setup', '✅ Directorio SQLite creado correctamente');
    }

    // Verificar si la base de datos existe
    const dbInfo = await FileSystem.getInfoAsync(DB_PATH);
    await LoggerService.debug('Setup', `Archivo de base de datos ${dbInfo.exists ? 'existe ✓' : 'no existe ✗'}`);
    
    if (dbInfo.exists) {
      await LoggerService.debug('Setup', `📏 Tamaño del archivo: ${dbInfo.size} bytes`);
      await LoggerService.debug('Setup', `📅 Modificado: ${new Date(dbInfo.modificationTime || 0).toLocaleString()}`);
    } else {
      await LoggerService.debug('Setup', '⚠️ No se encontró archivo de base de datos, será necesario copiar desde assets');
    }

    // Si existe la base de datos, listar los archivos relacionados
    if (dirInfo.exists) {
      try {
        const files = await FileSystem.readDirectoryAsync(DB_DIR);
        await LoggerService.debug('Setup', `📋 Archivos en SQLite: ${files.join(', ')}`);
        
        // Verificar archivos relacionados (WAL, SHM)
        for (const file of files) {
          if (file.includes(DB_NAME)) {
            const fileInfo = await FileSystem.getInfoAsync(DB_DIR + file);
            await LoggerService.debug('Setup', `📄 ${file}: ${fileInfo.exists ? fileInfo.size + ' bytes' : 'No existe'}`);
          }
        }
      } catch (readErr) {
        await LoggerService.warning('Setup', '⚠️ No se pudieron leer los archivos del directorio', readErr);
      }
    }
    
    // PASO 4: ABRIR O COPIAR BASE DE DATOS
    try {
      await LoggerService.info('Setup', '🔓 Intentando abrir la base de datos');
      
      if (dbInfo.exists) {
        // Abrir la base de datos existente
        await LoggerService.debug('Setup', '🔄 Método: Abrir base de datos existente');
        await LoggerService.debug('Setup', '⏳ Iniciando apertura de base de datos...');
        
        databaseInstance = await SQLite.openDatabaseAsync(DB_NAME);
        await LoggerService.success('Setup', '✅ Base de datos existente abierta correctamente');
      } else {
        // Copiar desde assets
        await LoggerService.debug('Setup', '📥 Método: Copiar desde assets (primera instalación)');
        await LoggerService.debug('Setup', '⏳ Iniciando copia desde assets...');
        
        try {
          databaseInstance = await SQLite.openDatabaseAsync({
            name: DB_NAME,
            assetSource: require("../../assets/database/himnario.db"),
          });
          
          // Verificar si se copió correctamente
          const newDbInfo = await FileSystem.getInfoAsync(DB_PATH);
          if (newDbInfo.exists) {
            await LoggerService.success('Setup', `✅ Base de datos copiada desde assets correctamente (${newDbInfo.size} bytes)`);
          } else {
            await LoggerService.warning('Setup', '⚠️ Se abrió la base de datos pero no se encontró el archivo en el sistema');
          }
        } catch (copyError) {
          await LoggerService.error('Setup', '❌ Error al copiar desde assets', copyError);
          throw copyError;
        }
      }

      // PASO 5: VERIFICAR INTEGRIDAD
      await LoggerService.info('Setup', '🔍 Verificando instalación de la base de datos');
      
      // Verificar versión y estructura
      await LoggerService.debug('Setup', '⚙️ Consultando versión y estructura de la base de datos');
      
      // Activar optimizaciones de rendimiento
      await LoggerService.debug('Setup', '⚡ Activando optimizaciones WAL');
      await databaseInstance.execAsync("PRAGMA journal_mode = WAL;");
      const walMode = await databaseInstance.getFirstAsync("PRAGMA journal_mode;");
      await LoggerService.debug('Setup', `🧰 Modo journal establecido: ${walMode?.journal_mode || 'Desconocido'}`);
      
      // Verificar esquema de la base de datos
      await LoggerService.debug('Setup', '📊 Verificando esquema de la base de datos');
      const tablesResult = await databaseInstance.getAllAsync("SELECT name FROM sqlite_master WHERE type='table';");
      const tables = tablesResult.map(t => t.name).join(", ");
      await LoggerService.debug('Setup', `📋 Tablas encontradas: ${tables}`);
      
      // Verificar tabla songs
      try {
        await LoggerService.debug('Setup', '🎵 Verificando tabla songs');
        const songsResult = await databaseInstance.getFirstAsync("SELECT COUNT(*) as count FROM songs");
        await LoggerService.success('Setup', `✅ Verificación de tabla songs: ${songsResult.count} canciones`);
        
        if (songsResult.count === 0) {
          await LoggerService.warning('Setup', '⚠️ La tabla songs está vacía');
        } else {
          // Verificar estructura de datos para canción de muestra
          const sampleSong = await databaseInstance.getFirstAsync("SELECT * FROM songs LIMIT 1");
          await LoggerService.debug('Setup', `📝 Estructura de canción de muestra: ${Object.keys(sampleSong).join(", ")}`);
        }
        
        // Verificar tabla categories
        await LoggerService.debug('Setup', '🏷️ Verificando tabla categories');
        const categoriesResult = await databaseInstance.getFirstAsync("SELECT COUNT(*) as count FROM categories");
        await LoggerService.success('Setup', `✅ Verificación de tabla categories: ${categoriesResult.count} categorías`);
        
        // Verificar una canción específica para asegurarse de que los datos son correctos
        await LoggerService.debug('Setup', '🎯 Verificando canción de muestra');
        const sampleSong = await databaseInstance.getFirstAsync("SELECT title FROM songs WHERE id = 1");
        await LoggerService.success('Setup', `✅ Verificación de datos: Canción #1 "${sampleSong?.title || 'No encontrada'}"`);
        
        // Verificar la versión de la base de datos
        await LoggerService.debug('Setup', '🔢 Verificando versión de la base de datos');
        const versionResult = await databaseInstance.getFirstAsync("PRAGMA user_version;");
        await LoggerService.success('Setup', `📊 Versión de la base de datos: ${versionResult?.user_version || 'Desconocida'}`);
        
        // Verificar rendimiento
        await LoggerService.debug('Setup', '⚡ Realizando prueba de rendimiento básica');
        const startTime = Date.now();
        await databaseInstance.getAllAsync("SELECT id, title FROM songs LIMIT 10");
        const endTime = Date.now();
        await LoggerService.debug('Setup', `⏱️ Consulta de prueba completada en ${endTime - startTime}ms`);
        
      } catch (verifyError) {
        await LoggerService.error('Setup', '❌ Error al verificar la integridad de la base de datos', verifyError);
        throw new Error(`Error de integridad: ${verifyError.message}`);
      }
      
      await LoggerService.success('Setup', '✅ Proceso de setupDatabase() completado exitosamente');
      return databaseInstance;
    } catch (openError) {
      await LoggerService.error('Setup', '❌ Error al abrir la base de datos', openError);
      
      // PASO 6: MANEJO DE ERRORES ESPECÍFICOS
      
      // Manejo específico de errores conocidos
      if (openError.message && openError.message.includes('path.replace is not a function')) {
        await LoggerService.error('Setup', '🔄 Error de manejo de rutas en expo-sqlite. Intentando método alternativo...');
        
        try {
          // Intento alternativo sin assetSource
          await LoggerService.debug('Setup', '🔄 Usando método alternativo de apertura');
          databaseInstance = await SQLite.openDatabaseAsync(DB_NAME);
          
          // Verificar que funcionó
          const result = await databaseInstance.getFirstAsync("SELECT COUNT(*) as count FROM songs");
          await LoggerService.success('Setup', `✅ Recuperación exitosa. BD contiene ${result.count} canciones`);
          return databaseInstance;
        } catch (recoveryError) {
          await LoggerService.error('Setup', '❌ El intento de recuperación falló', recoveryError);
          throw recoveryError;
        }
      } 
      
      // Error de tabla no existente
      if (openError.message && openError.message.includes('no such table')) {
        await LoggerService.error('Setup', '❌ La base de datos existe pero está corrupta o incompleta');
        await LoggerService.info('Setup', '🔄 Intentando reemplazar la base de datos corrupta...');
        
        try {
          // Eliminar la base de datos corrupta y reintentar
          await LoggerService.debug('Setup', '🗑️ Eliminando base de datos corrupta');
          await FileSystem.deleteAsync(DB_PATH);
          await LoggerService.debug('Setup', '✅ Base de datos corrupta eliminada');
          
          // Eliminar archivos relacionados
          try {
            await FileSystem.deleteAsync(DB_PATH + '-wal');
            await LoggerService.debug('Setup', '✅ Archivo WAL eliminado');
          } catch (e) { /* ignorar */ }
          
          try {
            await FileSystem.deleteAsync(DB_PATH + '-shm');
            await LoggerService.debug('Setup', '✅ Archivo SHM eliminado');
          } catch (e) { /* ignorar */ }
          
          // Reintentar creación desde assets
          await LoggerService.debug('Setup', '📥 Reintentando copia desde assets');
          databaseInstance = await SQLite.openDatabaseAsync({
            name: DB_NAME,
            assetSource: require("../../assets/database/himnario.db"),
          });
          
          const count = await databaseInstance.getFirstAsync("SELECT COUNT(*) as count FROM songs");
          await LoggerService.success('Setup', `✅ Base de datos regenerada con éxito. Contiene ${count.count} canciones`);
          return databaseInstance;
        } catch (recreateError) {
          await LoggerService.error('Setup', '❌ Error al recrear la base de datos', recreateError);
          throw new Error(`No se pudo recrear la base de datos: ${recreateError.message}`);
        }
      }
      
      throw openError;
    }
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error general en setupDatabase', error);
    
    // En una app de producción, mostrar un error al usuario
    if (Platform.OS !== "web" && !__DEV__) {
      setTimeout(() => {
        Alert.alert(
          "Error al iniciar",
          "No se pudo cargar la base de datos de himnos. Por favor reinstale la aplicación o contacte a soporte.",
          [{ text: "OK" }]
        );
      }, 1000);
    }
    
    throw error;
  }
}

/**
 * Elimina la base de datos para simular una primera instalación
 */
export async function resetDatabase() {
  const DB_NAME = "himnario.db";
  const DB_DIR = FileSystem.documentDirectory + 'SQLite/';
  const DB_PATH = DB_DIR + DB_NAME;
  
  await LoggerService.info('Reset', '🗑️ Iniciando reseteo de la base de datos');
  
  try {
    // Liberar la instancia actual
    databaseInstance = null;
    
    // Verificar si existe la base de datos
    const dbInfo = await FileSystem.getInfoAsync(DB_PATH);
    await LoggerService.debug('Reset', `📄 Archivo de base de datos ${dbInfo.exists ? 'existe ✓' : 'no existe ✗'}`);
    
    if (dbInfo.exists) {
      // Eliminar archivos de la base de datos
      await LoggerService.debug('Reset', `🗑️ Eliminando ${DB_PATH}`);
      await FileSystem.deleteAsync(DB_PATH);
      await LoggerService.debug('Reset', `✅ Archivo principal eliminado`);
      
      // Eliminar también archivos de WAL si existen
      try {
        await FileSystem.deleteAsync(DB_PATH + '-wal');
        await LoggerService.debug('Reset', '✅ Archivo WAL eliminado');
      } catch (e) {
        await LoggerService.debug('Reset', '⚠️ No se encontró archivo WAL para eliminar');
      }
      
      try {
        await FileSystem.deleteAsync(DB_PATH + '-shm');
        await LoggerService.debug('Reset', '✅ Archivo SHM eliminado');
      } catch (e) {
        await LoggerService.debug('Reset', '⚠️ No se encontró archivo SHM para eliminar');
      }
      
      await LoggerService.success('Reset', '✅ Base de datos eliminada correctamente');
    } else {
      await LoggerService.warning('Reset', '⚠️ La base de datos no existe, no hay nada que eliminar');
    }
    
    return true;
  } catch (error) {
    await LoggerService.error('Reset', '❌ Error al resetear la base de datos', error);
    throw error;
  }
}

/**
 * Realiza diagnósticos completos de la base de datos
 */
export async function runDatabaseDiagnostics() {
  await LoggerService.info('Diagnostics', '🔍 Iniciando diagnóstico completo de la base de datos');
  
  try {
    // PASO 1: VERIFICAR ESTADO DEL SISTEMA DE ARCHIVOS
    await LoggerService.info('Diagnostics', '📁 Verificando sistema de archivos');
    
    try {
      const dbDirectory = FileSystem.documentDirectory + 'SQLite/';
      const dbPath = dbDirectory + 'himnario.db';
      
      // Verificar directorio
      const dirInfo = await FileSystem.getInfoAsync(dbDirectory);
      await LoggerService.debug('Diagnostics', `📁 Directorio SQLite: ${dirInfo.exists ? 'Existe ✓' : 'No existe ✗'}`);
      
      // Verificar espacio disponible
      try {
        const freeSpace = await FileSystem.getFreeDiskStorageAsync();
        await LoggerService.debug('Diagnostics', `💾 Espacio libre en almacenamiento: ${Math.round(freeSpace / (1024 * 1024))} MB`);
      } catch (spaceErr) {
        await LoggerService.debug('Diagnostics', '⚠️ No se pudo determinar el espacio libre');
      }
      
      // Listar archivos en el directorio
      if (dirInfo.exists) {
        try {
          const files = await FileSystem.readDirectoryAsync(dbDirectory);
          await LoggerService.debug('Diagnostics', `📂 Archivos en directorio SQLite: ${files.join(', ')}`);
          
          // Verificar cada archivo relacionado con la base de datos
          for (const file of files) {
            if (file.includes('himnario.db')) {
              const fileInfo = await FileSystem.getInfoAsync(dbDirectory + file);
              await LoggerService.debug('Diagnostics', 
                `📄 ${file}: ${fileInfo.exists ? fileInfo.size + ' bytes' : 'No existe'} (${new Date(fileInfo.modificationTime || 0).toLocaleString()})`
              );
            }
          }
        } catch (readError) {
          await LoggerService.error('Diagnostics', '❌ No se pudo leer directorio', readError);
        }
      }
      
      // Verificar archivo principal de la base de datos
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      await LoggerService.debug('Diagnostics', 
        `📄 Archivo de base de datos: ${fileInfo.exists ? 'Existe ✓' : 'No existe ✗'}` +
        (fileInfo.exists ? `, Tamaño: ${fileInfo.size} bytes` : '')
      );
      
      // Verificar asset original
      try {
        const asset = Asset.Asset.fromModule(require("../../assets/database/himnario.db"));
        await asset.downloadAsync();
        await LoggerService.debug('Diagnostics', `📦 Asset original: ${asset.downloaded ? 'Disponible ✓' : 'No disponible ✗'} (${asset.fileSize || 0} bytes)`);
      } catch (assetErr) {
        await LoggerService.warning('Diagnostics', '⚠️ No se pudo verificar asset original', assetErr);
      }
      
    } catch (fsError) {
      await LoggerService.error('Diagnostics', '❌ Error al verificar archivos', fsError);
    }
    
    // PASO 2: PROBAR CONEXIÓN Y ESTRUCTURA
    await LoggerService.info('Diagnostics', '🔌 Verificando conexión a base de datos');
    
    try {
      // Intentar obtener instancia
      await LoggerService.debug('Diagnostics', '⏳ Obteniendo instancia de base de datos...');
      const db = await setupDatabase();
      await LoggerService.success('Diagnostics', '✅ Conexión a base de datos establecida');
      
      // Verificar modo journal
      const journalMode = await db.getFirstAsync("PRAGMA journal_mode;");
      await LoggerService.debug('Diagnostics', `🧰 Modo journal: ${journalMode?.journal_mode || 'Desconocido'}`);
      
      // Verificar versión
      const version = await db.getFirstAsync("PRAGMA user_version;");
      await LoggerService.debug('Diagnostics', `🔢 Versión de la base de datos: ${version?.user_version || 'Desconocida'}`);
      
      // Verificar integridad de la base de datos
      await LoggerService.debug('Diagnostics', '🔍 Ejecutando verificación de integridad...');
      const integrity = await db.getFirstAsync("PRAGMA integrity_check;");
      await LoggerService.debug('Diagnostics', `🛡️ Verificación de integridad: ${integrity?.integrity_check || 'Desconocida'}`);
      
      // Verificar tablas
      await LoggerService.debug('Diagnostics', '📊 Verificando estructura de tablas...');
      const tablesResult = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      const tables = tablesResult.map(row => row.name).join(", ");
      await LoggerService.success('Diagnostics', `📋 Tablas en la base de datos: ${tables}`);
      
      // Verificar recuentos de tabla
      try {
        const songsCount = await db.getFirstAsync("SELECT COUNT(*) as count FROM songs");
        await LoggerService.success('Diagnostics', `🎵 Cantidad de canciones: ${songsCount.count}`);
        
        // Verificar distribución de tamaños de versos
        const verseSizes = await db.getAllAsync("SELECT id, length(verses) as size FROM songs ORDER BY size DESC LIMIT 3");
        await LoggerService.debug('Diagnostics', `📏 Tamaños de versos (mayores): ${verseSizes.map(v => `ID=${v.id}: ${Math.round(v.size/1024)}KB`).join(', ')}`);
        
        const categoriesCount = await db.getFirstAsync("SELECT COUNT(*) as count FROM categories");
        await LoggerService.success('Diagnostics', `🏷️ Cantidad de categorías: ${categoriesCount.count}`);
        
        // Verificar asociaciones
        const songCategoriesCount = await db.getFirstAsync("SELECT COUNT(*) as count FROM song_categories");
        await LoggerService.debug('Diagnostics', `🔗 Relaciones canción-categoría: ${songCategoriesCount.count}`);
        
        // Verificar canción específica
        const songDetails = await db.getFirstAsync("SELECT title, verses FROM songs WHERE id = 1");
        if (songDetails) {
          await LoggerService.debug('Diagnostics', `🎯 Canción ID=1: "${songDetails.title}" (${songDetails.verses ? `${songDetails.verses.length} bytes` : 'sin datos'})`);
        } else {
          await LoggerService.warning('Diagnostics', '⚠️ No se pudo encontrar la canción ID=1');
        }
        
      } catch (countError) {
        await LoggerService.error('Diagnostics', '❌ Error al contar registros', countError);
      }
      
      // Verificar rendimiento básico
      try {
        await LoggerService.debug('Diagnostics', '⚡ Ejecutando prueba de rendimiento básica...');
        const startTime = Date.now();
        await db.getAllAsync("SELECT * FROM songs LIMIT 20");
        const endTime = Date.now();
        await LoggerService.debug('Diagnostics', `⏱️ Consulta de 20 canciones completada en ${endTime - startTime}ms`);
      } catch (perfError) {
        await LoggerService.warning('Diagnostics', '⚠️ Error en prueba de rendimiento', perfError);
      }
      
    } catch (dbError) {
      await LoggerService.error('Diagnostics', '❌ Falló la conexión a la base de datos', dbError);
    }
    
    await LoggerService.info('Diagnostics', '✅ Diagnóstico completo');
    
    return await LoggerService.getLogs();
  } catch (error) {
    await LoggerService.error('Diagnostics', '❌ Error general en diagnóstico', error);
    return await LoggerService.getLogs();
  }
}