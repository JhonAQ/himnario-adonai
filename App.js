import { Text, View } from "react-native";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyTabs from "./src/navigation/MyTabs";
import { TabBarProvider } from "./src/context/TabBarContext";
import { Platform } from "react-native";
import { HimnosProvider } from "./src/context/HimnosContext";
import { DatabaseProvider } from "./src/context/DatabaseProvider";
import LoggerService from "./src/services/LoggerService";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "JosefinSans-Regular" };

export default function App() {
  const [loadedFonts] = useFonts({
    "JosefinSans-Regular": require("./assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-Medium": require("./assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-Light": require("./assets/fonts/JosefinSans-Light.ttf"),
    "JosefinSans-ExtraLight": require("./assets/fonts/JosefinSans-ExtraLight.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
    "JosefinSans-SemiBold": require("./assets/fonts/JosefinSans-SemiBold.ttf"),
  });

  const [appReady, setAppReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function prepareApp() {
      try {
        await LoggerService.initialize();
        await LoggerService.info("App", "🔧 Iniciando carga de la app...");
        await LoggerService.debug(
          "App",
          `Plataforma: ${Platform.OS}, Modo desarrollo: ${__DEV__}`
        );

        if (loadedFonts) {
          await LoggerService.success(
            "App",
            "✅ Fuentes cargadas correctamente"
          );
          await SplashScreen.hideAsync();
          setAppReady(true);
        }
      } catch (err) {
        console.error("❌ Error durante carga inicial:", err);
        await LoggerService.error("App", "Error durante carga inicial", err);
        setError("Ocurrió un error al iniciar la aplicación");
        await SplashScreen.hideAsync();
        setAppReady(true);
      }
    }

    prepareApp();
  }, [loadedFonts]);

  if (!loadedFonts || !appReady) {
    return null;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="font-josefinSemibold text-lg text-center mb-4 text-error">
          {error}
        </Text>
        <Text className="font-josefin text-base text-center text-foreground-secondary">
          Por favor reinstale la aplicación o contacte a soporte.
        </Text>
      </View>
    );
  }

  return (
    <DatabaseProvider>
      <HimnosProvider>
        <TabBarProvider>
          <NavigationContainer>
            <MyTabs />
          </NavigationContainer>
        </TabBarProvider>
      </HimnosProvider>
    </DatabaseProvider>
  );
}
