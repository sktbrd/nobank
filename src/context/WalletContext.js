// context/WalletContext.js
import React, { createContext, useState, useContext } from 'react';

export const WalletContext = createContext({
    isWalletConnected: false, // Default values match the structure
    connectWallet: () => { },
    disconnectWallet: () => { },
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const connectWallet = () => setIsWalletConnected(true);
    const disconnectWallet = () => setIsWalletConnected(false);

    console.log({ isWalletConnected, connectWallet, disconnectWallet }); // Debugging line

    return (
        <WalletContext.Provider value={{ isWalletConnected, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
