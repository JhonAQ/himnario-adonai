import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

const Like = ({like, className}) => {
  return (

    <View className={"flex items-center justify-center rounded-full bg-UIwhite p-1" + " " + className}>
      {
        like ?
          <MaterialCommunityIcons name="cards-heart" size={21} color="black" />
          :
          <MaterialCommunityIcons name="cards-heart-outline" size={24} color="black" />
      }
    </View>
  )
}

export default Like;