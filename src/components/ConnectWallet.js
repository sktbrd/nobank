import React, { useState } from 'react'; // Fixed: Added useState import
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'; // Added TouchableOpacity for custom button styles
import { useWallet } from '../context/WalletContext';
import { styles } from '../styles/styles';

const ConnectWallet = () => {
    const { connectWallet } = useWallet();
    const dummy12words = "abandon, ability, able, about, above, absent, absorb, abstract, absurd, abuse, access, accident";
    const [modalVisible, setModalVisible] = useState(false);

    // Fixed: Correctly defined as a React component
    const CreateWalletModal = () => (
        <View>
            <Text>Modal</Text>
            <Text>{dummy12words}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
    );

    const handleCreateWallet = () => {
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {modalVisible && <CreateWalletModal />}
            <Text style={styles.text}>Wallet is Disconnected</Text>
            <TouchableOpacity style={styles.button} onPress={connectWallet}>
                <Text style={styles.buttonText}>Connect Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
                <Text style={styles.buttonText}>Create Wallet</Text>
            </TouchableOpacity>
        </View>
    );
};



export default ConnectWallet;
