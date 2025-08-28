import { TextInput, View, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from "react";
import { HimnosContext } from "../context/HimnosContext";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ className }) => {
  const { searchQuery, setSearchQuery, searchHymns, isSearching } = useContext(HimnosContext);
  const navigation = useNavigation();
  const [localSearching, setLocalSearching] = useState(false);
  
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLocalSearching(true);
      
      try {
        await searchHymns(searchQuery);
        navigation.navigate('SearchResults', { query: searchQuery });
        setSearchQuery("");
      } catch (error) {
        console.error("Error en búsqueda:", error);
      } finally {
        setLocalSearching(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const searching = isSearching || localSearching;

  return (
    <View className={`relative ${className}`}>
      <View className="relative flex-row items-center">
        {/* Modern search input with better styling */}
        <TextInput
          className={`
            bg-surface-secondary rounded-xl py-4 px-5 pr-14 w-full 
            font-josefin text-base text-foreground
            border border-neutral-200 
            ${searching ? "opacity-70" : ""}
            focus:border-primary-300 focus:bg-surface
          `}
          placeholder={searching ? "Buscando..." : "Busca por número o título"}
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          editable={!searching}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1
          }}
        />
        
        {/* Clear button */}
        {searchQuery && !searching ? (
          <TouchableOpacity 
            onPress={clearSearch}
            className="absolute right-14 p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
        
        {/* Search button / Loading indicator */}
        {searching ? (
          <View className="absolute right-4 flex-row items-center">
            <ActivityIndicator size="small" color="#3B82F6" />
          </View>
        ) : (
          <TouchableOpacity 
            onPress={handleSearch}
            className="absolute right-4 p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Status text */}
      {searching && (
        <Text className="text-center text-sm text-foreground-secondary mt-3 font-josefin">
          Buscando himnos que coincidan...
        </Text>
      )}
    </View>
  );
};

export default SearchBar;