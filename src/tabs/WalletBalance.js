import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WalletContext } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';
import * as Events from "@pioneer-platform/pioneer-events";
import axios from "axios";
import { useEffect } from 'react';
import { ethers } from 'ethers';

import { randomBytes, Mnemonic, Wallet, JsonRpcProvider, formatUnits, Contract } from 'ethers';

let QUERY_KEY = 'tester-mm-mobile2'

const apiClient = axios.create({
    baseURL: spec, // Your base URL
    headers: {
        'Authorization': QUERY_KEY// Replace 'YOUR_AUTH_TOKEN' with your actual token
    }
});

// let spec = "https://cash2btc.com/spec/swagger.json"
let spec = "https://cash2btc.com/api/v1"
let PIONEER_WS = 'wss://cash2btc.com'
let USDT_CONTRACT_POLYGON = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
const service = "https://polygon.rpc.blxrbdn.com"




const WalletBalance = () => {
    const { disconnectWallet } = useContext(WalletContext);
    const [cryptoData, setCryptoData] = useState([]);
    const [selectedToken, setSelectedToken] = useState(null);
    const [usdtbalance, setUsdtbalance] = useState(0)
    let onStart = async function () {
        try {
            let storedMnemonic = await AsyncStorage.getItem('mnemonic');
            // The ABI for the methods we want to interact with
            const minABI = [
                // balanceOf
                {
                    "constant": true,
                    "inputs": [{ "name": "_owner", "type": "address" }],
                    "name": "balanceOf",
                    "outputs": [{ "name": "balance", "type": "uint256" }],
                    "type": "function"
                },
                // decimals
                {
                    "constant": true,
                    "inputs": [],
                    "name": "decimals",
                    "outputs": [{ "name": "", "type": "uint8" }],
                    "type": "function"
                }
            ];
            // Assuming a provider is set up (e.g., ethers.getDefaultProvider or other)
            const provider = new JsonRpcProvider(service);
            const newContract = new ethers.Contract(USDT_CONTRACT_POLYGON, minABI, provider);

            const decimals = await newContract.decimals();
            const wallet = Wallet.fromPhrase(storedMnemonic);
            const balanceBN = await newContract.balanceOf(wallet);

            console.log("wallet: ", wallet);

            const tokenBalance = formatUnits(balanceBN, decimals);

            console.log("tokenBalance: ", tokenBalance);
            setUsdtbalance(tokenBalance);


        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        onStart()
        setCryptoData([
            { name: 'USDT', symbol: 'USDT', balance: usdtbalance, price: 'N/A', change: 'N/A', logo: require('../../assets/crypto/eth.png') },
        ]);
        setSelectedToken(cryptoData[0])
    }, []);
    const handleSelectToken = (token) => {
        setSelectedToken(token);
    };
    return (
        <View style={styles.container}>
            <ScrollView style={styles.tableContainer}>
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
                            selectedToken && selectedToken.symbol === crypto.symbol ? styles.selectedRow : null
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



styles.selectedRow = {
    backgroundColor: '#d3d3d3', // Change this to your preferred color
};

export default WalletBalance;
