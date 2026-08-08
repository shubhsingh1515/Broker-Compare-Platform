const express = require('express');
const router = express.Router();
const { compareBrokers } = require('../controllers/compareController');

router.post('/', compareBrokers);

module.exports = router;
