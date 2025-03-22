import { useFocusEffect } from "@react-navigation/native";
import { useTabBar } from "../context/TabBarContext";
import Index from "../views/Index";

const Favorites = () => {
  const { setHideBar } = useTabBar();
  useFocusEffect(() => {
    setHideBar(true);
  });
  return <Index></Index>
}

export default Favorites;