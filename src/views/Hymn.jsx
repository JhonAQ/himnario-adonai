import { ScrollView, View, Text, TextInput, ActivityIndicator } from 'react-native';
import Like from '../components/Like';
import { StyleSheet } from 'react-native';
import Title from '../components/Title';
import SectionLyric from '../components/SectionLyric';
import Himno from '../utils/CantoATi.js';
import { useRoute } from '@react-navigation/native';
import { useTabBar } from '../context/TabBarContext';
import { useContext, useEffect } from 'react';
import { useHymn } from '../hooks/useHymn';
import { getLyrics } from '../utils/getLyrics';
import { HimnosContext } from '../context/HimnosContext';

const Hymn = () => {
  const {setHideBar} = useTabBar();
  const {addToRecentlyViewed} = useContext(HimnosContext)

  useEffect(() => {
    setHideBar(true);
  }, []);

  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    addToRecentlyViewed(id);
  }, [id]);

  const {hymn, loading, error} = useHymn(id)


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !hymn) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error al cargar el himno.</Text>
      </View>
    );
  }

  const lyrics = getLyrics(hymn)

  return (
    <View className='w-full h-full flex-col justify-start'>
      <View className="header w-full flex gap-0.5 pt-10 pb-3 px-8 bg-UIbase" style={[styles.shadowProp]}>
        <Title title={hymn.title}></Title>
        <View className='topBar flex-row justify-between items-center'>
          <Text className='font-josefin text-base'>
            Himno {hymn.number} • {hymn.verses_count} versos
          </Text>
          <Text className='font-josefin text-base'>{hymn.note}</Text>
          {/* <Like /> */}
        </View>
      </View>
      <ScrollView className='px-14 py-9'>
        <View className='lyrics flex-col gap-5'>

          {
            lyrics.map((lyric, index) => (
              <SectionLyric key={index} lyrics={lyric} />
            ))
          }
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    // Para android
    elevation: 5,
  }
});

export default Hymn
