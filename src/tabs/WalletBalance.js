import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useWallet } from '../context/WalletContext'; // Correctly import useWallet
import { styles } from '../styles/styles';

const WalletBalance = () => {
    const { balance, disconnectWallet, fetchAndSetBalanceAsync } = useWallet(); // Destructure the needed values from the context

    // Assuming cryptoData will be populated or fetched from somewhere
    const cryptoData = [
        { name: 'USDT', symbol: 'USDT', balance: balance, price: 'N/A', change: 'N/A', logo: require('../../assets/crypto/eth.png') },
    ];

    const [selectedToken, setSelectedToken] = React.useState(cryptoData[0]);

    const handleSelectToken = (token) => {
        setSelectedToken(token);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.tableContainer}>
                <Text>Balance: {balance} USDT</Text>

                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={styles.headerText}>Symbol</Text>
                    <Text style={styles.headerText}>Balance</Text>
                    <Text style={styles.headerText}>Change</Text>
                </View>
                {cryptoData.map((crypto, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.tableRow,
                            selectedToken && selectedToken.symbol === crypto.symbol ? styles.selectedRow : null,
                        ]}
                        onPress={() => handleSelectToken(crypto)}
                    >
                        <Text style={styles.rowText}>{crypto.name}</Text>
                        <Text style={styles.rowText}>{crypto.symbol}</Text>
                        <Text style={styles.rowText}>{crypto.balance}</Text>
                        <Text style={[styles.rowText, { color: crypto.change.includes('-') ? 'red' : 'green' }]}>{crypto.change}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default WalletBalance;
