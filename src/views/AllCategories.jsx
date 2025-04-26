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
    <View className='w-full h-full flex-col justify-start bg-UIbase'>
      <View className='header w-full mt-4 py-3 pt-10 px-8'>
        <Title title="Todas las categorías" />
        <SearchBar className={"mt-4"} />
        <Text className='mt-4 font-josefin text-UIgray2 text-medium'>
          {categorizedData.length} categorías disponibles
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={categorizedData}
          renderItem={renderItem}
          keyExtractor={item => item.title}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30, gap: 15 }}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="font-josefin text-center text-gray-500">
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