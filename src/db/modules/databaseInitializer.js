import * as SQLite from "expo-sqlite";
import { Alert, Platform } from "react-native";
import LoggerService from "../../services/LoggerService";
import * as FileSystem from "expo-file-system";
import * as Asset from "expo-asset";
import { 
  DB_NAME, 
  DB_PATH,
  getDatabaseInstance,
  setDatabaseInstance, 
  verifyDatabaseAsset,
  verifyFileSystem 
} from "./databaseUtils";

/**
 * Abre una base de datos existente
 */
async function openExistingDatabase() {
  await LoggerService.debug('Setup', '🔄 Método: Abrir base de datos existente');
  await LoggerService.debug('Setup', '⏳ Iniciando apertura de base de datos...');
  
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await LoggerService.success('Setup', '✅ Base de datos existente abierta correctamente');
    return db;
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error al abrir base de datos existente', error);
    throw error;
  }
}

/**
 * Copia la base de datos desde los assets
 */
async function copyDatabaseFromAssets() {
  await LoggerService.debug('Setup', '📥 Método: Copiar desde assets (primera instalación)');
  await LoggerService.debug('Setup', '⏳ Iniciando copia desde assets...');
  
  try {
    // Verificar que el asset existe
    const assetResult = await verifyDatabaseAsset();
    if (!assetResult.success) {
      throw new Error('Asset de base de datos no disponible para copia');
    }
    
    const db = await SQLite.openDatabaseAsync({
      name: DB_NAME,
      assetSource: require("../../../assets/database/himnario.db"),
    });
    
    await LoggerService.success('Setup', '✅ Base de datos copiada desde assets correctamente');
    return db;
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error al copiar desde assets', error);
    throw error;
  }
}

/**
 * Método alternativo de apertura para manejar errores comunes
 */
async function alternativeOpenDatabase() {
  await LoggerService.debug('Setup', '🔄 Usando método alternativo de apertura');
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Verificar que funcionó
    const result = await db.getFirstAsync("SELECT COUNT(*) as count FROM songs");
    await LoggerService.success('Setup', `✅ Recuperación exitosa. BD contiene ${result.count} canciones`);
    return db;
  } catch (error) {
    await LoggerService.error('Setup', '❌ El intento de recuperación falló', error);
    throw error;
  }
}

/**
 * Verifica que la base de datos tenga la estructura correcta
 */
async function verifyDatabaseIntegrity(db) {
  await LoggerService.info('Setup', '🔍 Verificando instalación de la base de datos');
  
  try {
    // Verificar versión y estructura
    await LoggerService.debug('Setup', '⚙️ Consultando versión y estructura de la base de datos');
    
    // Activar optimizaciones de rendimiento
    await LoggerService.debug('Setup', '⚡ Activando optimizaciones WAL');
    await db.execAsync("PRAGMA journal_mode = WAL;");
    const walMode = await db.getFirstAsync("PRAGMA journal_mode;");
    await LoggerService.debug('Setup', `🧰 Modo journal establecido: ${walMode?.journal_mode || 'Desconocido'}`);
    
    // Verificar esquema de la base de datos
    await LoggerService.debug('Setup', '📊 Verificando esquema de la base de datos');
    const tablesResult = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table';");
    const tables = tablesResult.map(t => t.name).join(", ");
    await LoggerService.debug('Setup', `📋 Tablas encontradas: ${tables}`);
    
    // Verificar tabla songs
    await LoggerService.debug('Setup', '🎵 Verificando tabla songs');
    const songsResult = await db.getFirstAsync("SELECT COUNT(*) as count FROM songs");
    await LoggerService.success('Setup', `✅ Verificación de tabla songs: ${songsResult.count} canciones`);
    
    if (songsResult.count === 0) {
      await LoggerService.warning('Setup', '⚠️ La tabla songs está vacía');
    } else {
      // Verificar estructura de datos para canción de muestra
      const sampleSong = await db.getFirstAsync("SELECT * FROM songs LIMIT 1");
      await LoggerService.debug('Setup', `📝 Estructura de canción de muestra: ${Object.keys(sampleSong).join(", ")}`);
    }
    
    // Verificar tabla categories
    await LoggerService.debug('Setup', '🏷️ Verificando tabla categories');
    const categoriesResult = await db.getFirstAsync("SELECT COUNT(*) as count FROM categories");
    await LoggerService.success('Setup', `✅ Verificación de tabla categories: ${categoriesResult.count} categorías`);
    
    // Verificar una canción específica para asegurarse de que los datos son correctos
    await LoggerService.debug('Setup', '🎯 Verificando canción de muestra');
    const sampleSong = await db.getFirstAsync("SELECT title FROM songs WHERE id = 1");
    await LoggerService.success('Setup', `✅ Verificación de datos: Canción #1 "${sampleSong?.title || 'No encontrada'}"`);
    
    // Verificar la versión de la base de datos
    await LoggerService.debug('Setup', '🔢 Verificando versión de la base de datos');
    const versionResult = await db.getFirstAsync("PRAGMA user_version;");
    await LoggerService.success('Setup', `📊 Versión de la base de datos: ${versionResult?.user_version || 'Desconocida'}`);
    
    return true;
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error al verificar la integridad de la base de datos', error);
    throw new Error(`Error de integridad: ${error.message}`);
  }
}

