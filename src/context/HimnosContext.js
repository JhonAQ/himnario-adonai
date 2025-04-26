import { createContext, useEffect, useState } from "react";
import { getAllHymnsMetadata } from "../db/databaseService"

export const HimnosContext = createContext();

export const HimnosProvider = ({ children }) => {
  const [metaHimnos, setMetaHimnos] = useState(null);
  const categories = [
    'Adoración y Alabanza',
    'Espíritu Santo',
    'Vida de Cristo',
    'Iglesia y Comunidad',
    'Arrepentimiento y Confesión',
    'Esperanza y Segunda Venida',
    'Bautismo y Santa Cena',
    'Oración y Devoción Personal',
    'Navidad y Pascua',
    'Funerales y Consuelo',
    'Niños y Escuela Dominical',
    'Misión y Evangelismo',
    'Consagración y Servicio',
    'Coros'
  ]

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
