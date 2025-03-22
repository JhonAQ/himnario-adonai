import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyTabs from "./src/navigation/MyTabs";
import { TabBarProvider } from "./src/context/TabBarContext";
import { Platform } from "react-native";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "JosefinSans-Regular" };

const Tab = createBottomTabNavigator();

export default function App() {
  const [loadedFonts] = useFonts({
    "JosefinSans-Regular": require("./assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-Medium": require("./assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-Light": require("./assets/fonts/JosefinSans-Light.ttf"),
    "JosefinSans-ExtraLight": require("./assets/fonts/JosefinSans-ExtraLight.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
    "JosefinSans-SemiBold": require("./assets/fonts/JosefinSans-SemiBold.ttf"),
  });

  useEffect(() => {
    async function hideSplashScreen() {
      if (loadedFonts) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplashScreen();
  }, [loadedFonts]);

  if (!loadedFonts) {
    return null;
  }

  return (
    <View className={"h-full " + (Platform.OS === "web" ? "w-full max-w-[400px] mx-auto" : "w-full")}>
      <TabBarProvider>
        <NavigationContainer>
          <MyTabs />
        </NavigationContainer>
      </TabBarProvider>
    </View>
  );
}
