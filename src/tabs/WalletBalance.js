import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WalletContext } from '../context/WalletContext';

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
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={[styles.button, styles.actionButton]} onPress={() => { /* Implement Buy Logic */ }}>
                        <Text style={styles.buttonText}>Buy {selectedToken.symbol}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.actionButton]} onPress={() => { /* Implement Sell Logic */ }}>
                        <Text style={styles.buttonText}>Sell {selectedToken.symbol}</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                style={[styles.button, styles.disconnectButton]}
                onPress={disconnectWallet}>
                <Text style={styles.buttonText}>Disconnect Wallet</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
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
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'tomato',
        width: '60%',
        alignSelf: 'center',
        marginTop: 10, // Ensure spacing between buttons
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    disconnectButton: {
        marginTop: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: 'limegreen', // Different color for action buttons
        width: '45%', // Adjust width for side-by-side layout
    },
});

export default WalletBalance;
