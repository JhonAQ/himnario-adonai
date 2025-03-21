import { ScrollView, View, Text, TextInput } from 'react-native';
import Like from '../components/Like';
import { StyleSheet } from 'react-native';
import Title from '../components/Title';
import SectionLyric from '../components/SectionLyric';
import Himno from '../utils/CantoATi.js';

const Hymn = ({himno}) => {

  //Proction
  himno = Himno;

  return (
    <View className='w-full h-full flex-col justify-start'>
      <View className="header w-full flex gap-0.5 pt-10 pb-3 px-8 bg-UIbase" style={[styles.shadowProp]}>
        <Title title={himno.title}></Title>
        <View className='topBar flex-row justify-between items-center'>
          <Text className='font-josefin text-base'>
            Himno {himno.number} • {himno.verses} versos
          </Text>
          <Text className='font-josefin text-base'>{himno.key}</Text>
          <Like/>
        </View>
      </View>
      <ScrollView className='px-14 py-9'>
        <View className='lyrics flex-col gap-5'>

        {
          himno.lyrics.map((lyric, index) => (
            <SectionLyric key={index} lyrics={lyric}/>
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
