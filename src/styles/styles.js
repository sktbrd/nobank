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
        backgroundColor: 'limegreen',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    suggestionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    suggestionButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 5,
    },
    suggestionButtonText: {
        fontSize: 16,
        color: 'black',
    },
});
