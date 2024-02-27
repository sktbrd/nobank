// App.js
import 'react-native-get-random-values';
import React from 'react';
import { WalletProvider } from './src/context/WalletContext';
import AppContent from './src';
import { UserLocationProvider } from './src/context/UserLocationContext';
export default function App() {
  return (
    <UserLocationProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </UserLocationProvider>
  );
}
