import { createStackNavigator } from "@react-navigation/stack";
import Index from "../views/Index";
import Hymn from "../views/Hymn";
import SearchResults from "../views/SearchResults";

const IndexStack = createStackNavigator();

const IndexWithFlag = (props) => <Index index={true} {...props} />;

const IndexStackScreen = () => {
  return (
    <IndexStack.Navigator screenOptions={{headerShown: false}}>
      <IndexStack.Screen 
        name="IndexMain" 
        component={IndexWithFlag} 
      />
      <IndexStack.Screen 
        name="HymnStack" 
        component={Hymn}
      />
      <IndexStack.Screen 
        name="SearchResults" 
        component={SearchResults}
      />
    </IndexStack.Navigator>
  )
}

export default IndexStackScreen;