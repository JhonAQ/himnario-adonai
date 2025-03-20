import { View, Text, TextInput } from 'react-native';
import SearchBar from './components/SearchBar';

const Main = () => {
  return (
    <View className="w-full h-full bg-slate-500 flex items-center justify-center">
      <View className="content h-full w-full p-7 flex bg-UIbase">
        <View className="header mt-8 gap-0.5">
          <Text className="font-josefinSemibold text-2xl">Himno del día</Text>
          <Text className="font-josefin font-medium">Himno 220 • Viento recio</Text>
          <Text className="font-josefin font-light text-sm text-gray-500">Abrir ahora</Text>
        </View>
        <SearchBar/>
      </View>
      <View className="tabs">

      </View>
    </View>
  );
};

export default Main;
