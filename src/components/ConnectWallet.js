

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useWallet } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';

import { ethers, Mnemonic, Wallet } from 'ethers';


const ConnectWallet = () => {
    const { connectWallet } = useWallet();
    const [mnemonic, setMnemonic] = useState('');
    const [address, setAddress] = useState('');

    const onStart = async function () {
        try {
            let storedMnemonic = await AsyncStorage.getItem('mnemonic');
            if (storedMnemonic) {
                setMnemonic(storedMnemonic);
            } else {
                const randomEntropyBytes = ethers.randomBytes(16); // 128-bit entropy
                console.log("randomEntropyBytes: ", randomEntropyBytes);
                // console.log("newMnemonic: ", Mnemonic.fromEntropy(randomEntropyBytes))
                let newMnemonic = Mnemonic.fromEntropy(randomEntropyBytes);
                AsyncStorage.setItem('mnemonic', newMnemonic.phrase);
                storedMnemonic = newMnemonic.phrase
                setMnemonic(storedMnemonic)
            }
            // Create wallet from the mnexmonic
            const wallet = Wallet.fromPhrase(storedMnemonic);
            console.log("Wallet address: ", wallet.address);
            console.log("Wallet private key: ", wallet.privateKey);
            setAddress(wallet.address);
            AsyncStorage.setItem('address', wallet.address);
        } catch (e) {
            console.error("Error onStart: ", e);
        }
    }

    useEffect(() => {
        onStart();
    }, [])

    const formatWalletAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`
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
