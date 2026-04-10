const crypto = require('crypto');

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
    this.signature = null;
  }

  /**
   * Calculate hash of the transaction
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.fromAddress +
        this.toAddress +
        this.amount.toString() +
        this.timestamp.toString()
      )
      .digest('hex');
  }
  /**
   * Signs the transaction using the private key
   * @param {string} signingKey - Private key in hex (DER pkcs8 format)
   */
  signTransaction(signingKey) {
    if (this.fromAddress === null) {
      return; // mining reward - no signature needed
    }

    if (!signingKey) {
      throw new Error('Private key is required to sign the transaction');
    }

    const hash = this.calculateHash();

    const sign = crypto.createSign('SHA256');
    sign.update(hash);
    sign.end();

    //Correct signing for hex DER private key
    this.signature = sign.sign({
      key: Buffer.from(signingKey, 'hex'),
      type: 'pkcs8',
      format: 'der'
    }, 'hex');
  }

  /**
   * Verify if the transaction signature is valid
   */
  isValid() {
    if (this.fromAddress === null) return true; // mining reward

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    try {
      const publicKey = crypto.createPublicKey({
        key: Buffer.from(this.fromAddress, 'hex'),
        type: 'spki',
        format: 'der'
      });

      const verify = crypto.createVerify('SHA256');
      verify.update(this.calculateHash());
      verify.end();

      return verify.verify(publicKey, this.signature, 'hex');
    } catch (error) {
      console.error('Signature verification failed:', error.message);
      return false;
    }
  }
}
class Blockchain {
  constructor(difficulty, miningReward) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty || 2;
    this.pendingTransactions = [];
    this.miningReward = miningReward || 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    this.chain.push(block);
    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify signature (this will throw if invalid or missing)
    if (!transaction.isValid()) {
      throw new Error('Invalid transaction signature');
    }

    // Check balance (optional but good)
    if (transaction.fromAddress !== null) {
      const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);
      if (senderBalance < transaction.amount) {
        throw new Error('Not enough balance');
      }
    }

    this.pendingTransactions.push(transaction);
    logger.info('Transaction added to pending', {
      from: transaction.fromAddress.substring(0, 16) + '...',
      amount: transaction.amount
    });
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) balance -= trans.amount;
        if (trans.toAddress === address) balance += trans.amount;
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (!current.hasValidTransactions()) return false;
      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }

    return true;
  }

  getAllTransactions() {
    return this.chain.flatMap((block) => block.transactions);
  }
}

module.exports = { Blockchain, Block, Transaction };
