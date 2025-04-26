import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyTabs from "./src/navigation/MyTabs";
import { TabBarProvider } from "./src/context/TabBarContext";
import { Platform } from "react-native";
import { setupDatabase } from "./src/db/setupDatabase";
import { HimnosProvider } from "./src/context/HimnosContext";

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

  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        console.log("🔧 Iniciando carga de la app...");

        if (loadedFonts) {
          if (Platform.OS !== "web") {
            console.log("📦 Copiando/cargando base de datos...");
            await setupDatabase();
          }

          console.log("✅ Fuentes y BD listas. Ocultando splash...");
          await SplashScreen.hideAsync();
          setDbReady(true);
        }
      } catch (err) {
        console.error("❌ Error durante carga inicial:", err);
        await SplashScreen.hideAsync(); // importante mostrar la UI aunque haya error
        setDbReady(true);
      }
    }

    prepareApp();
  }, [loadedFonts]);

  if (!loadedFonts || !dbReady) {
    return null;
  }

  return (
    <View
      className={
        "h-full " +
        (Platform.OS === "web" ? "w-full max-w-[400px] mx-auto" : "w-full")
      }
    >
      <HimnosProvider>
        <TabBarProvider>
          <NavigationContainer>
            <MyTabs />
          </NavigationContainer>
        </TabBarProvider>
      </HimnosProvider>
    </View>
  );
}
