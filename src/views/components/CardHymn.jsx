import { Text, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CardHymn = ({ }) => {
  const like = true;
  return (
    <View className="bg-UIwhite w-[48%] rounded-lg">
      <View className="bg-slate-400 h-28 card-image relative rounded-lg">
        <View className="like flex items-center justify-center absolute top-2 right-2 rounded-full bg-UIwhite p-1">
          {
            like ?
            <MaterialCommunityIcons name="cards-heart" size={21} color="black" />
            :
            <MaterialCommunityIcons name="cards-heart-outline" size={24} color="black" />
          }
        </View>
      </View>
      <View className="card-info py-3 px-2">
        <View className="info-left gap-[2px]">
          <Text className="font-josefin font-medium">
            Himno 223 • 4 versos
          </Text>
          <Text numberOfLines={1} className="font-josefin font-light text-sm text-UIgray2">
            Padre celestial, acuerdate de mi
          </Text>
          <Text className="font-josefin font-extralight text-xs text-UIgray2">
            Adoración
          </Text>
        </View>
        <Text className="font-semibold info-right absolute bottom-2 right-2">
          F#
        </Text>
      </View>
    </View>
  )
}

export default CardHymn;