/**
 * Intenta recuperar la base de datos si ocurrió un error
 */
async function recoverFromDatabaseError(error) {
  if (error.message && error.message.includes('path.replace is not a function')) {
    await LoggerService.error('Setup', '🔄 Error de manejo de rutas en expo-sqlite. Intentando método alternativo...');
    return await alternativeOpenDatabase();
  } 
  
  if (error.message && error.message.includes('no such table')) {
    await LoggerService.error('Setup', '❌ La base de datos existe pero está corrupta o incompleta');
    await LoggerService.info('Setup', '🔄 Intentando reemplazar la base de datos corrupta...');
    
    try {
      // Eliminar la base de datos corrupta y reintentar
      await LoggerService.debug('Setup', '🗑️ Eliminando base de datos corrupta');
      await FileSystem.deleteAsync(DB_PATH);
      await LoggerService.debug('Setup', '✅ Base de datos corrupta eliminada');
      
      // Reintentar creación desde assets
      return await copyDatabaseFromAssets();
    } catch (recreateError) {
      await LoggerService.error('Setup', '❌ Error al recrear la base de datos', recreateError);
      throw new Error(`No se pudo recrear la base de datos: ${recreateError.message}`);
    }
  }
  
  throw error;
}

/**
 * Inicializa la base de datos
 */
export async function initializeDatabase() {
  if (getDatabaseInstance()) {
    await LoggerService.debug('Setup', 'Reutilizando instancia existente de BD');
    return getDatabaseInstance();
  }
  
  try {
    await LoggerService.info('Setup', '🔓 Iniciando inicialización de base de datos');
    
    // Enfoque directo con expo-sqlite que funciona en desarrollo y producción
    let db;
    
    try {
      // Método que funciona en ambos entornos
      db = await SQLite.openDatabaseAsync({
        name: DB_NAME,
        // Importante: esta sintaxis funciona tanto en desarrollo como producción
        assetImportMode: "native",
        assetAsString: true,
        asset: require("../../../assets/database/himnario.db"),
      });
      
      await LoggerService.success('Setup', '✅ Base de datos abierta correctamente');
      
      // Activar optimizaciones WAL
      await db.execAsync("PRAGMA journal_mode = WAL;");
      
      // Verificar que podemos acceder a los datos
      const result = await db.getFirstAsync("SELECT COUNT(*) as count FROM songs");
      await LoggerService.success('Setup', `📊 Base de datos contiene ${result.count} canciones`);
      
      // Guardar la instancia
      setDatabaseInstance(db);
      return db;
    } catch (error) {
      await LoggerService.error('Setup', '❌ Error al abrir la base de datos', error);
      
      // Si es el error específico de path.replace, intentar con método alternativo
      if (error.message && error.message.includes('path.replace')) {
        await LoggerService.debug('Setup', '⚠️ Intentando método alternativo de inicialización...');
        
        try {
          // En Android podemos intentar copiar manualmente el archivo
          if (Platform.OS === 'android') {
            // Obtenemos referencia al asset
            const asset = Asset.Asset.fromModule(require("../../../assets/database/himnario.db"));
            await asset.downloadAsync();
            
            // Definimos las rutas
            const dbDir = `${FileSystem.documentDirectory}SQLite`;
            const dbPath = `${dbDir}/${DB_NAME}`;
            
            // Crear directorio si no existe
            const dirInfo = await FileSystem.getInfoAsync(dbDir);
            if (!dirInfo.exists) {
              await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
            }
            
            // Copiar archivo desde asset
            await FileSystem.copyAsync({
              from: asset.localUri,
              to: dbPath
            });
            
            // Abrir base de datos copiada
            db = await SQLite.openDatabaseAsync(DB_NAME);
            
            await LoggerService.success('Setup', '✅ Base de datos copiada y abierta manualmente');
            setDatabaseInstance(db);
            return db;
          } else {
            throw new Error('No se pudo abrir la base de datos en esta plataforma');
          }
        } catch (alternativeError) {
          await LoggerService.error('Setup', '❌ Error en método alternativo', alternativeError);
          throw alternativeError;
        }
      }
      
      throw error;
    }
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error general en inicialización de la base de datos', error);
    throw error;
  }
}