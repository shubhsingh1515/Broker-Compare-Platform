const express = require('express');
const router = express.Router();
const { getFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getFAQs);
router.post('/', protectAdmin, createFAQ);
router.put('/:id', protectAdmin, updateFAQ);
router.delete('/:id', protectAdmin, deleteFAQ);

module.exports = router;
