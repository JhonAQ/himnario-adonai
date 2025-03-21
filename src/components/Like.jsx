import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

const Like = ({like, className}) => {
  return (

    <View className={"flex-row items-center justify-center rounded-full bg-UIwhite h-[33px] w-[33px] p-1" + " " + className}>
      {
        like ?
          <MaterialCommunityIcons className='translate-y-0.5' name="cards-heart" size={21} color="black" />
          :
          <MaterialCommunityIcons className='translate-y-0.5' name="cards-heart-outline" size={24} color="black" />
      }
    </View>
  )
}

export default Like;