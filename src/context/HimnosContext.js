import { createContext, useEffect, useState } from "react";
import { getAllHymnsMetadata } from "../db/databaseService"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);

  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metadata = await getAllHymnsMetadata();
        setMetaHimnos(metadata);
      } catch (error) {
        console.log("error al cargar metadata al context:" , error)
      }
    }
    fetchData()
  }, []);

  useEffect(() => {
    if(metaHimnos){
      console.log(metaHimnos[0])
      console.log("Si, eran las metadatas xd")
    }
  }, [metaHimnos])

  return (
    <HimnosContext.Provider value={{ metaHimnos, setMetaHimnos }}>
      {children}
    </HimnosContext.Provider>
  );
};
