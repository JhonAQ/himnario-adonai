import { Text, View } from "react-native";

const Section = ({ title, className, children }) => {
  return (
    <View className={"" + " " + className}>
      <View className="flex-row justify-between items-end">
        <Text className="font-josefin text-xl">{title}</Text>
        <Text className="font-josefin font-light text-sm text-gray-500">{"Ver todos >"}</Text>
      </View>
      <View className="flex-row justify-between flex-wrap gap-y-4 pt-5 ">
        {children}
      </View>
    </View>
  );
}

export default Section;