import { useState, useEffect } from 'react';
import { loadRecentHymns, addToRecentHymns } from '../services/recentHymnsService';
import { getHymnsByIds } from '../services/dataService';

/**
 * Hook para gestionar himnos vistos recientemente
 */
export function useRecentHymns(metaHimnos) {
  const [recentlyID, setRecentlyID] = useState([]);

  // Cargar IDs recientes al inicializar
  useEffect(() => {
    async function loadRecent() {
      const recentIds = await loadRecentHymns();
      setRecentlyID(recentIds);
    }
    
    loadRecent();
  }, []);

  /**
   * Añade un himno a la lista de vistos recientemente
   */
  const addToRecentlyViewed = async (id) => {
    const newIds = await addToRecentHymns(id, recentlyID);
    setRecentlyID(newIds);
  };

  /**
   * Obtiene los himnos recientemente vistos
   */
  const getRecentlyViewedHymns = () => {
    return getHymnsByIds(metaHimnos, recentlyID);
  };

  return {
    recentlyID,
    setRecentlyID,
    addToRecentlyViewed,
    getRecentlyViewedHymns
  };
}