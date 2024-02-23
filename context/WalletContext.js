// context/WalletContext.js
import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [isWalletConnected, setIsWalletConnected] = useState(false); // Default to disconnected

    const connectWallet = () => setIsWalletConnected(true);
    const disconnectWallet = () => setIsWalletConnected(false);

    return (
        <WalletContext.Provider value={{ isWalletConnected, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
