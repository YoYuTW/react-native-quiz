import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../component/HomeScreen';
import DataScreen from '../component/DataScreen';
import SettingScreen from '../component/SettingScreen';

export default function TabScreen() {
  const Tab = createBottomTabNavigator();  

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon:({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        } else if (route.name === "Data") {
          iconName = focused
            ? 'ios-list'
            : 'ios-list-outline';
        } else {
          iconName = focused
            ? 'settings'
            : 'settings-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Data" component={DataScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}