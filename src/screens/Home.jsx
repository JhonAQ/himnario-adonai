import {ScrollView, View, Text, TextInput } from 'react-native';
import SearchBar from '../components/SearchBar';
import Section from '../components/Section';
import CardHymn from '../components/CardHymn';
import ListCard from '../components/ListCard';
import { useTabBar } from '../context/TabBarContext';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import { test, getAllHymnsMetadata,getHymnById } from '../db/databaseService';

// formato data hymn
const recentlyViewed = [
{
            title: "Padre celestial, acuerdate de mi",
            key: "F#",
            type: "Adoracion",
            index: 223,
            verses: 4,
            like: false
          },
{
            title: "Canto a ti",
            key: "E#m",
            type: "Adoracion",
            index: 133,
            verses: 5,
            like: true
          }
]

const Home = () => {
  const {setHideBar} = useTabBar();

  useEffect(() => {
    const fetchData = async () => {
      console.log("antes")
      const result = await getHymnById(1);
      console.log("By id:")
      console.log(result.lyrics[0].lines[0].content[0].value);
    };

    fetchData();
  }, []);


  useFocusEffect(() => {
    setHideBar(false);
  });

  return (
    <View className="w-full h-full bg-slate-500 flex items-center justify-center">

      <ScrollView className="content h-full w-full p-7 flex bg-UIbase">
        <View className="header mt-8 gap-0.5">
          <Text className="font-josefinSemibold text-2xl">Himno del día</Text>
          <Text className="font-josefin font-medium">Himno 220 • Viento recio</Text>
          <Text className="font-josefin font-light text-sm text-gray-500">Abrir ahora</Text>
        </View>
        <SearchBar className="mt-7" />
        <Section title="Vistos recientemente" className="mt-8">
          <CardHymn dataHymn={recentlyViewed[0]}/>
          <CardHymn dataHymn={recentlyViewed[1]}/>
        </Section>
        <Section className="mt-5" title="Categorías">
          <ListCard dataCategory={{
            category: "Canciones de adoración",
            hymns: 50, 
            favorites: 4
          }}/>
          <ListCard dataCategory={{
            category: "Coritos",
            hymns: 80, 
            favorites: 0
          }}/>
        </Section>
      </ScrollView>
    </View>
  );
};

export default Home;
