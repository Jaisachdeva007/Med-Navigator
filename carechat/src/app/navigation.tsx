
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";


import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";   
import SearchScreen from "./screens/SearchScreen";

const Tab = createBottomTabNavigator();

export default function RootNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 5,
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "Chat") {
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            } else if (route.name === "Clinics") {
              iconName = focused ? "medkit" : "medkit-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else {
              iconName = "ellipse"; 
            }

            return <Ionicons name={iconName} size={28} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Clinics" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
