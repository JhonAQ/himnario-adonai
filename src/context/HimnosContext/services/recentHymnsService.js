import AsyncStorage from '@react-native-async-storage/async-storage';
import LoggerService from '../../../services/LoggerService';

const RECENT_HYMNS_KEY = '@HimnarioRecentHymns';
const MAX_RECENT_HYMNS = 10;

/**
 * Carga los IDs de himnos vistos recientemente
 */
export async function loadRecentHymns() {
  try {
    const stored = await AsyncStorage.getItem(RECENT_HYMNS_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed;
  } catch (error) {
    await LoggerService.error('RecentHymns', 'Error al cargar himnos recientes', error);
    return [];
  }
}

/**
 * Guarda los IDs de himnos vistos recientemente
 */
export async function saveRecentHymns(hymnsIds) {
  try {
    if (!Array.isArray(hymnsIds)) {
      throw new Error('El parámetro no es un array');
    }
    
    await AsyncStorage.setItem(RECENT_HYMNS_KEY, JSON.stringify(hymnsIds.slice(0, MAX_RECENT_HYMNS)));
    return true;
  } catch (error) {
    await LoggerService.error('RecentHymns', 'Error al guardar himnos recientes', error);
    return false;
  }
}

/**
 * Añade un himno a la lista de vistos recientemente
 */
export async function addToRecentHymns(id, currentIds = []) {
  try {
    const idString = id.toString();
    
    // Filtrar el ID actual si ya existe
    const filtered = currentIds.filter(item => item !== idString);
    
    // Añadir al principio y limitar cantidad
    const newIds = [idString, ...filtered].slice(0, MAX_RECENT_HYMNS);
    
    // Guardar en AsyncStorage
    await saveRecentHymns(newIds);
    
    return newIds;
  } catch (error) {
    await LoggerService.error('RecentHymns', 'Error al añadir himno reciente', error);
    return currentIds;
  }
}

/**
 * Limpia la lista de himnos recientes
 */
export async function clearRecentHymns() {
  try {
    await AsyncStorage.removeItem(RECENT_HYMNS_KEY);
    return true;
  } catch (error) {
    await LoggerService.error('RecentHymns', 'Error al limpiar himnos recientes', error);
    return false;
  }
}