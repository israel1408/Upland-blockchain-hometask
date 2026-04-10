const crypto = require('crypto');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const createWallet = (req, res) => {
  try {
    console.log('🔨 Starting wallet generation...');

    // Generate key pair
    const keyPair = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' }
    });

    const publicKey = keyPair.publicKey.toString('hex');
    const privateKey = keyPair.privateKey.toString('hex');

    console.log('✅ Keys generated successfully');

    // Simple response without relying on sendSuccess first
    return res.status(201).json({
      success: true,
      data: {
        publicKey,
        privateKey
      },
      message: 'Wallet created successfully'
    });

  } catch (error) {
    console.error('❌ Error in createWallet:', error.message);
    console.error('Stack trace:', error.stack);

    logger.error('Failed to generate wallet', { error: error.message });

    return sendError(res, 500, 'Failed to generate wallet');
  }
};

module.exports = { createWallet };