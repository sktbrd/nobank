import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ethers, randomBytes, Mnemonic } from 'ethers';

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

    const generateMnemonic = async () => {
        try {
            // const finalEntropy = randomBytes(16).toString('hex');
            // console.log("finalEntropy: ", finalEntropy);
            console.log("ethers: ", ethers);

            const randomEntropyBytes = randomBytes(16); // 128-bit entropy
            console.log("randomEntropyBytes: ", randomEntropyBytes);
            console.log("newMnemonic: ", Mnemonic.fromEntropy(randomEntropyBytes))

            // const newMnemonic = ethers.utils.entropyToMnemonic(randomEntropyBytes);
            // console.log("newMnemonic: ", newMnemonic);

            // const newMnemonic = await bip39.entropyToMnemonic(finalEntropy);
            // console.log("newMnemonic: ", newMnemonic);

            // let newMnemonic = 'all all all all all all all all all all all all'; // Placeholder mnemonic
            // let newMnemonic = bip39.generateMnemonic(256)
            // let index = 1
            // let path = "m/44'/60'/"+index+"'/0/0"
            // let address = await signer.getAddress(seed,path)
            // address = address.toLowerCase()
            // This is where you'd use 'signer.getAddress(seed, path)' in your actual code
            // console.log("address: ", address);
            // setMnemonic(newMnemonic);
        } catch (error) {
            console.error("Error generating mnemonic or address:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Generate BIP39 Mnemonic" onPress={generateMnemonic} />
            {mnemonic ? (
                <Text style={styles.mnemonicText}>Your Mnemonic: {mnemonic}</Text>
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
