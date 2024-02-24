// App.js
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Text, StatusBar, StyleSheet, View, Button, TextInput, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WalletBalance from './src/tabs/WalletBalance';
import ConnectWallet from './src/components/ConnectWallet';
import { WalletProvider, useWallet } from './src/context/WalletContext';

const MyTabs = () => {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'limegreen',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Wallet" component={WalletBalance} />
      <Tab.Screen name="Map" component={MainApp} />
    </Tab.Navigator>
  );
};

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
      <TextInput
        style={styles.textInput}
        placeholder="Enter Location"
        placeholderTextColor="#666"
      />
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        followsUserLocation={true}>
        {location && (
          <Marker
            coordinate={location}
            title="Your Location"
          />
        )}
      </MapView>
      <View style={styles.pickupButton}>
        <Button title="Request Cash" color="white" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const Tab = createBottomTabNavigator();

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

function AppContent() {
  const { isWalletConnected } = useWallet();

  return isWalletConnected ? (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  ) : (
    <ConnectWallet />
  );
}


// Styles
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
  },
  textInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 80,
    fontSize: 16,
  },
});

export default App;
