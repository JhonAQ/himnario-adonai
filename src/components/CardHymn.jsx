import { Text, TouchableOpacity, View } from "react-native";
import Like from "./Like";
import { useNavigation } from "@react-navigation/native";

const CardHymn = ({dataHymn}) => {
  const navigation = useNavigation();
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
            Himno {dataHymn.index} • {dataHymn.verses} versos
          </Text>
          <Text numberOfLines={1} className="font-josefin font-light text-sm text-UIgray2">
            {dataHymn.title}
          </Text>
          <Text className="font-josefin font-extralight text-xs text-UIgray2 mt-[5px]">
            {dataHymn.type}
          </Text>
        </View>
        <Text className="font-semibold info-right absolute bottom-2 right-2">
          {dataHymn.key}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CardHymn;