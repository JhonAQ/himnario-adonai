import { ScrollView, View, Text, TextInput } from 'react-native';
import Like from '../components/Like';
import { StyleSheet } from 'nativewind';
import Title from '../components/Title';
import SectionLyric from '../components/SectionLyric';

const Hymn = () => {
  const Hymno = {
  "id": 17,
  "title": "DEMOS GRACIAS AL SEÑOR",
  "note": "C",
  "author": "Desconocido",
  "number": 17,
  "verses": 3,
  "lyrics": [
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
    },
    {
      "type": "Verso 2",
      "lines": [
        "Y las estrellas de noche brillan",
        "y nos alumbran por el amor de Dios",
        "y tú amigo, mirando al cielo,",
        "¿Por qué no alabas al Salvador Jesús?"
      ]
    },
    {
      "type": "Verso 3",
      "lines": [
        "En el calvario murió inocente",
        "por tus pecados clavado en una cruz",
        "y si tú quieres la vida eterna",
        "¿Por qué no acudes al Salvador Jesús?"
      ]
    }
  ]
}

  return (
    <View className='w-full h-full flex-col justify-start'>
      <View className="header w-full flex gap-0.5 pt-10 pb-3 px-8 bg-UIbase" style={[styles.shadowProp]}>
        <Title title="Canto a ti"></Title>
        <View className='topBar flex-row justify-between items-center'>
          <Text className='font-josefin text-base'>
            Himno 3 • 5 verssos
          </Text>
          <Text className='font-josefin text-base'>F#m</Text>
          <Like/>
        </View>
      </View>
      <ScrollView className='px-14 py-9'>
        <View className='lyrics flex-col gap-5'>

        {
          Hymno.lyrics.map((lyric, index) => (
            <SectionLyric lyrics={lyric}/>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 12,
  }
})

export default Hymn
