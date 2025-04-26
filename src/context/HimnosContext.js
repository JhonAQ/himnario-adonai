import { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllHymnsMetadata, getHymnById } from "../db/databaseService";
import { getCategories } from "../utils/getCategories"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {

// Dentro de HimnosProvider, agregar:
const CACHE_KEY = 'himnosMetadata';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

useEffect(() => {
  const fetchData = async () => {
    try {
      // Primero intentamos cargar desde caché
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
        
        if (!isExpired) {
          console.log('Usando datos en caché');
          setMetaHimnos(data);
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
    }
  };

  fetchData();
}, []);

  const [metaHimnos, setMetaHimnos] = useState(null);
  const [recentlyID, setRecentlyID] = useState(["1", "2"])
  
    
    const getHymnsByIds = (ids) => {
      if (!metaHimnos || !ids) return [];
      
      const idsArray = Array.isArray(ids) ? ids : [ids];
      
      return metaHimnos.filter(hymn => 
        idsArray.map(id => String(id)).includes(String(hymn.id))
      );
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metadata = await getAllHymnsMetadata();
        setMetaHimnos(metadata);
      } catch (error) {
        console.error("Error al cargar metadata al context:", error);
      }
    };

    fetchData();
  }, []);

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
        addToRecentlyViewed
      }}
    >
      {children}
    </HimnosContext.Provider>
  );
};