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

  const himnos = useMemo(() => {
    return index ? metaHimnos || [] : getHymnsByIds(ids);
  }, [index, metaHimnos, ids, getHymnsByIds]);
  
  const totalHimnos = index ? (metaHimnos?.length || 0) : cantidad;
  
  const displayTitle = index ? "Todos los himnos" : `${title}`;
  
  const descripcionTexto = index 
    ? `${totalHimnos} himnos en total`
    : `${cantidad} himnos en esta categoría`;

  useEffect(() => {
    setHideBar(!index);
  }, [index]);

  const renderItem = ({ item }) => (
    <CardHymn key={item.id} hymn={item} />
  );

  return (
    <View className='w-full h-full flex-col justify-start bg-background'>
      {/* Modern header section */}
      <View className='w-full px-6 pt-12 pb-4 bg-surface border-b border-neutral-100'>
        <Title title={displayTitle} index={index}/>
        <SearchBar className="mt-4"/>
        <Text className='mt-3 font-josefin text-sm text-foreground-secondary'>
          {descripcionTexto}
        </Text>
      </View>

      {/* Content area */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 font-josefin text-foreground-secondary">
            Cargando himnos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={himnos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingTop: 20, 
            paddingBottom: 100,
            gap: 16
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          removeClippedSubviews={true}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Index;