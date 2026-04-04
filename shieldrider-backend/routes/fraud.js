const express = require('express');
const router = express.Router();

const fraudController = require('../controllers/fraudController');

// POST /api/check-fraud
router.post('/check-fraud', fraudController.checkFraud);

module.exports = router;