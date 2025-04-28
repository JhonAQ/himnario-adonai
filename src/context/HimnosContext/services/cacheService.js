import AsyncStorage from '@react-native-async-storage/async-storage';
import LoggerService from '../../../services/LoggerService';

const CACHE_KEY = 'himnosMetadata';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Guarda datos en caché con timestamp
 */
export async function saveToCache(data) {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    return true;
  } catch (error) {
    await LoggerService.error('Cache', 'Error al guardar en caché', error);
    return false;
  }
}

/**
 * Recupera datos de caché, verificando que no hayan expirado
 */
export async function getFromCache() {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    
    if (!cachedData) {
      await LoggerService.debug('Cache', 'No hay datos en caché');
      return null;
    }
    
    const { data, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    if (isExpired) {
      await LoggerService.debug('Cache', 'Datos en caché expirados');
      return null;
    }
    
    if (!Array.isArray(data) || data.length === 0) {
      await LoggerService.warning('Cache', 'Datos en caché inválidos');
      return null;
    }
    
    await LoggerService.info('Cache', `Usando datos en caché (${data.length} himnos)`);
    return data;
  } catch (error) {
    await LoggerService.error('Cache', 'Error al leer caché', error);
    return null;
  }
}

/**
 * Elimina los datos de la caché
 */
export async function clearCache() {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await LoggerService.success('Cache', 'Caché eliminada');
    return true;
  } catch (error) {
    await LoggerService.error('Cache', 'Error al limpiar caché', error);
    return false;
  }
}