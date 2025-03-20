import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import Main from './src/views/Main';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useCallback } from 'react';

SplashScreen.preventAutoHideAsync();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "JosefinSans-Regular" };

export default function App() {
  const [loadedFonts] = useFonts({
    "JosefinSans-Regular": require("./assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-Medium": require("./assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-Light": require("./assets/fonts/JosefinSans-Light.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
    "JosefinSans-SemiBold": require("./assets/fonts/JosefinSans-SemiBold.ttf")
  });

  const onLayoutRootView = useCallback(async () => {
    if (loadedFonts) {
      await SplashScreen.hideAsync();
    }
  }, [loadedFonts]);

  if (!loadedFonts) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Main />
    </View>
  );
}