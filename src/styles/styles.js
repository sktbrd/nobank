// src/styles/styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
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
    suggestionButtonText: {
        fontSize: 16,
        color: 'black',
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
    },
    tableContainer: {
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff', // Optional: Add background color for better touch feedback
    },
    rowText: {
        fontSize: 14,
    },
    disconnectButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    textInput: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 80,
        fontSize: 16,
    },

    text: {
        color: 'black',
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
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    modalView: {
        margin: 30,
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
        elevation: 5,
        minHeight: 200,
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
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    suggestionButtonText: {
        fontSize: 16,
        color: 'black',
    },
    billsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    billImageContainer: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    billImage: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },
    billText: {
        marginTop: 5,
    },
    button: {
        backgroundColor: 'limegreen',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        minWidth: 200,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    sidebyside: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    closeButtonText: {
        color: 'tomato',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
});
