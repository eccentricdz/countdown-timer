import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TimerText from "./TimerText";

export default function TimeComponent(props) {
    return (
        <View style={styles.container}>
            <TimerText size="small" regular color="lighter">{props.header}</TimerText>
            <TimerText size="large">{props.value}</TimerText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
});
