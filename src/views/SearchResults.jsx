import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useContext, useEffect } from 'react';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { HimnosContext } from '../context/HimnosContext';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
    <View className='w-full h-full flex-col justify-start bg-background'>
      {/* Modern header section */}
      <View className='w-full px-6 pt-12 pb-4 bg-surface border-b border-neutral-100'>
        <Title title={`Resultados para "${query}"`} />
        <SearchBar className="mt-4" />
        <Text className='mt-3 font-josefin text-sm text-foreground-secondary'>
          {searchResults.length} himnos encontrados
        </Text>
      </View>

      {/* Content area */}
      {isSearching ? (
        <View className="flex-1 justify-center items-center px-8">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="font-josefin text-foreground-secondary mt-4 text-center">
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
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingTop: 20, 
            paddingBottom: 100,
            gap: 16
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center p-8">
              <Ionicons name="search" size={48} color="#D1D5DB" />
              <Text className="font-josefinSemibold text-lg text-center text-foreground mt-4">
                Sin resultados
              </Text>
              <Text className="font-josefin text-center text-foreground-secondary mt-2">
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