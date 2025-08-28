import { Text, TouchableOpacity, View } from "react-native";
import Like from "./Like";
import { useNavigation } from "@react-navigation/native";

const CardHymn = ({hymn}) => {
  const navigation = useNavigation();
  const number = hymn ? hymn.number : "xx"
  const verses = hymn ? hymn.verses_count : "xx"
  const title = hymn ? hymn.title : "xxxxxxxxxxx"
  const category = hymn ? hymn.categories[0] : "xxxxxxx"
  const note = hymn ? "" : ""

  return (
    <TouchableOpacity
      onPress={() => {navigation.navigate('HymnStack', {id : hymn.id})}}
      activeOpacity={0.7}
      className="bg-surface w-[48%] rounded-xl shadow-sm border border-neutral-100 overflow-hidden"
    >
      {/* Modern card image with gradient overlay */}
      <View className="relative h-28 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
        <Text className="text-white text-2xl font-josefinBold opacity-90">
          {number}
        </Text>
        {/* beta version */}
        {/* <Like className="absolute top-2 right-2" like={dataHymn.like}/> */}
      </View>
      
      {/* Modern card content */}
      <View className="p-4 flex-1">
        <Text className="font-josefinSemibold text-sm text-primary-600 mb-1">
          Himno {number} • {verses} versos
        </Text>
        <Text 
          numberOfLines={2} 
          className="font-josefin text-base text-foreground mb-2 leading-tight"
        >
          {title}
        </Text>
        <Text className="font-josefin text-xs text-foreground-secondary">
          {category}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CardHymn;