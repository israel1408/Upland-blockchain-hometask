import React, { useState } from 'react';
import './TransactionForm.css'; // reuse styling

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wallets', {
        method: 'POST',
      });

      const data = await res.json();
      setWallet(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h2 className="panel-title">Wallet</h2>

      <button onClick={generateWallet} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Wallet'}
      </button>

      {wallet && (
        <div style={{ marginTop: '10px' }}>
          <p><strong>Public Key:</strong></p>
          <textarea value={wallet.publicKey} readOnly />

          <p><strong>Private Key:</strong></p>
          <textarea value={wallet.privateKey} readOnly />
        </div>
      )}
    </div>
  );
};

export default Wallet;