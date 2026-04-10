const logger = require('../utils/logger');
const { blockchain, Transaction } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const addTransaction = (req, res) => {
  try {
    const { fromAddress, toAddress, amount, privateKey } = req.body;

    if (!fromAddress || !toAddress || !amount || !privateKey) {
      return sendError(res, 'Missing required fields: fromAddress, toAddress, amount, privateKey', 400);
    }

    const transaction = new Transaction(fromAddress, toAddress, amount);

    // Sign the transaction
    transaction.signTransaction(privateKey);

    // Add to blockchain (it will validate signature)
    blockchain.addTransaction(transaction);

    logger.info('Transaction added successfully');

    return sendSuccess(res, { transaction, message: 'Transaction added to pending transactions successfully' }, 201);
  } catch (error) {
    logger.error(`Add transaction failed: ${error.message}`);
    return sendError(res, error.message || 'Failed to add transaction', 400);
  }
};

module.exports = { addTransaction };

const getPendingTransactions = (req, res) => {
  sendSuccess(res, {
    pendingTransactions: blockchain.pendingTransactions,
    count: blockchain.pendingTransactions.length,
  });
};

const getAllTransactions = (req, res) => {
  const transactions = blockchain.getAllTransactions();
  sendSuccess(res, { transactions, count: transactions.length });
};

module.exports = { addTransaction, getPendingTransactions, getAllTransactions };
