import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const ListCard = ({dataCategory}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={()=> navigation.navigate("IndexStack", {
        title: dataCategory.category, 
        cantidad: dataCategory.hymns, 
        ids: dataCategory.ids
      })} 
      className="flex-row rounded-xl bg-surface w-full shadow-sm border border-neutral-100 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
      }}
    >
      {/* Modern category image with icon */}
      <View className="h-20 w-20 bg-primary-100 flex items-center justify-center">
        <Ionicons name="musical-notes" size={24} color="#3B82F6" />
      </View>
      
      {/* Category info */}
      <View className="flex-1 py-4 px-4 flex-col justify-center">
        <Text className="font-josefinSemibold text-base text-foreground mb-1">
          {dataCategory.category}
        </Text>
        <Text className="font-josefin text-sm text-foreground-secondary">
          {dataCategory.hymns} himnos
        </Text>
      </View>
      
      {/* Chevron arrow */}
      <View className="flex items-center justify-center px-4">
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  )
}

export default ListCard;