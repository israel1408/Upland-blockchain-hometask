const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

router.post('/', walletController.createWallet);

module.exports = router;