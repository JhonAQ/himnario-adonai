import { TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useContext } from "react";
import { HimnosContext } from "../context/HimnosContext";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ className }) => {
  const { searchQuery, setSearchQuery, searchHymns, isSearching } = useContext(HimnosContext);
  const navigation = useNavigation();
  
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchHymns(searchQuery);
      if (results.length > 0) {
        // Navegar a la vista de resultados de búsqueda
        navigation.navigate('SearchResults', { query: searchQuery });
        
        // Limpiar el texto de búsqueda después de navegar
        setSearchQuery("");
      }
    }
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View className={`relative flex-row items-center ${className}`}>
      <TextInput
        className="bg-gray-200 rounded-full py-3 px-5 pr-10 w-full font-josefin"
        placeholder="Busca por número o título"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      
      {searchQuery ? (
        // Si hay texto, mostrar botón de limpiar
        <TouchableOpacity 
          onPress={clearSearch}
          className="absolute right-12"
        >
          <Ionicons name="close-circle" size={18} color="gray" />
        </TouchableOpacity>
      ) : null}
      
      {isSearching ? (
        <ActivityIndicator 
          size="small" 
          className="absolute right-4"
        />
      ) : (
        <TouchableOpacity 
          onPress={handleSearch}
          className="absolute right-4"
        >
          <Ionicons name="search" size={20} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;