// src/tabs/WalletBalance.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { WalletContext } from '../context/WalletContext';
const WalletBalance = () => {
    const walletContext = useContext(WalletContext);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Wallet Balance: 100 Coins</Text>
            <Button title="Disconnect Wallet" onPress={walletContext.disconnectWallet} color="tomato" />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default WalletBalance;