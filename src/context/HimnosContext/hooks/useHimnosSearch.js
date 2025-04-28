import { useState } from 'react';
import { useDatabase } from '../../../db/databaseService';
import { searchHimnos } from '../services/searchService';

/**
 * Hook para gestionar búsquedas de himnos
 */
export function useHimnosSearch(metaHimnos) {
  const db = useDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Ejecuta una búsqueda con la query proporcionada
   */
  const searchHymns = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    try {
      const results = await searchHimnos(metaHimnos, db, query);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchHymns
  };
}