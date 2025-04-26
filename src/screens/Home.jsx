import { ScrollView, View, Text, TextInput } from 'react-native';
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
  const { categorizedData, getRecentlyViewedHymns } = useContext(HimnosContext);
  const navigation = useNavigation();
  
  const recentlyViewedHymns = getRecentlyViewedHymns();

  useFocusEffect(() => {
    setHideBar(false);
  });

  const handleViewAllRecent = () => {
    navigation.navigate('RecentHymns');
  };

  return (
    <View className="w-full h-full bg-slate-500 flex items-center justify-center">
      <ScrollView className="content h-full w-full p-7 flex bg-UIbase">
        <View className="header mt-8 gap-0.5">
          <Text className="font-josefinSemibold text-2xl">Himno del día</Text>
          <Text className="font-josefin font-medium">Himno 220 • Viento recio</Text>
          <Text className="font-josefin font-light text-sm text-gray-500">Abrir ahora</Text>
        </View>
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
        <Section className="mt-5 mb-12" title="Categorías">
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