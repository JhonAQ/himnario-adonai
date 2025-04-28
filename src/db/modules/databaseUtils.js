import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';
import LoggerService from "../../services/LoggerService";

/**
 * Constantes de base de datos
 */
export const DB_NAME = "himnario.db";
export const DB_DIR = FileSystem.documentDirectory + 'SQLite/';
export const DB_PATH = DB_DIR + DB_NAME;

// Variable global para la base de datos
let databaseInstance = null;

/**
 * Retorna la instancia de base de datos si existe
 */
export function getDatabaseInstance() {
  return databaseInstance;
}

/**
 * Establece la instancia global de la base de datos
 */
export function setDatabaseInstance(instance) {
  databaseInstance = instance;
  return databaseInstance;
}

/**
 * Verifica si el asset de la base de datos existe y está disponible
 */
export async function verifyDatabaseAsset() {
  try {
    // Verificar si el asset existe
    const asset = Asset.Asset.fromModule(require("../../../assets/database/himnario.db"));
    await asset.downloadAsync();
    
    if (asset.downloaded) {
      await LoggerService.success('Setup', `Asset de base de datos encontrado: ${asset.name} (${asset.type})`);
      await LoggerService.debug('Setup', `Tamaño del asset: ${asset.fileSize || 'desconocido'} bytes`);
      await LoggerService.debug('Setup', `Localización del asset: ${asset.localUri || 'Desconocida'}`);
      return {
        success: true,
        asset
      };
    } else {
      await LoggerService.error('Setup', '❌ El asset de base de datos no se pudo descargar');
      return {
        success: false,
        error: 'No se pudo descargar el asset'
      };
    }
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error al verificar el asset de la base de datos', error);
    return {
      success: false,
      error
    };
  }
}

/**
 * Verifica el sistema de archivos para la base de datos
 */
export async function verifyFileSystem() {
  try {
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
    
    return {
      dirExists: dirInfo.exists,
      dbExists: dbInfo.exists,
      dbInfo
    };
  } catch (error) {
    await LoggerService.error('Setup', '❌ Error al verificar el sistema de archivos', error);
    throw error;
  }
}