import { Text, View } from "react-native";

const SectionLyric = ({ lyrics }) => {
  return (
    <View className='lyricSection'>
      <Text className="font-josefin font-semibold text-sm">{lyrics.type}</Text>
      {
        lyrics.lines.map((line, index) => (
          <Text key={index} className='font-josefin font-light text-base'>{line}</Text>
        ))
      }
    </View>
  );
}

export default SectionLyric;