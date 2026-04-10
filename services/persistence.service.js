const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const STORAGE_PATH = path.join(__dirname, '..', 'blockchain.json');

/**
 * Persisted blockchain file shape.
 * @typedef {Object} PersistedBlockchainState
 * @property {Array<Object>} chain
 * @property {Array<Object>} pendingTransactions
 * @property {number} difficulty
 * @property {number} miningReward
 */

/**
 * Saves blockchain state to disk.
 * @param {Object} blockchain
 * @returns {boolean}
 */
const save = (blockchain) => {
  try {
    const payload = {
      chain: blockchain.chain,
      pendingTransactions: blockchain.pendingTransactions,
      difficulty: blockchain.difficulty,
      miningReward: blockchain.miningReward,
    };

    fs.writeFileSync(STORAGE_PATH, JSON.stringify(payload, null, 2), 'utf8');
    logger.info('Blockchain state saved to disk');
    return true;
  } catch (error) {
    logger.error(`Failed to save blockchain state: ${error.message}`);
    return false;
  }
};

/**
 * Loads blockchain state from disk.
 * @returns {PersistedBlockchainState|null}
 */
const load = () => {
  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      logger.info('No blockchain persistence file found, starting fresh');
      return null;
    }

    const raw = fs.readFileSync(STORAGE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    logger.info('Blockchain state loaded from disk');
    return parsed;
  } catch (error) {
    logger.warn(`Failed to load blockchain state, starting fresh: ${error.message}`);
    return null;
  }
};

/**
 * Deletes persisted blockchain state from disk.
 * @returns {boolean}
 */
const clear = () => {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.unlinkSync(STORAGE_PATH);
      logger.info('Blockchain persistence file cleared');
    }
    return true;
  } catch (error) {
    logger.error(`Failed to clear blockchain persistence file: ${error.message}`);
    return false;
  }
};

module.exports = { save, load, clear };
