import { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllHymnsMetadata, getHymnById, searchHymnContent } from "../db/databaseService";
import { getCategories } from "../utils/getCategories"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);
  const [recentlyID, setRecentlyID] = useState(["1", "2"]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchHymns = async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    const cleanQuery = query.trim().toLowerCase();
    
    try {
      let results = [];
      
      if (/^\d+$/.test(cleanQuery)) {
        const numberResults = metaHimnos.filter(
          hymn => hymn.number.toString() === cleanQuery
        );
        results = [...numberResults];
      }
      
      const titleResults = metaHimnos.filter(
        hymn => hymn.title.toLowerCase().includes(cleanQuery)
      );
      
      results = [...new Set([...results, ...titleResults])];
      
      if (results.length < 5) {
        const contentResults = await searchHymnContent(cleanQuery);
        
        const contentHymns = contentResults.map(id => {
          return metaHimnos.find(h => h.id.toString() === id.toString());
        }).filter(Boolean);
        
        const allIds = new Set(results.map(h => h.id));
        results = [
          ...results,
          ...contentHymns.filter(h => !allIds.has(h.id))
        ];
      }
      
      if (results.length < 10) {
        const keywordResults = metaHimnos.filter(
          hymn => hymn.categories.some(cat => 
            cat.toLowerCase().includes(cleanQuery)
          )
        );
        
        const allIds = new Set(results.map(h => h.id));
        results = [
          ...results,
          ...keywordResults.filter(h => !allIds.has(h.id))
        ];
      }
      
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error("Error al buscar:", error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };


  const CACHE_KEY = 'himnosMetadata';
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Primero intentamos cargar desde caché
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
          
          if (!isExpired) {
            console.log('Usando datos en caché');
            setMetaHimnos(data);
            setIsLoading(false);
            return;
          }
        }
        
        // Si no hay caché o está expirado, cargamos de la DB
        console.log('Cargando datos frescos');
        const metadata = await getAllHymnsMetadata();
        setMetaHimnos(metadata);
        
        // Guardamos en caché
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
          data: metadata,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error("Error al cargar metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
    
  const getHymnsByIds = (ids) => {
    if (!metaHimnos || !ids) return [];
    
    const idsArray = Array.isArray(ids) ? ids : [ids];
    
    // Usar un Set para comparación más eficiente
    const idSet = new Set(idsArray.map(id => String(id)));
    return metaHimnos.filter(hymn => idSet.has(String(hymn.id)));
  };
    
  const getRecentlyViewedHymns = () => {
    return getHymnsByIds(recentlyID);
  };
  
  const addToRecentlyViewed = (id) => {
    const idString = id.toString();
    setRecentlyID(prev => {
      const filtered = prev.filter(item => item !== idString);
      return [idString, ...filtered].slice(0, 5);
    });
  };

  const categorizedData = useMemo(() => {
    return metaHimnos ? getCategories(metaHimnos) : [];
  }, [metaHimnos]);

  const getHymnOfTheDay = () => {
    if (!metaHimnos) return null;
    
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const index = seed % metaHimnos.length;
    
    return metaHimnos[index];
  };

  return (
    <HimnosContext.Provider
      value={{
        metaHimnos,
        setMetaHimnos,
        recentlyID,
        setRecentlyID,
        categorizedData,
        getHymnsByIds,
        getRecentlyViewedHymns,
        addToRecentlyViewed,
        isLoading,
        searchQuery,
        setSearchQuery,
        searchHymns,
        searchResults,
        isSearching,
        getHymnOfTheDay
      }}
    >
      {children}
    </HimnosContext.Provider>
  );
};