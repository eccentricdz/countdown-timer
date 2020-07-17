import React from "react";
import { Text, StyleSheet } from "react-native";
import Theme from "./theme.json";

import {
    useFonts,
    Oswald_500Medium,
    Oswald_400Regular,
} from "@expo-google-fonts/oswald";

export default TimerText = (props) => {
    let stylesArray = [];

    let [oswaldFontAvailable] = useFonts({
        Oswald_500Medium,
        Oswald_400Regular,
    });

    if (oswaldFontAvailable) {
        stylesArray.push(styles.text);
        if (props.regular) stylesArray.push(styles.regular);
        if (props.size) stylesArray.push(styles[props.size]);
        if (props.color) stylesArray.push(styles[props.color]);
    }

    return <Text style={stylesArray}>{props.children}</Text>;
};

const styles = StyleSheet.create({
    text: {
        textTransform: "uppercase",
        fontFamily: "Oswald_500Medium",
        color: "white",
        fontSize: 24,
    },
    // weight
    regular: {
        fontFamily: "Oswald_400Regular",
    },
    // size
    small: {
        fontSize: 14,
    },
    large: {
        fontSize: 64,
    },
    medium: {
        fontSize: 36,
    },
    // color
    lighter: {
        color: Theme.secondaryColor,
    },
    light: {
        color: Theme.grey,
    },
});
