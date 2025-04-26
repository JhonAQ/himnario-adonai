import { createContext, useEffect, useMemo, useState } from "react";
import { getAllHymnsMetadata, getHymnById } from "../db/databaseService";
import { getCategories } from "../utils/getCategories";

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);
  const [recentlyID, setRecentlyID] = useState(["1", "2"]);

  const getHymnsByIds = (ids) => {
    if (!metaHimnos || !ids) return [];

    const idsArray = Array.isArray(ids) ? ids : [ids];

    return metaHimnos.filter((hymn) =>
      idsArray.map((id) => String(id)).includes(String(hymn.id))
    );
  };

  const getRecentlyViewedHymns = () => {
    return getHymnsByIds(recentlyID);
  };

  const addToRecentlyViewed = (id) => {
    const idString = id.toString();
    setRecentlyID((prev) => {
      const filtered = prev.filter((item) => item !== idString);
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
        addToRecentlyViewed,
      }}
    >
      {children}
    </HimnosContext.Provider>
  );
};
