const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

// POST /api/wallets - Generate new wallet
router.post('/', walletController.createWallet);

module.exports = router;