import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CashRequestModal from '../components/CashRequestModal';
import { styles } from '../styles/styles';

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

    const [terminals, setTerminals] = useState([]);
    useEffect(() => {
        const OnlineTerminals = async () => {
            try {
                const response = await fetch('https://cash2btc.com/api/v1/bankless/info');
                const data = await response.json();
                console.log("data: ", data);
                // Process the response to extract and format terminal locations
                const terminals = data.map(item => ({
                    lat: item.location[0], // Latitude is the first element
                    lng: item.location[1], // Longitude is the second element
                    name: item.terminalName,
                    totalCash: item.TOTAL_CASH,
                    address: "No address provided", // Since address isn't in the response, using a placeholder
                }));
                console.log("terminals: ", terminals);
                setTerminals(terminals);
            } catch (error) {
                console.error("Error fetching terminals: ", error);
            }
        };

        OnlineTerminals();
    }, []);



    return (
        <View style={styles.container}>
            <MapView style={styles.mapContainer} initialRegion={location}>
                {location && <Marker coordinate={location} title="You are here" description="Your location" />}
                {terminals.map((terminal, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: terminal.lat, longitude: terminal.lng }}
                        title={terminal.name}
                        description={terminal.TOTAL_CASH}>
                        <View>
                            <Image
                                source={require('../../assets/cashlogo.png')}
                                style={{ width: 60, height: 60, borderRadius: 50 }} // Adjust the width and height as needed
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Buy Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sellButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Sell Cash</Text>
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
