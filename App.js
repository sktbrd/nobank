// App.js
import React from 'react';
import { WalletProvider } from './src/context/WalletContext';
import AppContent from './src';

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
