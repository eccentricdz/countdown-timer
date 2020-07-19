import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import React, { useState, useEffect, useRef } from "react";
import Theme from "./theme.json";
import TimerText from "./TimerText";
import Time from "./Time";
import Keyboard from "./Keyboard";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Easing } from "react-native-reanimated";

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
        </View>
    );
};

const timeToDuration = ({ seconds, minutes, hours }) =>
    seconds + minutes * 60 + hours * 3600;

const Actionscreen = ({
    navigation,
    route: {
        params: { timeArray },
    },
}) => {
    const initialTime = useRef(timeArrayToTime(timeArray)).current;
    const [time, setTime] = useState(initialTime);
    const [isPaused, setPaused] = useState(false);
    const [isReset, setReset] = useState(false);
    const [isTimeUp, setTimeUp] = useState(false);
    const gradientCurrentHeight = useRef(new Animated.Value(0)).current;
    const timeUpSound = useRef(new Audio.Sound()).current;
    const [audioLoaded, setAudioLoaded] = useState(false);

    let timer = useRef();

    function resetGradient() {
        timeUpSound.stopAsync();
        Animated.timing(gradientCurrentHeight, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start(() => {
            setReset(false);
            setTimeUp(false);
        });
    }

    async function handleTimeUp() {
        setTimeUp(true);
        clearInterval(timer.current);

        if (audioLoaded) await timeUpSound.playAsync();
    }

    function loadAudio() {
        timeUpSound
            .loadAsync(require("./assets/timeup.mp3"))
            .then((status) => setAudioLoaded(status.isLoaded))
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => loadAudio(), []);

    useEffect(() => {
        if (isPaused && !isReset) {
            Animated.timing(gradientCurrentHeight).stop();
        } else if (isPaused && isReset) {
            resetGradient();
        } else {
            Animated.timing(gradientCurrentHeight, {
                toValue: 100,
                duration: timeToDuration(time) * 1000,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();
        }
    }, [isPaused, isReset]);

    useEffect(() => {
        const { hours, minutes, seconds } = time;
        if (isPaused) {
            clearInterval(timer.current);
            return;
        }
        if (hours === 0 && seconds === 0 && minutes === 0) {
            handleTimeUp();
            return;
        }
        timer.current = setTimeout(() => {
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

    return (
        <View style={[styles.container, styles.actionContainer]}>
            <Animated.View
                style={[
                    styles.gradientContainer,
                    {
                        height: gradientCurrentHeight.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0, Dimensions.get("window").height],
                        }),
                    },
                ]}
            >
                <LinearGradient
                    style={{ height: "100%" }}
                    colors={["#FCB045", "#FD1D1D", "#833AB4"]}
                    start={[0.5, 0]}
                    end={[0.5, 1]}
                ></LinearGradient>
            </Animated.View>
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
                            if (isTimeUp) return;
                            isPaused ? setPaused(false) : setPaused(true);
                        }}
                    >
                        <TimerText>
                            {isTimeUp ? "time up" : isPaused ? "play" : "pause"}
                        </TimerText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setPaused(true);
                            setReset(true);
                            setTime(initialTime);
                        }}
                    >
                        <TimerText>Reset</TimerText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            timeUpSound.stopAsync();
                            navigation.goBack();
                        }}
                    >
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
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={Homescreen}></Stack.Screen>
                <Stack.Screen
                    name="Action"
                    component={Actionscreen}
                ></Stack.Screen>
            </Stack.Navigator>
            <StatusBar style="inverted"></StatusBar>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
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
        justifyContent: "center",
    },
    actionContainer: {
        justifyContent: "flex-end",
        alignItems: "stretch",
        padding: 0,
    },
    actionFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 30,
    },
    actionTools: {
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    gradientContainer: {
        width: "100%",
        position: "absolute",
        top: 0,
    },
});
