import { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator, FlatList } from 'react-native';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { HimnosContext } from '../context/HimnosContext';
import Title from '../components/Title';

const Index = ({index = false}) => {
  const { getHymnsByIds, metaHimnos } = useContext(HimnosContext);
  const { setHideBar } = useTabBar();
  const route = useRoute();
  
  const { title, ids, cantidad } = route.params || {};
  
  // Determinar qué himnos mostrar según la prop 'index'
  const himnos = index ? metaHimnos || [] : getHymnsByIds(ids);
  
  // Calcular el total de himnos a mostrar
  const totalHimnos = index ? (metaHimnos?.length || 0) : cantidad;
  
  const displayTitle = index ? "Todos los himnos" : `Categoria: ${title}`;
  const descripcionTexto = index 
    ? `Hay ${totalHimnos} himnos en total`
    : `Hay ${cantidad} himnos en esta categoría`;

  useEffect(() => {
    setHideBar(true);
  }, []);

  // Renderizar cada elemento individualmente (más eficiente que map)
  const renderItem = ({ item }) => <CardHymn key={item.id} hymn={item} />;

  return (
    <View className='w-full h-full flex-col justify-start bg-UIbase'>
      <View className='header w-full mt-4 pt-10 px-8'>
        <Title title={displayTitle}/>
        <SearchBar className={"mt-4"}/>
        <Text className='mt-4 font-josefin text-UIgray2 text-medium'>
          {descripcionTexto}
        </Text>
      </View>
      
      {!metaHimnos && index ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={himnos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 }}
          initialNumToRender={10} // Renderiza inicialmente solo 10 elementos
          maxToRenderPerBatch={10} // Procesa 10 elementos por lote
          windowSize={5} // Mantén solo 5 "pantallas" de elementos en memoria
          removeClippedSubviews={true} // Libera memoria de elementos fuera de pantalla
        />
      )}
    </View>
  );
};

export default Index;