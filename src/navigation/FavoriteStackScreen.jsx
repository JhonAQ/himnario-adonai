import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screens/Favorites";
import Hymn from "../views/Hymn";

const FavoritesStack = createStackNavigator();

export default function FavoritesStackScreen() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="FavoritesMain" component={Favorites} />
      <FavoritesStack.Screen name="HymnStack" component={Hymn} />
    </FavoritesStack.Navigator>
  );
}
