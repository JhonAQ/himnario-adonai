import { useState, useEffect } from 'react';
import { loadHymnsMetadata, reloadData } from '../services/dataService';
import LoggerService from '../../../services/LoggerService';

/**
 * Hook para gestionar los datos de himnos
 */
export function useHimnosData(db, errorSetter = null) {
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
        // Usar el setter solo si se proporciona
        if (errorSetter) {
          errorSetter(null);
        }
      } catch (error) {
        await LoggerService.error('HimnosData', 'Error al cargar datos', error);
        // Usar el setter solo si se proporciona
        if (errorSetter) {
          errorSetter(error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [db, errorSetter]);

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