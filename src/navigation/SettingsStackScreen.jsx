import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../views/SettingsScreen";
import DiagnosticsScreen from "../views/DiagnosticsScreen";

const SettingsStack = createStackNavigator();

export default function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="Diagnostics" component={DiagnosticsScreen} />
    </SettingsStack.Navigator>
  );
}