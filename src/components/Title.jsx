import Entypo from '@expo/vector-icons/Entypo';
import {View, Text } from "react-native";

const Title = ({ title }) => {
  return (
    <View className='title -translate-x-2 mb-5 flex-row justify-start items-center gap-2 '>
      <Entypo className='' name="chevron-small-left" size={24} color="black" />
      <Text className="font-josefin font-semibold leading-none translate-y-0.5 text-xl">
        {title}
      </Text>
    </View>
  )
}
export default Title;