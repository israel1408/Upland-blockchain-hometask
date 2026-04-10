import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);           // { publicKey }
  const [privateKey, setPrivateKey] = useState(null);   // only in memory

  const generateWallet = (publicKey, privKey) => {
    setWallet({ publicKey });
    setPrivateKey(privKey);
  };

  const clearWallet = () => {
    setWallet(null);
    setPrivateKey(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, privateKey, generateWallet, clearWallet }}>
      {children}
    </WalletContext.Provider>
  );
};