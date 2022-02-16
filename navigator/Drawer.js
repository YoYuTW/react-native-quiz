import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NotificationScreen from "../component/Notification";
import TabScreen from "./BottomTab";

export const MainTitleUpdate = React.createContext();

export default function DrawerScreen() {
  const Drawer = createDrawerNavigator(); 
  const [mainTitle, setMainTitle] = useState("Home");

  return (
    <MainTitleUpdate.Provider value={setMainTitle}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Main" component={TabScreen} options={{ title: mainTitle }}/>
        <Drawer.Screen name="Notifications" component={NotificationScreen} />
      </Drawer.Navigator>
    </MainTitleUpdate.Provider>
  )
}

