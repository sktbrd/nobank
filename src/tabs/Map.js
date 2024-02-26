import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CashRequestModal from '../components/CashRequestModal';
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
});

const billImages = {
    1: require('../../assets/cash/1USD.png'), // Make sure these paths are correct
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

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={location}>
                {location && <Marker coordinate={location} title="You are here" description="Your location" />}
            </MapView>
            <TouchableOpacity style={styles.pickupButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Request Cash</Text>
            </TouchableOpacity>
            <CashRequestModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                cashCounts={cashCounts}
                addCashAmount={addCashAmount}
                setCashCounts={setCashCounts}
                billImages={billImages}
            />
        </View>
    );
};

export default Map;
