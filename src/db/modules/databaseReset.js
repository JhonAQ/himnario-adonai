import * as FileSystem from 'expo-file-system';
import LoggerService from "../../services/LoggerService";
import { 
  DB_NAME, 
  DB_DIR, 
  DB_PATH,
  setDatabaseInstance 
} from "./databaseUtils";

/**
 * Elimina la base de datos para simular una primera instalación
 */
export async function resetDatabase() {
  await LoggerService.info('Reset', '🗑️ Iniciando reseteo de la base de datos');
  
  try {
    // Liberar la instancia actual
    setDatabaseInstance(null);
    
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