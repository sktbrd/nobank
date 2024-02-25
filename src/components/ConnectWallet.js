import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useWallet } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { Buffer } from 'buffer';
// global.Buffer = Buffer;
// let signer = require("eth_mnemonic_signer")
// import * as signer from 'eth_mnemonic_signer';
// import * as bip39 from 'bip39';
// import { randomBytes } from 'react-native-randombytes'

// Assuming signer and seed are defined and imported correctly in your actual code
// For demonstration, these are placeholder values and will not work without proper implementation

const Bip39Generator = () => {
    const [mnemonic, setMnemonic] = useState('');
    const [address, setAddress] = useState('');

    const onStart = async function(){
        try{
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
            // Create wallet from the mnemonic
            console.log("ethers: ", ethers);
            const wallet = Wallet.fromPhrase(storedMnemonic);
            console.log("Wallet address: ", wallet.address);
            setAddress(wallet.address);
        }catch(e){
            console.error("Error onStart: ", e);
        }
    }

    useEffect(() => {
        onStart();
    }, [])


    // const generateMnemonic = async () => {
    //     try {
    //         // const finalEntropy = randomBytes(16).toString('hex');
    //         // console.log("finalEntropy: ", finalEntropy);
    //         console.log("ethers: ", ethers);
    //
    //         const randomEntropyBytes = ethers.randomBytes(16); // 128-bit entropy
    //         console.log("randomEntropyBytes: ", randomEntropyBytes);
    //         // console.log("newMnemonic: ", Mnemonic.fromEntropy(randomEntropyBytes))
    //         let newMnemonic = Mnemonic.fromEntropy(randomEntropyBytes);
    //         setMnemonic(newMnemonic.phrase)
    //         // Create wallet from the mnemonic
    //         console.log("ethers: ", ethers);
    //         const wallet = Wallet.fromPhrase(newMnemonic.phrase);
    //         console.log("Wallet address: ", wallet.address);
    //         setAddress(wallet.address);
    //
    //     } catch (error) {
    //         console.error("Error generating mnemonic or address:", error);
    //     }
    // };

    return (
        <View style={styles.container}>
            <Button title="Generate BIP39 Mnemonic" />
            {mnemonic ? (
                <Text style={styles.mnemonicText}>Your Mnemonic: {mnemonic}</Text>
            ) : null}
            {address ? (
                <Text style={styles.mnemonicText}>Your address: {address}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mnemonicText: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
});

export default Bip39Generator;
