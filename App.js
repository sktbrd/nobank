import React, { useState, useEffect, createContext, useContext } from 'react';
import { StatusBar, StyleSheet, View, Button, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Context for Wallet Connection
const WalletContext = createContext();

const useWallet = () => useContext(WalletContext);

const WalletProvider = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Default to disconnected for demonstration

  const connectWallet = () => setIsWalletConnected(true);

  return (
    <WalletContext.Provider value={{ isWalletConnected, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// Dummy ConnectWallet Component
const ConnectWallet = () => {
  const { connectWallet } = useWallet();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wallet is Disconnected</Text>
      <Button title="Connect Wallet" onPress={connectWallet} color="limegreen" />
    </View>
  );
};

// Main App Component
const MainApp = () => {
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
        showsUserLocation={true}
        followsUserLocation={true}>
        {location && (
          <Marker
            coordinate={location}
            title="Your Location" />
        )}
      </MapView>
      <View style={styles.pickupButton}>
        <Button title="Request Cash" color="white" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <WalletConsumer />
    </WalletProvider>
  );
}

// Component to determine which view to show based on wallet connection
const WalletConsumer = () => {
  const { isWalletConnected } = useWallet();

  return isWalletConnected ? <MainApp /> : <ConnectWallet />;
};

const styles = StyleSheet.create({
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
  }
});
