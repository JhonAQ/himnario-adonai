import Entypo from '@expo/vector-icons/Entypo';
import {View, Text } from "react-native";

const Title = ({ title }) => {
  return (
    <View className='title mb-5 flex-row items-center gap-2 '>
      <Entypo name="chevron-small-left" size={24} color="black" />
      <Text className="font-josefin font-medium leading-none translate-y-0.5 text-xl">
        {title}
      </Text>
    </View>
  )
}
export default Title;