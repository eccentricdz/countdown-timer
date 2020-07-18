import React from "react";
import KeyboardKey from "./KeyboardKey";
import { View, StyleSheet } from "react-native";

export default Keyboard = ({ handlePress, handleDelete }) => {
    let keyboardKeys = [];
    for (let i = 9; i >= 0; i--) {
        if (i > 0)
            keyboardKeys.push(<KeyboardKey key={i} value={i} handlePress={handlePress}></KeyboardKey>);
        else {
            keyboardKeys.push(
                <KeyboardKey key="none" value=""></KeyboardKey>,
                <KeyboardKey key="0" value={0} handlePress={handlePress}></KeyboardKey>,
                <KeyboardKey key="del" value="del" handlePress={handleDelete}></KeyboardKey>
            );
        }
    }

    return <View style={styles.container}>{keyboardKeys}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center'
    },
});
