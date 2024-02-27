// context/WalletContext.js
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomBytes, Mnemonic, Wallet, JsonRpcProvider, formatUnits, Contract } from 'ethers';

const USDT_CONTRACT_POLYGON = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
const service = "https://polygon.rpc.blxrbdn.com"
const provider = new JsonRpcProvider(service);

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

const WalletContext = createContext({
    isWalletConnected: false,
    connectWallet: () => { },
    disconnectWallet: () => { },
    balance: '',
    setBalance: () => { },
    mnemonic: '',
    address: '',
    fetchAndSetBalanceAsync: () => { },

});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [balance, setBalance] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [address, setAddress] = useState('');



    const connectWallet = useCallback(() => setIsWalletConnected(true), []);
    const disconnectWallet = useCallback(() => setIsWalletConnected(false), []);

    const connectWalletAsync = async () => {
        try {
            let storedMnemonic = await AsyncStorage.getItem('mnemonic');
            if (storedMnemonic) {
                setMnemonic(storedMnemonic);
            } else {
                const randomEntropyBytes = ethers.randomBytes(16); // 128-bit entropy
                let newMnemonic = Mnemonic.fromEntropy(randomEntropyBytes);
                await AsyncStorage.setItem('mnemonic', newMnemonic);
                storedMnemonic = newMnemonic;
                setMnemonic(storedMnemonic);
                console.log("newMnemonic: ", storedMnemonic);
            }

            const walletInstance = Wallet.fromPhrase(storedMnemonic);
            setAddress(walletInstance.address);
            await AsyncStorage.setItem('address', walletInstance.address);
            setIsWalletConnected(true);
        } catch (e) {
            console.error("Error on wallet connection: ", e);
        }
    };

    const fetchAndSetBalanceAsync = async () => {
        try {
            const storedMnemonic = await AsyncStorage.getItem('mnemonic');
            if (!storedMnemonic) {
                console.error("Mnemonic not found");
                return;
            }
            const walletInstance = Wallet.fromPhrase(storedMnemonic);
            const newContract = new ethers.Contract(USDT_CONTRACT_POLYGON, minABI, provider);
            const balanceBN = await newContract.balanceOf(walletInstance);
            const decimals = await newContract.decimals();
            const tokenBalance = formatUnits(balanceBN, decimals);
            setBalance(tokenBalance);
            console.log("balanceFormatted: ", tokenBalance);
        } catch (error) {
            console.error("Error fetching balance: ", error);
        }
    }
    useEffect(() => {

        connectWalletAsync();
        fetchAndSetBalanceAsync();
    }, []);


    return (
        <WalletContext.Provider value={{
            isWalletConnected,
            connectWallet,
            disconnectWallet,
            balance,
            mnemonic,
            address,
            setBalance,
            fetchAndSetBalanceAsync,
        }}>
            {children}
        </WalletContext.Provider>
    );

};
