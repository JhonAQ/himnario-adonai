import { searchHymnContent } from '../../../db/databaseService';
import LoggerService from '../../../services/LoggerService';

/**
 * Busca himnos por número
 */
export function searchByNumber(himnos, query) {
  if (!himnos || !query) return [];
  
  return himnos.filter(
    hymn => hymn.number && hymn.number.toString() === query
  );
}

/**
 * Busca himnos por título
 */
export function searchByTitle(himnos, query) {
  if (!himnos || !query) return [];
  
  return himnos.filter(
    hymn => hymn.title && hymn.title.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Busca himnos por categoría
 */
export function searchByCategory(himnos, query) {
  if (!himnos || !query) return [];
  
  return himnos.filter(
    hymn => hymn.categories && hymn.categories.some(cat => 
      cat.toLowerCase().includes(query.toLowerCase())
    )
  );
}

/**
 * Ejecuta búsqueda completa con todos los criterios
 */
export async function searchHimnos(himnos, db, query) {
  if (!query || query.trim() === "" || !himnos) {
    return [];
  }

  try {
    const cleanQuery = query.trim().toLowerCase();
    let results = [];
    
    // 1. Búsqueda por número (exacta)
    if (/^\d+$/.test(cleanQuery)) {
      const numberResults = searchByNumber(himnos, cleanQuery);
      results = [...numberResults];
    }
    
    // 2. Búsqueda por título
    const titleResults = searchByTitle(himnos, cleanQuery);
    results = [...new Set([...results, ...titleResults])];
    
    // 3. Búsqueda en contenido (si es necesario)
    if (results.length < 5 && db) {
      try {
        const contentResults = await searchHymnContent(db, cleanQuery);
        
        const contentHymns = contentResults.map(id => {
          return himnos.find(h => h.id.toString() === id.toString());
        }).filter(Boolean);
        
        const allIds = new Set(results.map(h => h.id));
        results = [
          ...results,
          ...contentHymns.filter(h => !allIds.has(h.id))
        ];
      } catch (error) {
        LoggerService.error('Search', 'Error en búsqueda de contenido', error);
      }
    }
    
    // 4. Búsqueda por categoría (si todavía necesitamos más resultados)
    if (results.length < 10) {
      const categoryResults = searchByCategory(himnos, cleanQuery);
      
      const allIds = new Set(results.map(h => h.id));
      results = [
        ...results,
        ...categoryResults.filter(h => !allIds.has(h.id))
      ];
    }
    
    await LoggerService.debug('Search', `Búsqueda de "${cleanQuery}" encontró ${results.length} resultados`);
    return results;
  } catch (error) {
    await LoggerService.error('Search', `Error durante la búsqueda de "${query}"`, error);
    return [];
  }
}