const crypto = require('crypto');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * POST /api/wallets
 * Generate a new EC key pair on secp256k1 curve for wallet
 */
const createWallet = (req, res, next) => {
  try {
    const keyPair = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'der'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der'
      }
    });

    const publicKey = keyPair.publicKey.toString('hex');
    const privateKey = keyPair.privateKey.toString('hex');

    logger.info(`New wallet generated - PublicKey: ${publicKey.substring(0, 20)}...`);

    return sendSuccess(res, 201, {
      publicKey,
      privateKey
    }, 'Wallet created successfully');
  } catch (error) {
    logger.error('Wallet generation failed', { error: error.message });
    console.error('Wallet error details:', error);   // ← This will show in terminal
    return sendError(res, 500, 'Failed to generate wallet');
  }
};

module.exports = {
  createWallet
};