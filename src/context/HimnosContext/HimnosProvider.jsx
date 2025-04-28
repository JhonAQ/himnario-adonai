import React from 'react';
import { HimnosContext } from './index';
import { useHimnosData } from './hooks/useHimnosData';
import { useHimnosSearch } from './hooks/useHimnosSearch';
import { useRecentHymns } from './hooks/useRecentHymns';
import { fetchHymnById, getHymnsByIds } from './services/dataService';
import { getCategories, getHymnOfTheDay } from './services/categoriesService';
import { useDatabase } from '../../db/databaseService';
import { useMemo } from 'react';

export const HimnosProvider = ({ children }) => {
  const db = useDatabase();
  
  // Hooks personalizados
  const { metaHimnos, setMetaHimnos, isLoading, reloadHimnos } = useHimnosData();
  const { searchQuery, setSearchQuery, searchResults, isSearching, searchHymns } = useHimnosSearch(metaHimnos);
  const { recentlyID, setRecentlyID, addToRecentlyViewed, getRecentlyViewedHymns } = useRecentHymns(metaHimnos);

  // Datos estructurados por categorías
  const categorizedData = useMemo(() => {
    return getCategories(metaHimnos);
  }, [metaHimnos]);

  // Función para obtener el himno del día
  const getHymnOfTheDayData = () => getHymnOfTheDay(metaHimnos);

  // Función para obtener un himno específico
  const fetchHymnByIdWrapped = async (id) => {
    if (!db) return null;
    return fetchHymnById(db, id);
  };

  // Función para obtener himnos por IDs
  const getHymnsByIdsWrapped = (ids) => {
    return getHymnsByIds(metaHimnos, ids);
  };

  // El valor del contexto
  const contextValue = {
    metaHimnos,
    setMetaHimnos,
    recentlyID,
    setRecentlyID,
    categorizedData,
    getHymnsByIds: getHymnsByIdsWrapped,
    getRecentlyViewedHymns,
    addToRecentlyViewed,
    isLoading,
    searchQuery,
    setSearchQuery,
    searchHymns,
    searchResults,
    isSearching,
    getHymnOfTheDay: getHymnOfTheDayData,
    fetchHymnById: fetchHymnByIdWrapped,
    reloadHimnos
  };

  return (
    <HimnosContext.Provider value={contextValue}>
      {children}
    </HimnosContext.Provider>
  );
};