const { Blockchain, Block, Transaction } = require('./blockchain');
const config = require('../config');
const logger = require('../utils/logger');
const persistenceService = require('../services/persistence.service');

const { difficulty, miningReward, initialMinerAddress } = config.blockchain;

const hydrateTransaction = (tx) => {
  const transaction = new Transaction(tx.fromAddress, tx.toAddress, tx.amount);
  transaction.timestamp = tx.timestamp;
  transaction.signature = tx.signature || null;
  return transaction;
};

const hydrateBlock = (block) => {
  const hydratedTransactions = (block.transactions || []).map(hydrateTransaction);
  const hydratedBlock = new Block(block.timestamp, hydratedTransactions, block.previousHash);
  hydratedBlock.nonce = block.nonce;
  hydratedBlock.hash = block.hash;
  return hydratedBlock;
};

const createFreshBlockchain = () => {
  const freshBlockchain = new Blockchain(difficulty, miningReward);
  freshBlockchain.minePendingTransactions(initialMinerAddress);
  return freshBlockchain;
};

const loadBlockchain = () => {
  const persisted = persistenceService.load();
  if (!persisted) {
    return createFreshBlockchain();
  }

  try {
    const loadedBlockchain = new Blockchain(persisted.difficulty, persisted.miningReward);
    loadedBlockchain.chain = (persisted.chain || []).map(hydrateBlock);
    loadedBlockchain.pendingTransactions = (persisted.pendingTransactions || []).map(hydrateTransaction);

    if (!loadedBlockchain.chain.length || !loadedBlockchain.isChainValid()) {
      logger.warn('Persisted blockchain is invalid, starting fresh');
      return createFreshBlockchain();
    }

    return loadedBlockchain;
  } catch (error) {
    logger.warn(`Failed to restore blockchain from persistence, starting fresh: ${error.message}`);
    return createFreshBlockchain();
  }
};

const blockchain = loadBlockchain();
blockchain.setStateChangedHandler((currentBlockchain) => {
  persistenceService.save(currentBlockchain);
});

module.exports = { blockchain, Transaction };
