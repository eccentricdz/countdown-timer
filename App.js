import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import Theme from "./theme.json";
import TimerText from "./TimerText";
import Time from "./Time";
import Keyboard from "./Keyboard";
import { StyleSheet, View, TouchableOpacity } from "react-native";

export default function App() {
    const [timeArray, setTimeArray] = useState([0, 0, 0, 0, 0, 0]);

    const handlePress = (newValue) => {
        timeArray.shift();
        timeArray.push(newValue);
        setTimeArray([].concat(timeArray));
    };

    const handleDelete = () => {
        timeArray.pop();
        timeArray.unshift(0);
        setTimeArray([].concat(timeArray));
    };

    return (
        <View style={styles.container}>
            <TimerText regular>Timer</TimerText>
            <Time timeArray={timeArray}></Time>
            <Keyboard
                handlePress={handlePress}
                handleDelete={handleDelete}
            ></Keyboard>
            <TouchableOpacity style={styles.primaryButton}>
                <LinearGradient style={styles.primaryButton} colors={['#FCB045', '#FD1D1D', '#833AB4']} start={[0, 0.5]} end={[1, 0.5]}>
                    <TimerText>Start</TimerText>
                </LinearGradient>
            </TouchableOpacity>
            <StatusBar style="inverted"></StatusBar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: Theme.backgroundColor,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 30,
        paddingTop: 60,
    },
    primaryButton: {
        width: "100%",
        height: 70,
        alignItems: "center",
        justifyContent: "center"
    },
});
