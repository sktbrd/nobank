import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useWallet } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';

const ConnectWallet = () => {
    const { connectWallet } = useWallet();
    const dummy12words = "abandon, ability, able, about, above, absent, absorb, abstract, absurd, abuse, access, accident";
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const checkPrivateKey = async () => {
            const privateKey = await AsyncStorage.getItem('privatekey');
            if (privateKey) {
                console.log('Private key exists:', privateKey);
                // Optionally, perform an action if the private key exists
                // For example, auto-connect the wallet
                // connectWallet();
            }
        };

        checkPrivateKey();
    }, []);

    const savePrivateKey = async () => {
        await AsyncStorage.setItem('privatekey', dummy12words);
        console.log('Private key saved:', dummy12words);
        // Optionally, connect the wallet after saving
        connectWallet();
    };

    const handleCreateWallet = () => {
        setModalVisible(true);
        savePrivateKey();
    };

    return (
        <View style={styles.container}>
            {modalVisible && (
                <View style={styles.container}>
                    <Text style={styles.text}>Modal</Text>
                    <Text style={styles.text}>{dummy12words}</Text>
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            )}
            <Text style={styles.text}>Wallet is Disconnected</Text>
            <TouchableOpacity style={styles.button} onPress={connectWallet}>
                <Text style={styles.buttonText}>Connect Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
                <Text style={styles.buttonText}>Create Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={async () => {
                const keys = await AsyncStorage.getItem('privatekey');
                console.log(keys);
            }}>
                <Text style={styles.buttonText}>Log Keys</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ConnectWallet;
