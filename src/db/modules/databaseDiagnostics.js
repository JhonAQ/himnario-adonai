import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';
import LoggerService from "../../services/LoggerService";
import { DB_NAME, DB_DIR } from "./databaseUtils";
import { initializeDatabase } from "./databaseInitializer";

/**
 * Verifica el estado del sistema de archivos
 */
async function checkFileSystem() {
  await LoggerService.info('Diagnostics', '📁 Verificando sistema de archivos');
  
  try {
    const dbDirectory = DB_DIR;
    const dbPath = dbDirectory + DB_NAME;
    
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
          if (file.includes(DB_NAME)) {
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
      const asset = Asset.Asset.fromModule(require("../../../assets/database/himnario.db"));
      await asset.downloadAsync();
      await LoggerService.debug('Diagnostics', `📦 Asset original: ${asset.downloaded ? 'Disponible ✓' : 'No disponible ✗'} (${asset.fileSize || 0} bytes)`);
    } catch (assetErr) {
      await LoggerService.warning('Diagnostics', '⚠️ No se pudo verificar asset original', assetErr);
    }
    
  } catch (fsError) {
    await LoggerService.error('Diagnostics', '❌ Error al verificar archivos', fsError);
  }
}

/**
 * Verifica la conexión y estructura de la base de datos
 */
async function checkDatabaseStructure() {
  await LoggerService.info('Diagnostics', '🔌 Verificando conexión a base de datos');
  
  try {
    // Intentar obtener instancia
    await LoggerService.debug('Diagnostics', '⏳ Obteniendo instancia de base de datos...');
    const db = await initializeDatabase();
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
}

/**
 * Ejecuta un diagnóstico completo de la base de datos
 */
export async function runDatabaseDiagnostics() {
  await LoggerService.info('Diagnostics', '🔍 Iniciando diagnóstico completo de la base de datos');
  
  try {
    // Verificar sistema de archivos
    await checkFileSystem();
    
    // Verificar estructura de base de datos
    await checkDatabaseStructure();
    
    await LoggerService.info('Diagnostics', '✅ Diagnóstico completo');
    
    return await LoggerService.getLogs();
  } catch (error) {
    await LoggerService.error('Diagnostics', '❌ Error general en diagnóstico', error);
    return await LoggerService.getLogs();
  }
}