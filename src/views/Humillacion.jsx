import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Heart, Search, Home, Settings } from "lucide-react-native";
import { useState } from "react";

export default function HymnsScreen() {
  const [search, setSearch] = useState("");

  const recentlyViewed = [
    { id: "1", title: "Hymns 28 • 6 Verses", subtitle: "To God be the Glory • F#", category: "Song of Praise" },
    { id: "2", title: "Hymns 28 • 6 Verses", subtitle: "To God be the Glory • F#", category: "Song of Praise" },
  ];

  const classifications = [
    { id: "1", title: "Song of Praise", details: "50 Hymns • (1 - 49)", favorites: "15 Favourites" },
    { id: "2", title: "14 Hymns", details: "(50 - 63)", favorites: "5 Favourites" },
  ];

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-semibold">Hymns of the Day</Text>
      <Text className="text-gray-500">Hymns 23 • Great is thy faithfulness</Text>
      <Text className="text-gray-500">Open Now</Text>

      <View className="flex-row items-center bg-gray-200 rounded-xl px-4 py-2 mt-4">
        <Search size={20} color="gray" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Type a Number, Word or Lyrics"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View className="mt-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold">Recently Viewed</Text>
          <TouchableOpacity>
            <Text className="text-gray-500">See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentlyViewed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="w-48 bg-white rounded-xl p-4 mt-2 mr-4 shadow">
              <TouchableOpacity className="absolute top-2 right-2">
                <Heart size={20} color="black" />
              </TouchableOpacity>
              <Text className="font-semibold">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
              <Text className="text-gray-400 text-xs">{item.category}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View className="mt-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold">Classification</Text>
          <TouchableOpacity>
            <Text className="text-gray-500">See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={classifications}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl p-4 mt-2 shadow">
              <Text className="font-semibold">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.details}</Text>
              <Text className="text-gray-400 text-xs">{item.favorites}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-white py-4 flex-row justify-around border-t">
        <TouchableOpacity className="items-center">
          <Home size={24} color="black" />
          <Text className="text-xs">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Heart size={24} color="black" />
          <Text className="text-xs">Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Settings size={24} color="black" />
          <Text className="text-xs">Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
