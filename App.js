import React, { useState, useEffect, createContext, useContext } from 'react';
import { Text, StatusBar, StyleSheet, View, Button, TextInput, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WalletBalance from './src/tabs/WalletBalance';


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

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato', // Customize active tab color
        tabBarInactiveTintColor: 'gray', // Customize inactive tab color
      })}
    >
      <Tab.Screen name="Home" component={MainApp} />
      <Tab.Screen name="Wallet" component={WalletBalance} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <WalletProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </WalletProvider>
  );
}

// Styles remain the same
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
