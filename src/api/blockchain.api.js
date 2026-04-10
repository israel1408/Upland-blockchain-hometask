import client from './client';
import ENDPOINTS from './endpoints';

export const fetchChain = () => client.get(ENDPOINTS.CHAIN);

export const fetchChainValidity = () => client.get(ENDPOINTS.CHAIN_VALID);

export const fetchStats = () => client.get(ENDPOINTS.STATS);

export const fetchPendingTransactions = () =>
  client.get(ENDPOINTS.TRANSACTIONS_PENDING);

export const fetchAllTransactions = () =>
  client.get(ENDPOINTS.TRANSACTIONS_ALL);

// src/api/blockchain.api.js


/**
 * Add a new transaction (signs it on the backend using the provided private key)
 */
export const addTransaction = async (fromAddress, toAddress, amount, privateKey) => {
  const response = await client.post(ENDPOINTS.TRANSACTIONS, {
    fromAddress,
    toAddress,
    amount,
    privateKey   // ← We send private key so backend can call signTransaction
  });
  return response;
};

export const mineBlock = (miningRewardAddress = 'miner1') =>
  client.post(ENDPOINTS.MINE, { miningRewardAddress });

export const fetchBalance = (address) =>
  client.get(ENDPOINTS.balance(address));


/**
 * Create a new cryptographic wallet (POST /api/wallets)
 */
export const createWallet = async () => {
  // NEW (correct)
  const response = await client.post(ENDPOINTS.WALLETS);
  return response;
};

export const fetchDashboard = () =>
  Promise.all([fetchChain(), fetchStats()]).then(([chainData, statsData]) => ({
    chainData,
    statsData,
  }));
