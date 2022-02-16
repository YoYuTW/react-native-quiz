import React, { useContext, useEffect, useState } from "react";
import { MainTitleUpdate } from '../navigator/Drawer';
import { View, Text } from 'react-native';
import { Menu, Box, Pressable, HamburgerIcon } from 'native-base';

const greets = ["Hello", "你好", "こんにちは", "bonjour"];

export default function HomeScreen({ navigation, route }) {
  const handleTitle = useContext(MainTitleUpdate);

  const [greetingPhase, setGreetingPhase] = useState('Hello')

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      handleTitle(route.name)
    });

    return unsubscribe
  }, [navigation, route]);  

  return (
    <Box h="80%" w="90%" alignItems="flex-end">
      <Menu w="190" trigger={triggerProps => {
        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <HamburgerIcon />
              </Pressable>;
      }}>
        {greets.map((greet, id) => (
          <Menu.ItemOption key={id} onPress={() => setGreetingPhase(greet)}>{greet}</Menu.ItemOption> 
        ))}   
      </Menu>
      <Text>{greetingPhase}</Text> 
    </Box>      
    
  );
}