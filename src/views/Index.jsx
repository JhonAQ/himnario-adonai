import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useContext, useEffect, useState, useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import { HimnosContext } from '../context/HimnosContext';

const Index = ({index = false}) => {
  const { getHymnsByIds, metaHimnos, isLoading } = useContext(HimnosContext);
  const { setHideBar } = useTabBar();
  const route = useRoute();
  const [renderedItems, setRenderedItems] = useState(20);
  
  const { title, ids, cantidad } = route.params || {};

  // Determinar qué himnos mostrar según la prop 'index'
  const himnos = useMemo(() => {
    return index ? metaHimnos || [] : getHymnsByIds(ids);
  }, [index, metaHimnos, ids, getHymnsByIds]);
  
  // Calcular el total de himnos a mostrar
  const totalHimnos = index ? (metaHimnos?.length || 0) : cantidad;
  
  // Determinar el título según el modo
  const displayTitle = index ? "Todos los himnos" : `Categoria: ${title}`;
  
  // Determinar el texto descriptivo según el modo
  const descripcionTexto = index 
    ? `Hay ${totalHimnos} himnos en total`
    : `Hay ${cantidad} himnos en esta categoría`;

  useEffect(() => {
    setHideBar(!index);
  }, [index]);

  const renderItem = ({ item }) => (
    <CardHymn key={item.id} hymn={item} />
  );

  return (
    <View className='w-full h-full flex-col justify-start bg-UIbase'>
      <View className='header w-full mt-4 py-3 pt-10 px-8 '>
        <Title title={displayTitle} index={index}/>
        <SearchBar className={"mt-4"}/>
        <Text className='mt-4 font-josefin text-UIgray2 text-medium'>
          {descripcionTexto}
        </Text>
      </View>

      {isLoading ? (
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30, gap: 15 }}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          removeClippedSubviews={true}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

export default Index;