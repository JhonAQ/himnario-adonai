import { createContext, useEffect, useMemo, useState } from "react";
import { getAllHymnsMetadata } from "../db/databaseService";
import { getCategories } from "../utils/getCategories"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

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

  const categorizedData = useMemo(() => {
    return metaHimnos ? getCategories(metaHimnos) : [];
  }, [metaHimnos]);

  return (
    <HimnosContext.Provider
      value={{
        metaHimnos,
        setMetaHimnos,
        recentlyViewed,
        setRecentlyViewed,
        categorizedData
      }}
    >
      {children}
    </HimnosContext.Provider>
  );
};
