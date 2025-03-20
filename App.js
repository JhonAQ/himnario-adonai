import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import Main from './src/views/Main';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "JosefinSans-Regular" };

export default function App() {
  const [loadedFonts] = useFonts({
    "JosefinSans-Regular": require("./assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-Medium": require("./assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-Light": require("./assets/fonts/JosefinSans-Light.ttf"),
    "JosefinSans-ExtraLight": require("./assets/fonts/JosefinSans-ExtraLight.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
    "JosefinSans-SemiBold": require("./assets/fonts/JosefinSans-SemiBold.ttf")
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
    <Main/>
  );
}