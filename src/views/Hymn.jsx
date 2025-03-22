import { ScrollView, View, Text, TextInput } from 'react-native';
import Like from '../components/Like';
import { StyleSheet } from 'react-native';
import Title from '../components/Title';
import SectionLyric from '../components/SectionLyric';
import Himno from '../utils/CantoATi.js';
import { useRoute } from '@react-navigation/native';
import { useTabBar } from '../context/TabBarContext';
import { useEffect } from 'react';

const Hymn = () => {
  const {setHideBar} = useTabBar();

  useEffect(() => {
    setHideBar(true);
    return () => setHideBar(true);
  }, []);

  const route = useRoute();
  const { dataHymn } = route.params;

  const lyrics = [
    {
      "type": "Coro",
      "lines": [
        "Demos gracias al Señor, demos gracias",
        "demos gracias por su amor."
      ]
    },
    {
      "type": "Verso 1",
      "lines": [
        "Por la mañana las aves cantan",
        "las alabanzas de Cristo el Salvador",
        "y tú, amigo, ¿por qué no cantas",
        "las alabanzas de Cristo el Salvador?"
      ]
    }]

  return (
    <View className='w-full h-full flex-col justify-start'>
      <View className="header w-full flex gap-0.5 pt-10 pb-3 px-8 bg-UIbase" style={[styles.shadowProp]}>
        <Title title={dataHymn.title}></Title>
        <View className='topBar flex-row justify-between items-center'>
          <Text className='font-josefin text-base'>
            Himno {dataHymn.index} • {dataHymn.verses} versos
          </Text>
          <Text className='font-josefin text-base'>{dataHymn.key}</Text>
          <Like />
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
