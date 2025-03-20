import { Text, View, TextInput } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";

const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);
  useEffect(()=> {
    console.log(isActive ? "Esta en foco" : "No esta en foco")
  }, [isActive]);
  return (
    <View className="rounded-2xl flex bg-UIwhite flex-row justify-between items-center px-2 pl-2 pr-3">
      <TextInput maxLength={40} onFocus={() => {setIsActive(true)}} onBlur={()=>{setIsActive(false)}} placeholderTextColor="#d7d7d7"className="text-UIblack" placeholder={isActive? "": "Escribe un número, palabra o letra" }/>
      <Ionicons name="search" color={isActive ? "black" : "#d7d7d7"} size={20} className="flex justify-center items-center" />
    </View>
  );
};

export default SearchBar;