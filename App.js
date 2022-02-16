import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerScreen from './navigator/Drawer';

export default function App() { 
  return (    
    <NavigationContainer>
      <DrawerScreen />
    </NavigationContainer>
  );
}