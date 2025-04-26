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
    onPress={() => {navigation.navigate('HymnStack', {dataHymn})}}
    activeOpacity={0.6}
    className="bg-UIwhite w-[48%] rounded-lg">
      <View className="card-image bg-slate-400 h-28 relative rounded-lg">
        {/* beta version */}
        {/* <Like className="absolute top-2 right-2" like={dataHymn.like}/> */}
      </View>
      <View className="card-info py-3 px-2">
        <View className="info-left gap-[3px]">
          <Text className="font-josefin font-medium">
            Himno {number} • {verses} versos
          </Text>
          <Text numberOfLines={1} className="font-josefin font-light text-sm text-UIgray2">
            {title}
          </Text>
          <Text className="font-josefin font-extralight text-xs text-UIgray2 mt-[5px]">
            {category}
          </Text>
        </View>
        <Text className="font-semibold info-right absolute bottom-2 right-2">
          {note}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CardHymn;