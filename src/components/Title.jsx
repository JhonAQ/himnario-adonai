import Entypo from '@expo/vector-icons/Entypo';
import { View, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const Title = ({ title, index=false }) => {
  const navigation = useNavigation();
  
  return (
    <View className='flex-row items-center gap-3'>
      {!index ? (
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2 rounded-full bg-surface-secondary"
        >
          <Entypo name="chevron-small-left" size={24} color="#374151" />
        </TouchableOpacity>
      ) : null}
      
      <Text className="font-josefinSemibold text-2xl text-foreground leading-tight">
        {title}
      </Text>
    </View>
  )
}

export default Title;