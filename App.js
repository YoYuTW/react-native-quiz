import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerScreen from './navigator/Drawer';
import { NativeBaseProvider } from 'native-base';

export default function App() { 
  return (    
    <NativeBaseProvider>
      <NavigationContainer>
        <DrawerScreen />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}