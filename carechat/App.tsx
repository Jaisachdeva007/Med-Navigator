import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import RootNav from "./src/app/navigation";

export default function App() {
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:"#f7f7fb" }}>
      <StatusBar barStyle="dark-content" />
      <RootNav />
    </SafeAreaView>
  );
}npx expo start