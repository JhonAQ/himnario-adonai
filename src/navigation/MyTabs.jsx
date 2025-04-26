import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Favorites from '../screens/Favorites';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStackScreen from './HomeStackScreen';
import { useTabBar } from '../context/TabBarContext';
import FavoritesStackScreen from './FavoriteStackScreen';
import Index from '../views/Index';
import IndexStackScreen from './IndexStackScreen'
import { HimnosContext } from '../context/HimnosContext';


const Tab = createBottomTabNavigator();

export default function MyTabs() {

  const { hideBar } = useTabBar();
  const {setSearchQuery} = useContext(HimnosContext)

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
            iconName = focused ? 'menu' : 'menu-outline'
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle:{
          display: hideBar ? 'none' : 'flex'
        }
      })}
      screenListeners={{
        tabPress: () => {
          setSearchQuery("");
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Index" component={IndexStackScreen}/>
      {/* prealphaversion */}
      {/* <Tab.Screen name="Favoritos" component={FavoritesStackScreen} /> */}
    </Tab.Navigator>
  );
}
