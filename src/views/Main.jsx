import { View, Text } from 'react-native';

const Main = () => {
  return (
    <View className="w-full h-full bg-slate-500 flex items-center justify-center">
      <View className="content h-full w-full p-7 flex bg-slate-50">
        <View className="header mt-8 gap-0.5">
          <Text className="font-josefin text-2xl font-bold">¡Himno del día!</Text>
          <Text className="font-josefin font-medium">Himno 220 - Viento recio</Text>
          <Text className="font-josefin font-light text-sm text-gray-500">Abrir ahora</Text>
        </View>
      </View>
      <View className="tabs">

      </View>
    </View>
  );
};

export default Main;
