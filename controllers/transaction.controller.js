const crypto = require('crypto');
const { blockchain, Transaction } = require('../models');
const { sendSuccess, sendCreated, sendError } = require('../utils/response');
const { isValidAddress, isValidAmount, sanitizeAddress, sanitizeAmount } = require('../utils/validator');

const addTransaction = (req, res) => {
  try {
    const { fromAddress, toAddress, amount, privateKey } = req.body;

    if (!fromAddress || !toAddress || !amount || !privateKey) {
      return sendError(res, 400, 'Missing required fields: fromAddress, toAddress, amount, privateKey');
    }

    const transaction = new Transaction(fromAddress, toAddress, amount);
    transaction.signTransaction(privateKey); // SPENT A TON OF TIME JUST BECAUSE OF THIS LINE LOL!

    blockchain.addTransaction(transaction);

    logger.info('Transaction added', { from: fromAddress.substring(0, 16) + '...', amount });

    return sendSuccess(res, 201, { transaction }, 'Transaction added to pending transactions');
  } catch (error) {
    logger.error('Add transaction failed', error);
    return sendError(res, 400, error.message);
  }
};

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
