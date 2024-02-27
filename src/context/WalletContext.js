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
    fetchAndSetBalance: async () => { },
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [balance, setBalance] = useState('');

    const connectWallet = useCallback(() => setIsWalletConnected(true), []);
    const disconnectWallet = useCallback(() => setIsWalletConnected(false), []);

    const fetchAndSetBalance = async () => {
        try {
            const storedMnemonic = await AsyncStorage.getItem('mnemonic');
            if (!storedMnemonic) {
                console.error("Mnemonic not found");
                return;
            }
            const wallet = Wallet.fromPhrase(storedMnemonic);
            const newContract = new ethers.Contract(USDT_CONTRACT_POLYGON, minABI, provider);
            const balanceBN = await newContract.balanceOf(wallet);
            const decimals = await newContract.decimals();
            const tokenBalance = formatUnits(balanceBN, decimals);
            setBalance(tokenBalance);
            console.log("balanceFormatted: ", tokenBalance);
        } catch (error) {
            console.error("Error fetching balance: ", error);
        }
    }

    useEffect(() => {
        fetchAndSetBalance();
    }
        , []);

    return (
        <WalletContext.Provider value={{
            isWalletConnected,
            connectWallet,
            disconnectWallet,
            balance,
            setBalance,
            fetchAndSetBalance
        }}>
            {children}
        </WalletContext.Provider>
    );
};
