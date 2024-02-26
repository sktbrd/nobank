import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WalletContext } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';

// Dummy data for cryptocurrencies
const cryptoData = [
    { name: 'Ethereum', symbol: 'ETH', price: '3,100', change: '+2.1%' },
    { name: 'USDC', symbol: 'USDC', price: '1', change: '+0.1%' },
];

const WalletBalance = () => {
    const { disconnectWallet } = useContext(WalletContext);
    const [selectedToken, setSelectedToken] = useState(cryptoData.find(crypto => crypto.symbol === 'ETH'));

    const handleSelectToken = (token) => {
        setSelectedToken(token);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={styles.headerText}>Symbol</Text>
                    <Text style={styles.headerText}>Price</Text>
                    <Text style={styles.headerText}>Change</Text>
                </View>
                {cryptoData.map((crypto, index) => (
                    <TouchableOpacity key={index} style={styles.tableRow} onPress={() => handleSelectToken(crypto)}>
                        <Text style={styles.rowText}>{crypto.name}</Text>
                        <Text style={styles.rowText}>{crypto.symbol}</Text>
                        <Text style={styles.rowText}>{crypto.price}</Text>
                        <Text style={[styles.rowText, { color: crypto.change.includes('-') ? 'red' : 'green' }]}>{crypto.change}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {selectedToken && (
                <View style={styles.centeredView}>
                    <TouchableOpacity style={[styles.button, styles.actionButton]} onPress={() => { /* Implement Buy Logic */ }}>
                        <Text style={styles.buttonText}>Buy {selectedToken.symbol}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.actionButton]} onPress={() => { /* Implement Sell Logic */ }}>
                        <Text style={styles.buttonText}>Sell {selectedToken.symbol}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.disconnectButton}
                        onPress={disconnectWallet}>
                        <Text style={styles.buttonText}>Disconnect Wallet</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
};


export default WalletBalance;
