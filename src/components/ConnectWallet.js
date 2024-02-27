

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useWallet } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';

import { ethers, Mnemonic, Wallet } from 'ethers';


const ConnectWallet = () => {
    const { connectWallet, isWalletConnected, address } = useWallet();

    const formatWalletAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
    }

    return (
        <View style={styles.container}>

            <View style={styles.centeredView}>
                <Image source={require('../../assets/DNA.jpg')} style={styles.logo} />
                <Text style={styles.text}>Welcome: {formatWalletAddress(address)}</Text>
                <TouchableOpacity style={styles.button} onPress={connectWallet}>
                    <Text style={styles.buttonText}>Enter App</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={async () => {
                    const keys = await AsyncStorage.getItem('mnemonic');
                    console.log(keys);
                }}>
                    <Text style={styles.buttonText}>Log Keys</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ConnectWallet;
