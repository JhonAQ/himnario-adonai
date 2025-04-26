import { createContext, useEffect, useMemo, useState } from "react";
import { getAllHymnsMetadata, getHymnById } from "../db/databaseService";
import { getCategories } from "../utils/getCategories"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const getHymnsByIds = (ids) => {
    return metaHimnos.filter(hymn => ids.includes(hymn.id));
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
        recentlyViewed,
        setRecentlyViewed,
        categorizedData,
        getHymnsByIds
      }}
    >
      {children}
    </HimnosContext.Provider>
  );
};
