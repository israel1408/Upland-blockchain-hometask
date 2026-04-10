const crypto = require('crypto');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const createWallet = (req, res) => {
  try {
    const keyPair = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' }
    });

    const publicKey = keyPair.publicKey.toString('hex');
    const privateKey = keyPair.privateKey.toString('hex');

    return sendSuccess(res, {
      data: {
        publicKey,
        privateKey
      },
      message: 'Wallet created successfully'
    }, 201);

  } catch (error) {
    logger.error(`Failed to generate wallet: ${error.message}`);
    return sendError(res, 'Failed to generate wallet', 500);
  }
};

module.exports = { createWallet };