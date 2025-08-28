import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStackScreen from './HomeStackScreen';
import { useTabBar } from '../context/TabBarContext';
import IndexStackScreen from './IndexStackScreen';
import { HimnosContext } from '../context/HimnosContext';
import SettingsStackScreen from './SettingsStackScreen';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const { hideBar } = useTabBar();
  const { setSearchQuery } = useContext(HimnosContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Index'){
            iconName = focused ? 'menu' : 'menu-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: 'JosefinSans-Medium',
          fontSize: 11,
          marginTop: -2
        },
        headerShown: false,
        tabBarStyle: {
          display: hideBar ? 'none' : 'flex',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 5
        }
      })}
      screenListeners={{
        tabPress: () => {
          setSearchQuery("");
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Index" component={IndexStackScreen} options={{ title: 'Himnos' }} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} options={{ title: 'Configuración' }} />
      {/* prealphaversion */}
      {/* <Tab.Screen name="Favoritos" component={FavoritesStackScreen} /> */}
    </Tab.Navigator>
  );
}