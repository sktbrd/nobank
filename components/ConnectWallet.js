// components/ConnectWallet.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';

const ConnectWallet = () => {
    const { connectWallet } = useWallet();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Wallet is Disconnected</Text>
            <Button backgroundColor="blue" borderRadius="10px" title="Connect Wallet" onPress={connectWallet} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default ConnectWallet;
