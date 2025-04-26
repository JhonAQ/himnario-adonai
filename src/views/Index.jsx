import { ScrollView, View, Text, TextInput } from 'react-native';
import Like from '../components/Like';
import { StyleSheet } from 'nativewind';
import Title from '../components/Title';
import SectionLyric from '../components/SectionLyric';
import SearchBar from '../components/SearchBar';
import CardHymn from '../components/CardHymn';
import { useTabBar } from '../context/TabBarContext';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';


const Index = () => {

  const {setHideBar} = useTabBar();
  const route = useRoute()

  const {title, ids, cantidad} = route.params

  useEffect(() => {
    setHideBar(true);
  }, []);

  return (
    <View className='w-full h-full flex-col justify-start bg-UIbase'>
      <View className='header w-full mt-4 pt-10 px-8 '>
        <Title title={"Categoria: " + title}/>
        <SearchBar className={"mt-4"}/>
        <Text className='mt-4 font-josefin text-UIgray2 text-medium' >Hay {cantidad} himnos en esta categoría</Text>
      </View>
      <ScrollView className='mt-5 px-4'>
      <View className="flex-row justify-between flex-wrap gap-y-4 pt-5 ">

          <CardHymn dataHymn={{
            title: "Padre celestial, acuerdate de mi",
            key: "F#",
            type: "Adoracion",
            index: 223,
            verses: 4,
            like: false
          }}/>

      </View>
      </ScrollView>
    </View>
  );
};

export default Index;
