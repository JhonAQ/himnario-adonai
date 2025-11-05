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
    <View className={className}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-josefinSemibold text-xl text-foreground">
          {title}
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
            <Text className="font-josefin text-sm text-primary-600">
              Ver todos →
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row justify-between flex-wrap gap-y-4">
        {children}
      </View>
    </View>
  );
}

export default Section;