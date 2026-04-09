const { generateKeyPairSync } = require('crypto');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const createWallet = (req, res) => {
  try {
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    logger.info('New wallet generated successfully');

    return sendSuccess(res, {
      publicKey,
      privateKey
    });

  } catch (error) {
    logger.error('Failed to generate wallet');

    return sendError(res, error);
  }
};

module.exports = { createWallet };