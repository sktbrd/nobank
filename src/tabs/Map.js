import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    pickupButton: {
        padding: 10,
        backgroundColor: 'blue',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    suggestionButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    suggestionButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 5,
        margin: 5,
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
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '70%',
        marginBottom: 10,
    },
});

const billImages = {
    1: require('../../assets/cash/1USD.png'),
    5: require('../../assets/cash/5USD.png'),
    10: require('../../assets/cash/10USD.png'),
    20: require('../../assets/cash/20USD.png'),
    50: require('../../assets/cash/50USD.png'),
    100: require('../../assets/cash/100USD.png'),
};

const Map = () => {
    const [location, setLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cashCounts, setCashCounts] = useState({});

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    const addCashAmount = (amount) => {
        setCashCounts((prevCounts) => ({
            ...prevCounts,
            [amount]: (prevCounts[amount] || 0) + 1,
        }));
    };

    const renderBillImages = () => {
        return Object.entries(cashCounts).map(([amount, count]) => (
            <View key={amount} style={styles.billImageContainer}>
                <Image source={billImages[amount]} style={styles.billImage} />
                <Text style={styles.billText}>{`${count}x ${amount} USD`}</Text>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            {/* <TextInput type="text" style={styles.textInput} placeholder="Enter your address" /> */}
            <MapView style={styles.map} initialRegion={location}>
                {location && <Marker coordinate={location} title="You are here" description="Your location" />}
            </MapView>
            <TouchableOpacity style={styles.pickupButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Request Cash</Text>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView contentContainerStyle={styles.billsGrid}>
                            {renderBillImages()}
                        </ScrollView>
                        <View style={styles.suggestionButtonsContainer}>
                            {[1, 5, 10, 20, 50, 100].map((amount) => (
                                <TouchableOpacity key={amount} style={styles.suggestionButton} onPress={() => addCashAmount(amount)}>
                                    <Text style={styles.suggestionButtonText}>+{amount}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.pickupButton} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pickupButton} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.buttonText}>Pickup</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pickupButton} onPress={() => setCashCounts({})}>
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
        </View >
    );
};

export default Map;