import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import Theme from "./theme.json";
import TimerText from "./TimerText";
import Time from "./Time";
import Keyboard from "./Keyboard";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

function normalizeTimeComponent(timeComponent) {
    if (timeComponent > 9) return timeComponent;
    else return `0${timeComponent}`;
}

function timeArrayToTime(timeArray) {
    let seconds = timeArray[4] * 10 + timeArray[5];
    let minutes = timeArray[2] * 10 + timeArray[3];
    let hours = timeArray[0] * 10 + timeArray[1];

    if (seconds > 59) {
        seconds -= 60;
        minutes += 1;
    }

    if (minutes > 60) {
        minutes -= 60;
        hours += 1;
    }

    return { seconds, minutes, hours };
}

const Homescreen = ({ navigation }) => {
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
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                    navigation.navigate("Action", {
                        timeArray,
                    })
                }
            >
                <LinearGradient
                    style={styles.primaryButton}
                    colors={["#FCB045", "#FD1D1D", "#833AB4"]}
                    start={[0, 0.5]}
                    end={[1, 0.5]}
                >
                    <TimerText>Start</TimerText>
                </LinearGradient>
            </TouchableOpacity>
            <StatusBar style="dark"></StatusBar>
        </View>
    );
};

const Actionscreen = ({
    navigation,
    route: {
        params: { timeArray },
    },
}) => {
    const initialTime = useRef(timeArrayToTime(timeArray));
    const [time, setTime] = useState(initialTime.current);
    const [isPaused, setPaused] = useState(false);

    const { hours, minutes, seconds } = time;
    let timer = useRef();

    useEffect(() => {
        if (isPaused) return;
        timer.current = setTimeout(() => {
            if ((hours === 0 && seconds === 0 && minutes === 0) || isPaused) {
                clearInterval(timer);
                return;
            }
            let newSeconds = seconds - 1;
            let newHours = hours;
            let newMinutes = minutes;
            if (newSeconds == -1) {
                if (minutes == 0) {
                    if (hours > 1) {
                        newHours -= 1;
                        newMinutes = 59;
                        newSeconds = 59;
                    } else newSeconds = 0;
                } else {
                    newMinutes -= 1;
                    newSeconds = 59;
                }
            }

            setTime({
                seconds: newSeconds,
                minutes: newMinutes,
                hours: newHours,
            });
        }, 1000);
    }, [time, isPaused]);

    useEffect(() => {
        if (isPaused) clearInterval(timer.current);
    }, [isPaused]);

    return (
        <View style={[styles.container, styles.actionContainer]}>
            <View style={styles.actionFooter}>
                <View>
                    <TimerText size="medium">
                        {normalizeTimeComponent(time.hours)}
                    </TimerText>
                    <TimerText size="medium">
                        {normalizeTimeComponent(time.minutes)}
                    </TimerText>
                    <TimerText size="medium">
                        {normalizeTimeComponent(time.seconds)}
                    </TimerText>
                </View>
                <View style={styles.actionTools}>
                    <TouchableOpacity
                        onPress={() => {
                            isPaused ? setPaused(false) : setPaused(true);
                        }}
                    >
                        <TimerText>{isPaused ? "play" : "pause"}</TimerText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setTime(initialTime.current);
                            setPaused(true);
                        }}
                    >
                        <TimerText>Reset</TimerText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <TimerText>Delete</TimerText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Homescreen}></Stack.Screen>
                <Stack.Screen
                    name="Action"
                    component={Actionscreen}
                ></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
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
    },
    primaryButton: {
        width: "100%",
        height: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    actionContainer: {
        justifyContent: "flex-end",
        alignItems: "stretch",
    },
    actionFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionTools: {
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
});
