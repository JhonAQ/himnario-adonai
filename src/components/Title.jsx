import Entypo from '@expo/vector-icons/Entypo';
import { View, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';


const Title = ({ title }) => {
const navigation = useNavigation();
  return (
    <View className='title -translate-x-2 mb-5 flex-row justify-start items-center gap-2 '>
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
        <Entypo className='' name="chevron-small-left" size={24} color="black" />
      </TouchableOpacity>
      <Text className="font-josefin font-semibold leading-none translate-y-0.5 text-xl">
        {title}
      </Text>
    </View>
  )
}
export default Title;