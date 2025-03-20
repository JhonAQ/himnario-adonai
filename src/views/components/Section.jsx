import { Text, View } from "react-native";

const Section = ({ title, className, children }) => {
  return (
    <View className={"py-5" + " " + className}>
      <View className="flex-row justify-between items-end">
        <Text className="font-josefin text-xl">{title}</Text>
        <Text className="font-josefin font-light text-sm text-gray-500">{"Ver todos >"}</Text>
      </View>
      <View className="flex-row justify-between flex-wrap gap-y-4 py-5 bg-slate-100">
        {children}
      </View>
    </View>
  );
}

export default Section;