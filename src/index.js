import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Map from './tabs/Map';
import WalletBalance from './tabs/WalletBalance';
import { useWallet } from './context/WalletContext';
import ConnectWallet from './components/ConnectWallet';

const Tab = createBottomTabNavigator();

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
                    return <Ionicons name={iconName} size={size} color={"white"} />;
                },
                tabBarActiveTintColor: 'limegreen',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: [{ display: 'flex', backgroundColor: 'black' }], // Added backgroundColor: 'black'
                headerStyle: { backgroundColor: 'black' }, // Added headerStyle
                headerTintColor: 'white', // Added headerTintColor
            })}
        >
            <Tab.Screen name="Map" component={Map} />
            <Tab.Screen name="Wallet" component={WalletBalance} />
        </Tab.Navigator>
    );
};


const AppContent = () => {
    const { isWalletConnected } = useWallet();

    return isWalletConnected ? (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    ) : (
        <ConnectWallet />
    );
};

export default AppContent;
