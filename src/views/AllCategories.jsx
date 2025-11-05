import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import { useTabBar } from '../context/TabBarContext';
import { useContext, useEffect } from 'react';
import { HimnosContext } from '../context/HimnosContext';
import ListCard from '../components/ListCard';

const AllCategories = () => {
  const { categorizedData, isLoading } = useContext(HimnosContext);
  const { setHideBar } = useTabBar();
  
  useEffect(() => {
    setHideBar(true);
  }, []);

  const renderItem = ({ item }) => (
    <ListCard 
      key={item.title} 
      dataCategory={{
        category: item.title,
        hymns: item.cantidad,
        ids: item.ids
      }}
    />
  );

  return (
    <View className='w-full h-full flex-col justify-start bg-background'>
      {/* Modern header section */}
      <View className='w-full px-6 pt-12 pb-4 bg-surface border-b border-neutral-100'>
        <Title title="Todas las categorías" />
        <SearchBar className="mt-4" />
        <Text className='mt-3 font-josefin text-sm text-foreground-secondary'>
          {categorizedData.length} categorías disponibles
        </Text>
      </View>

      {/* Content area */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 font-josefin text-foreground-secondary">
            Cargando categorías...
          </Text>
        </View>
      ) : (
        <FlatList
          data={categorizedData}
          renderItem={renderItem}
          keyExtractor={item => item.title}
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingTop: 20, 
            paddingBottom: 100 
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="font-josefin text-center text-foreground-secondary">
                No hay categorías disponibles
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AllCategories;