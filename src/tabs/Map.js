// src/components/MainApp.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from '../styles/styles';


const Map = () => {
    const [location, setLocation] = useState(null);

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

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={location}
            >
                {location && <Marker
                    coordinate={location}
                    title="You are here"
                    description="Your location"
                />}
            </MapView>
        </View>
    );
}

export default Map;