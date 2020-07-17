import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import TimerText from "./TimerText";

export default KeyboardKey = ({ value, handlePress }) => {
    return (
        <TouchableOpacity style={styles.keyboardKey} onPress={() => handlePress(value)}>
            <TimerText size="medium" color="light">
                {value}
            </TimerText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    keyboardKey: {
        flexDirection:"row",
        width: "33%",
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: "center",
        justifyContent: "center",
    }
})
