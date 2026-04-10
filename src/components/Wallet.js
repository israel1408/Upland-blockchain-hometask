import React, { useState } from 'react';
import { createWallet } from '../api/blockchain.api';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [privateKey, setPrivateKey] = useState(null); // kept only in memory

  const handleGenerateWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await createWallet();

      const { publicKey, privateKey: privKey } = response.data.data || response.data;

      setWallet({ publicKey });
      setPrivateKey(privKey);

      alert(`✅ Wallet generated successfully!\n\nPublic Key (Address):\n${publicKey.substring(0, 50)}...`);

      console.log('Private key stored locally only');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', margin: '20px 0', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>🔑 Cryptographic Wallet</h2>

      {!wallet ? (
        <button 
          onClick={handleGenerateWallet} 
          disabled={loading}
          style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Generating...' : 'Generate New Wallet'}
        </button>
      ) : (
        <div>
          <strong>Public Key (Wallet Address):</strong>
          <p style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: '#f5f5f5', padding: '10px' }}>
            {wallet.publicKey}
          </p>

          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '15px' }}
          >
            Generate Another Wallet
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Wallet;