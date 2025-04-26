import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useContext, useEffect } from 'react';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { HimnosContext } from '../context/HimnosContext';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useCallback } from 'react';

const SearchResults = () => {
  const { searchHymns, searchResults, isSearching, setSearchQuery } = useContext(HimnosContext);
  const { setHideBar } = useTabBar();
  const route = useRoute();
  const { query } = route.params;

  useFocusEffect(
    useCallback(() => {
      setHideBar(true);

      if (query) {
        searchHymns(query);
      }

      return () => {
        setSearchQuery("");
      };
    }, [query])
  );

  const renderItem = ({ item }) => (
    <CardHymn key={item.id} hymn={item} />
  );

  return (
    <View className='w-full h-full flex-col justify-start bg-UIbase'>
      <View className='header w-full mt-4 py-3 pt-10 px-8 '>
        <Title title={`Resultados para "${query}"`} />
        <SearchBar className={"mt-4"} />
        <Text className='mt-4 font-josefin text-UIgray2 text-medium'>
          {searchResults.length} himnos encontrados
        </Text>
      </View>

      {isSearching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#666" />
          <Text className="font-josefin text-gray-500 mt-4 text-center">
            Buscando himnos que coincidan con "{query}"...
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30, gap: 15 }}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="font-josefin text-center text-gray-500">
                No se encontraron himnos que coincidan con tu búsqueda.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default SearchResults;