import { ScrollView, View, Text, TextInput } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Like from '../components/Like';
import { StyleSheet } from 'nativewind';

const Hymn = () => {
  return (
    <View className='w-full h-full flex-col justify-start'>
      <View className="header w-full flex gap-0.5 pt-10 pb-3 px-8 bg-UIbase" style={[styles.shadowProp]}>
        <View className='title mb-5 flex-row items-center gap-2 '>
          <Entypo name="chevron-small-left" size={24} color="black" />
          <Text className="font-josefin font-medium leading-none translate-y-0.5 text-xl">
            Herido triste a jesus mostrele mi dolor
          </Text>
        </View>
        <View className='topBar flex-row justify-between items-center'>
          <Text className='font-josefin text-base'>
            Himno 3 • 5 verssos
          </Text>
          <Text className='font-josefin text-base'>F#m</Text>
          <Like/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 12,
  }
})

export default Hymn
