import React, { useState } from 'react';
import './TransactionForm.css';
import { addTransaction } from '../api/blockchain.api';
import { useWallet } from '../context/walletContext';

const TransactionForm = ({ onTransactionAdded }) => {
  const { privateKey, wallet } = useWallet();
  const [formData, setFormData] = useState({ toAddress: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wallet || !privateKey) {
      setMessage('Please generate a wallet first!');
      return;
    }

    if (!formData.toAddress || !formData.amount) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addTransaction(
        wallet.publicKey,           // fromAddress
        formData.toAddress,         // toAddress
        parseFloat(formData.amount), // amount
        privateKey                  // privateKey for signing on backend
      );

      setMessage('✅ Transaction added successfully to pending transactions!');
      setFormData({ toAddress: '', amount: '' });
      onTransactionAdded && onTransactionAdded();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add transaction';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h3>Create Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From (Your Wallet)</label>
          <input 
            type="text" 
            value={wallet ? wallet.publicKey.substring(0, 40) + '...' : ''} 
            readOnly 
          />
        </div>

        <div className="form-group">
          <label htmlFor="toAddress">To Address</label>
          <input
            type="text"
            id="toAddress"
            name="toAddress"
            value={formData.toAddress}
            onChange={handleChange}
            required
            placeholder="Paste recipient public key"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>

        {message && (
          <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading || !wallet}>
          {loading ? 'Sending Transaction...' : 'Send Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;