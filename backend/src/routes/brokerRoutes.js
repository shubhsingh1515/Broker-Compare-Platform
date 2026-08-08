const express = require('express');
const router = express.Router();
const {
  getBrokers,
  searchBrokers,
  getBrokerBySlugOrId,
  createBroker,
  updateBroker,
  deleteBroker
} = require('../controllers/brokerController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getBrokers);
router.get('/search', searchBrokers);
router.get('/:slugOrId', getBrokerBySlugOrId);

router.post('/', protectAdmin, upload.single('logo'), createBroker);
router.put('/:id', protectAdmin, upload.single('logo'), updateBroker);
router.delete('/:id', protectAdmin, deleteBroker);

module.exports = router;
