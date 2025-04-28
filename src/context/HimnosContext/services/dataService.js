import { getAllHymnsMetadata, getHymnById } from '../../../db/databaseService';
import LoggerService from '../../../services/LoggerService';
import { saveToCache, getFromCache, clearCache } from './cacheService';

/**
 * Carga metadata de himnos desde la base de datos o caché
 */
export async function loadHymnsMetadata(db) {
  if (!db) {
    await LoggerService.warning('DataService', 'Base de datos no disponible');
    return null;
  }

  try {
    // Intentar obtener de caché primero
    const cachedData = await getFromCache();
    if (cachedData) {
      return cachedData;
    }
    
    // Si no hay caché, cargar de la base de datos
    await LoggerService.info('DataService', 'Cargando datos frescos desde la base de datos');
    const metadata = await getAllHymnsMetadata(db);
    
    if (Array.isArray(metadata) && metadata.length > 0) {
      await LoggerService.success('DataService', `Datos cargados exitosamente: ${metadata.length} himnos`);
      
      // Guardar en caché para uso futuro
      await saveToCache(metadata);
      
      return metadata;
    } else {
      await LoggerService.error('DataService', `Datos inválidos o vacíos recibidos: ${JSON.stringify(metadata)}`);
      return null;
    }
  } catch (error) {
    await LoggerService.error('DataService', 'Error al cargar metadata de himnos', error);
    throw error;
  }
}

/**
 * Obtiene un himno completo por ID
 */
export async function fetchHymnById(db, id) {
  if (!db) {
    await LoggerService.warning('DataService', 'Base de datos no disponible');
    return null;
  }
  
  try {
    const hymn = await getHymnById(db, id);
    if (hymn) {
      await LoggerService.debug('DataService', `Himno #${id} cargado correctamente`);
    } else {
      await LoggerService.warning('DataService', `Himno #${id} no encontrado`);
    }
    return hymn;
  } catch (error) {
    await LoggerService.error('DataService', `Error al cargar himno #${id}`, error);
    return null;
  }
}

/**
 * Fuerza una recarga limpia de los datos 
 */
export async function reloadData(db, setMetadata) {
  try {
    // Limpiar caché
    await clearCache();
    
    // Cargar datos frescos
    const metadata = await getAllHymnsMetadata(db);
    
    if (Array.isArray(metadata) && metadata.length > 0) {
      // Actualizar estado con los nuevos datos
      setMetadata(metadata);
      
      // Guardar nuevamente en caché
      await saveToCache(metadata);
      
      await LoggerService.success('DataService', `Recarga exitosa: ${metadata.length} himnos cargados`);
      return true;
    } else {
      await LoggerService.error('DataService', 'La recarga no obtuvo datos válidos');
      return false;
    }
  } catch (error) {
    await LoggerService.error('DataService', 'Error al recargar datos', error);
    throw error;
  }
}

/**
 * Obtener himnos por IDs
 */
export function getHymnsByIds(metaHimnos, ids) {
  if (!metaHimnos || !ids) return [];
  
  const idsArray = Array.isArray(ids) ? ids : [ids];
  const idSet = new Set(idsArray.map(id => String(id)));
  
  return metaHimnos.filter(hymn => idSet.has(String(hymn.id)));
}