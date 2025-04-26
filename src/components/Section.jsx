import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Section = ({ title, className, children, onViewAll }) => {
  const navigation = useNavigation();
  
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };
  
  return (
    <View className={"" + " " + className}>
      <View className="flex-row justify-between items-end">
        <Text className="font-josefin text-xl">{title}</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text className="font-josefin font-light text-sm text-gray-500">{"Ver todos >"}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between flex-wrap gap-y-4 pt-5 ">
        {children}
      </View>
    </View>
  );
}

export default Section;