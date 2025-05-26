import { useState, useEffect } from 'react';
import { useDatabase } from '../../../context/DatabaseProvider';
import { loadHymnsMetadata, reloadData } from '../services/dataService';
import LoggerService from '../../../services/LoggerService';
import {setLoadError} from '../../../context/HimnosContext/HimnosProvider'

/**
 * Hook para gestionar los datos de himnos
 */
export function useHimnosData() {
  const db = useDatabase();
  const [metaHimnos, setMetaHimnos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos inicialmente
  useEffect(() => {
    async function fetchData() {
      if (!db) return;
      
      try {
        setIsLoading(true);
        const data = await loadHymnsMetadata(db);
        setMetaHimnos(data);
        if (setLoadError) setLoadError(null);

      } catch (error) {
        await LoggerService.error('HimnosData', 'Error al cargar datos', error);
        if (setLoadError) setLoadError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [db]);

  // Función para forzar recarga de datos
  const reloadHimnos = async () => {
    if (!db) {
      await LoggerService.error('HimnosData', 'No se puede recargar, base de datos no disponible');
      return false;
    }
    
    try {
      setIsLoading(true);
      const result = await reloadData(db, setMetaHimnos);
      return result;
    } catch (error) {
      await LoggerService.error('HimnosData', 'Error al recargar himnos', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    metaHimnos,
    setMetaHimnos,
    isLoading,
    reloadHimnos
  };
}