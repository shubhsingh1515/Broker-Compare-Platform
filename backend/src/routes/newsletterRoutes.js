const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  getSubscribers,
  exportSubscribersCSV,
  deleteSubscriber
} = require('../controllers/newsletterController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/subscribe', subscribeNewsletter);
router.get('/', protectAdmin, getSubscribers);
router.get('/export', protectAdmin, exportSubscribersCSV);
router.delete('/:id', protectAdmin, deleteSubscriber);

module.exports = router;
