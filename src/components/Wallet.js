import React, { useEffect, useState } from 'react';
import { createWallet, fetchBalance } from '../api/blockchain.api';
import { useWallet } from '../context/walletContext';

const Wallet = () => {
  const { wallet, generateWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBalance = async () => {
      if (!wallet?.publicKey) return;
      setBalanceLoading(true);
      try {
        const response = await fetchBalance(wallet.publicKey);
        setBalance(response.data?.balance ?? response.data?.data?.balance ?? 0);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch wallet balance');
      } finally {
        setBalanceLoading(false);
      }
    };

    loadBalance();
  }, [wallet]);

  const handleGenerateWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await createWallet();
      const { publicKey, privateKey: privKey } = response.data.data || response.data;

      generateWallet(publicKey, privKey);
      alert(` Wallet generated!\n\nPublic Key:\n${publicKey.substring(0, 50)}...`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', margin: '20px 0', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h2>🔑 Cryptographic Wallet</h2>

      {!wallet ? (
        <button onClick={handleGenerateWallet} disabled={loading}>
          {loading ? 'Generating...' : 'Generate New Wallet'}
        </button>
      ) : (
        <div>
          <strong>Public Key (Wallet Address):</strong>
          <p style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: '#eef', padding: '10px' }}>
            {wallet.publicKey}
          </p>
          <strong>Balance:</strong>
          <p>{balanceLoading ? 'Loading balance...' : balance}</p>
          <button onClick={() => window.location.reload()}>Generate Another Wallet</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Wallet;