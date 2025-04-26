import { StyleSheet, Text, View, Alert } from "react-native";
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
import { test } from "./src/db/databaseService"; // Añadir esta importación
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
  const [error, setError] = useState(null);

  useEffect(() => {
    // En la función prepareApp() de App.js
    async function prepareApp() {
      try {
        console.log("🔧 Iniciando carga de la app...");
    
        if (loadedFonts) {
          if (Platform.OS !== "web") {
            console.log("📦 Copiando/cargando base de datos...");
            try {
              // Primero inicializa la base de datos
              await setupDatabase();
              
              // Luego espera un pequeño intervalo para asegurar que todo esté listo
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Ahora prueba la base de datos
              const testResult = await test();
              console.log("📊 Resultado de prueba de base de datos:", testResult);
              
              if (!testResult.status) {
                throw new Error("La prueba de base de datos falló");
              }
            } catch (dbError) {
              console.error("Error de base de datos:", dbError);
              setError("No se pudo cargar la base de datos de himnos. Por favor reinstale la aplicación.");
            }
          }
    
          console.log("✅ Fuentes y BD listas. Ocultando splash...");
          await SplashScreen.hideAsync();
          setDbReady(true);
        }
      } catch (err) {
        console.error("❌ Error durante carga inicial:", err);
        await SplashScreen.hideAsync();
        setError("Ocurrió un error al iniciar la aplicación");
        setDbReady(true);
      }
    }

    prepareApp();
  }, [loadedFonts]);

  if (!loadedFonts || !dbReady) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>Por favor reinstale la aplicación o contacte a soporte.</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7'
  },
  errorText: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#e63946'
  },
  errorSubtext: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: '#6c757d'
  }
});
