import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import Section from '../components/Section';
import { HimnosContext } from '../context/HimnosContext';
import CardHymn from '../components/CardHymn';
import ListCard from '../components/ListCard';
import { useTabBar } from '../context/TabBarContext';
import { useFocusEffect } from '@react-navigation/native';
import { useContext } from 'react';
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const { setHideBar } = useTabBar();
  const { categorizedData, getRecentlyViewedHymns, getHymnOfTheDay } = useContext(HimnosContext);
  const navigation = useNavigation();
  
  const recentlyViewedHymns = getRecentlyViewedHymns();
  const hymnOfTheDay = getHymnOfTheDay(); // Obtenemos el himno del día

  useFocusEffect(() => {
    setHideBar(false);
  });

  const handleViewAllRecent = () => {
    navigation.navigate('RecentHymns');
  };
  
  const handleViewAllCategories = () => {
    navigation.navigate('AllCategories');
  };
  
  // Función para abrir el himno del día
  const openDailyHymn = () => {
    if (hymnOfTheDay) {
      navigation.navigate('HymnStack', { id: hymnOfTheDay.id });
    }
  };

  return (
    <View className="w-full h-full bg-slate-500 flex items-center justify-center">
      <ScrollView className="content h-full w-full p-7 flex bg-UIbase">
        {/* Sección del Himno del Día */}
        <TouchableOpacity 
          className="header mt-10 gap-0.5 bg-UIbase rounded-lg shadow-sm" 
          activeOpacity={0.7} 
          onPress={openDailyHymn}
        >
          <Text className="font-josefinSemibold text-2xl">Himno del día</Text>
          {hymnOfTheDay ? (
            <>
              <Text className="font-josefin font-medium">
                Himno {hymnOfTheDay.number} • {hymnOfTheDay.title}
              </Text>
              <Text className="font-josefin font-light text-sm text-gray-500">
                Toca para abrir
              </Text>
            </>
          ) : (
            <Text className="font-josefin font-medium">Cargando...</Text>
          )}
        </TouchableOpacity>
        
        <SearchBar className="mt-7" />
        <Section 
          title="Vistos recientemente" 
          className="mt-8" 
          onViewAll={handleViewAllRecent}
        >
          {recentlyViewedHymns.length > 0 ? (
            recentlyViewedHymns.slice(0, 2).map(hymn => (
              <CardHymn key={hymn.id} hymn={hymn} />
            ))
          ) : (
            <Text className="font-josefin text-gray-500">No hay himnos vistos recientemente</Text>
          )}
        </Section>
        <Section 
          className="mt-5 mb-12" 
          title="Categorías"
          onViewAll={handleViewAllCategories}
        >
          {
            categorizedData.slice(0, 4).map(cat =>
              <ListCard key={cat.title} dataCategory={{
                category: cat.title,
                hymns: cat.cantidad, 
                ids: cat.ids
              }}/>
            )
          }
        </Section>
      </ScrollView>
    </View>
  );
};

export default Home;