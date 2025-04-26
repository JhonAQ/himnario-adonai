import { ScrollView, View, Text, TextInput } from 'react-native';
import Like from '../components/Like';
import { StyleSheet } from 'nativewind';
import Title from '../components/Title';
import SectionLyric from '../components/SectionLyric';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useContext, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { HimnosContext } from '../context/HimnosContext';


const Index = ({index = false}) => {
  const { getHymnsByIds, metaHimnos } = useContext(HimnosContext)
  const { setHideBar } = useTabBar();
  const route = useRoute()
  
  // Obtener parámetros de ruta si existen, o usar valores predeterminados
  const { title, ids, cantidad } = route.params || {};
  
  // Determinar qué himnos mostrar según la prop 'index'
  const himnos = index ? metaHimnos || [] : getHymnsByIds(ids);
  
  // Calcular el total de himnos a mostrar
  const totalHimnos = index ? (metaHimnos?.length || 0) : cantidad;
  
  // Determinar el título según el modo
  const displayTitle = index ? "Todos los himnos" : `Categoria: ${title}`;
  
  // Determinar el texto descriptivo según el modo
  const descripcionTexto = index 
    ? `Hay ${totalHimnos} himnos en total`
    : `Hay ${cantidad} himnos en esta categoría`;

  useEffect(() => {
    setHideBar(true);
  }, []);

  return (
    <View className='w-full h-full flex-col justify-start bg-UIbase'>
      <View className='header w-full mt-4 pt-10 px-8 '>
        <Title title={displayTitle}/>
        <SearchBar className={"mt-4"}/>
        <Text className='mt-4 font-josefin text-UIgray2 text-medium'>
          {descripcionTexto}
        </Text>
      </View>
      <ScrollView className='mt-5 px-4'>
      <View className="flex-row justify-between flex-wrap gap-y-4 pt-5 ">
          {
            himnos.map((h) => 
              <CardHymn key={h.id} hymn={h}/>
            )
          }
      </View>
      </ScrollView>
    </View>
  );
};

export default Index;