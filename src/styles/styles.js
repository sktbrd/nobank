// src/styles/styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    pickupButton: {
        position: 'absolute',
        top: '85%',
        alignSelf: 'center',
        width: '70%',
        backgroundColor: 'limegreen',
        padding: 10,
        borderRadius: 10,
    },
    textInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 80,
        fontSize: 16,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});
