import React from "react";
import TimeComponent from "./TimeComponent";
import TimerText from "./TimerText";
import { StyleSheet, View } from "react-native";

export default Time = ({ timeArray }) => {
    return (
        <View style={styles.container}>
            <TimeComponent header="hours" value={`${timeArray[0]}${timeArray[1]}`}></TimeComponent>
            <TimerText size="large">:</TimerText>
            <TimeComponent header="minutes" value={`${timeArray[2]}${timeArray[3]}`}></TimeComponent>
            <TimerText size="large">:</TimerText>
            <TimeComponent header="seconds" value={`${timeArray[4]}${timeArray[5]}`}></TimeComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
});

