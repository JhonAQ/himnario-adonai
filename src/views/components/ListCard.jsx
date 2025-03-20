import { Text, View } from "react-native";

const ListCard = ({dataCategory}) => {
  return (
    <View className="flex-row rounded-lg bg-UIwhite w-full">
      <View className="card-image rounded-lg h-24 w-[40%] bg-slate-400">

      </View>
      <View className="card-info grow py-4 pl-6 flex-col items-start justify-center gap-0.5">
        <Text className="font-josefin mb-1 font-medium">
          {dataCategory.category}
        </Text>
        <Text numberOfLines={1} className="font-josefin font-light text-sm text-UIgray2">
          {dataCategory.hymns} Himnos
        </Text>
        <Text className="font-josefin font-extralight text-xs text-UIgray2">
          {dataCategory.favorites} Favoritos
        </Text>
      </View>
    </View>
  )
}

export default ListCard;