import React, { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { MainTitleUpdate } from '../navigator/Drawer';

export default function SettingScreen({ navigation, route }) {
  const handleTitle = useContext(MainTitleUpdate);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      handleTitle(route.name)
    });

    return unsubscribe
  }, [navigation, route]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}