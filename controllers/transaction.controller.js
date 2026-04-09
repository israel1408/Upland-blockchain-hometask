const crypto = require('crypto');
const { blockchain, Transaction } = require('../models');
const { sendSuccess, sendCreated, sendError } = require('../utils/response');
const { isValidAddress, isValidAmount, sanitizeAddress, sanitizeAmount } = require('../utils/validator');

const addTransaction = (req, res) => {
  try {
    const { fromAddress, toAddress, amount, privateKey } = req.body;

    const transaction = new Transaction(fromAddress, toAddress, amount);

    //sign transaction using private key
    if (privateKey) {
      const sign = crypto.createSign('SHA256');
      sign.update(transaction.calculateHash());
      sign.end();

      transaction.signature = sign.sign(privateKey, 'hex');
    }

    blockchain.addTransaction(transaction);

    return sendSuccess(res, transaction);
  } catch (err) {
    console.log(err.response?.data);

    return(
      JSON.stringify(err.response?.data, null, 2)
    );
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
