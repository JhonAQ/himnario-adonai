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
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const { setHideBar } = useTabBar();
  const { categorizedData, getRecentlyViewedHymns, getHymnOfTheDay } = useContext(HimnosContext);
  const navigation = useNavigation();
  
  const recentlyViewedHymns = getRecentlyViewedHymns();
  const hymnOfTheDay = getHymnOfTheDay();

  useFocusEffect(() => {
    setHideBar(false);
  });

  const handleViewAllRecent = () => {
    navigation.navigate('RecentHymns');
  };
  
  const handleViewAllCategories = () => {
    navigation.navigate('AllCategories');
  };
  
  const openDailyHymn = () => {
    if (hymnOfTheDay) {
      navigation.navigate('HymnStack', { id: hymnOfTheDay.id });
    }
  };

  return (
    <View className="w-full h-full bg-background">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header section with hymn of the day */}
        <TouchableOpacity 
          className="mt-16 p-6 bg-primary-500 rounded-2xl shadow-md" 
          activeOpacity={0.8} 
          onPress={openDailyHymn}
          style={{
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6
          }}
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={20} color="white" />
            <Text className="font-josefinSemibold text-lg text-white ml-2">
              Himno del día
            </Text>
          </View>
          {hymnOfTheDay ? (
            <View>
              <Text className="font-josefinBold text-xl text-white mb-1">
                Himno {hymnOfTheDay.number}
              </Text>
              <Text className="font-josefin text-base text-white/90 mb-2">
                {hymnOfTheDay.title}
              </Text>
              <Text className="font-josefin text-sm text-white/70">
                Toca para abrir →
              </Text>
            </View>
          ) : (
            <Text className="font-josefin text-white">Cargando...</Text>
          )}
        </TouchableOpacity>
        
        {/* Modern search bar */}
        <SearchBar className="mt-6" />
        
        {/* Recently viewed section */}
        <Section 
          title="Vistos recientemente" 
          className="mt-8" 
          onViewAll={recentlyViewedHymns.length > 0 ? handleViewAllRecent : null}
        >
          {recentlyViewedHymns.length > 0 ? (
            recentlyViewedHymns.slice(0, 2).map(hymn => (
              <CardHymn key={hymn.id} hymn={hymn} />
            ))
          ) : (
            <View className="w-full p-6 bg-surface-secondary rounded-xl border-2 border-dashed border-neutral-200">
              <Text className="font-josefin text-foreground-secondary text-center">
                No hay himnos vistos recientemente
              </Text>
            </View>
          )}
        </Section>
        
        {/* Categories section */}
        <Section 
          className="mt-8" 
          title="Categorías"
          onViewAll={handleViewAllCategories}
        >
          <View className="w-full">
            {categorizedData.slice(0, 4).map((cat, index) => (
              <View key={cat.title} className={index > 0 ? "mt-3" : ""}>
                <ListCard dataCategory={{
                  category: cat.title,
                  hymns: cat.cantidad, 
                  ids: cat.ids
                }}/>
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
};

export default Home;