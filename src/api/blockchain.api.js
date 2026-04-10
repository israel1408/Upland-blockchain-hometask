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


export const addTransaction = (from, to, amount, privateKey) => {
  return client.post('/api/transactions', {
    fromAddress: from,
    toAddress: to,
    amount,
    privateKey, // send to backend
  });
};

export const mineBlock = (miningRewardAddress = 'miner1') =>
  client.post(ENDPOINTS.MINE, { miningRewardAddress });

export const fetchBalance = (address) =>
  client.get(ENDPOINTS.balance(address));


/**
 * Create a new cryptographic wallet (POST /api/wallets)
 */
export const createWallet = async () => {
  const response = await client.post(ENDPOINTS.wallets);
  return response;
};

export const fetchDashboard = () =>
  Promise.all([fetchChain(), fetchStats()]).then(([chainData, statsData]) => ({
    chainData,
    statsData,
  }));
