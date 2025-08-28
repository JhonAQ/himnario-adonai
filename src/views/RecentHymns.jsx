import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useContext, useEffect } from 'react';
import { HimnosContext } from '../context/HimnosContext';
import { Ionicons } from '@expo/vector-icons';

const RecentHymns = () => {
  const { getRecentlyViewedHymns, isLoading } = useContext(HimnosContext);
  const { setHideBar } = useTabBar();
  
  const recentlyViewedHymns = getRecentlyViewedHymns();

  useEffect(() => {
    setHideBar(true);
  }, []);

  const renderItem = ({ item }) => (
    <CardHymn key={item.id} hymn={item} />
  );

  return (
    <View className='w-full h-full flex-col justify-start bg-background'>
      {/* Modern header section */}
      <View className='w-full px-6 pt-12 pb-4 bg-surface border-b border-neutral-100'>
        <Title title="Vistos recientemente" />
        <SearchBar className="mt-4" />
        <Text className='mt-3 font-josefin text-sm text-foreground-secondary'>
          {recentlyViewedHymns.length} himnos vistos recientemente
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
          data={recentlyViewedHymns}
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
              <Ionicons name="time-outline" size={48} color="#D1D5DB" />
              <Text className="font-josefinSemibold text-lg text-center text-foreground mt-4">
                Sin historial
              </Text>
              <Text className="font-josefin text-center text-foreground-secondary mt-2">
                Los himnos que veas aparecerán aquí para acceso rápido.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default RecentHymns;