import { createContext, useEffect, useState } from "react";
import { getAllHymnsMetadata } from "../db/databaseService"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);

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
      console.log(metaHimnos)
    }
  }, [metaHimnos])

  return (
    <HimnosContext.Provider value={{ metaHimnos, setMetaHimnos }}>
      {children}
    </HimnosContext.Provider>
  );
};
