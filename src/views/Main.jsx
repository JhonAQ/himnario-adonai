import {ScrollView, View, Text, TextInput } from 'react-native';
import SearchBar from './components/SearchBar';
import Section from './components/Section';
import CardHymn from './components/CardHymn';

const Main = () => {
  return (
    <View className="w-full h-full bg-slate-500 flex items-center justify-center">

      <ScrollView className="content h-full w-full p-7 flex bg-UIbase">
        <View className="header mt-8 gap-0.5">
          <Text className="font-josefinSemibold text-2xl">Himno del día</Text>
          <Text className="font-josefin font-medium">Himno 220 • Viento recio</Text>
          <Text className="font-josefin font-light text-sm text-gray-500">Abrir ahora</Text>
        </View>
        <SearchBar className="mt-7" />
        <Section title="Vistos recientemente">
          <CardHymn></CardHymn>
          <CardHymn></CardHymn>
        </Section>
      </ScrollView>

      <View className="">

      </View>
    </View>
  );
};

export default Main;
