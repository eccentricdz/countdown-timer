import { StatusBar } from "expo-status-bar";
import React from "react";
import Theme from "./theme.json";
import { StyleSheet, Text, View } from "react-native";
import {
  useFonts,
  Oswald_500Medium,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";

export default function App() {
  let [oswaldFontAvailable] = useFonts({ Oswald_500Medium, Oswald_400Regular });
  if (oswaldFontAvailable) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text]}>Timer</Text>
        <StatusBar style="inverted"></StatusBar>
      </View>
    );
  } else {
    return <Text>Loading</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundColor,
    alignItems: "center",
    padding: 30,
    paddingTop: 60,
  },
  text: {
    textTransform: "uppercase",
    fontFamily: "Oswald_500Medium",
    color: "white",
    fontSize: 24
  },
  regularText: {
    fontFamily: "Oswald_400Regular",
  },
});
