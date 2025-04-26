import { createStackNavigator } from "@react-navigation/stack";
import Index from "../views/Index";
import Hymn from "../views/Hymn";
import Home from "../screens/Home";
import SearchResults from "../views/SearchResults";
import RecentHymns from "../views/RecentHymns";

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeStack" component={Home} />
      <HomeStack.Screen name="IndexStack" component={Index} />
      <HomeStack.Screen name="HymnStack" component={Hymn} />
      <HomeStack.Screen name="SearchResults" component={SearchResults} />
      <HomeStack.Screen name="RecentHymns" component={RecentHymns} />
    </HomeStack.Navigator>
  )
}