const express = require('express');
const router = express.Router();
const {
  getFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getBrokerFeatureValues,
  saveBrokerFeatureValues
} = require('../controllers/featureController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getFeatures);
router.get('/:id', getFeatureById);
router.post('/', protectAdmin, createFeature);
router.put('/:id', protectAdmin, updateFeature);
router.delete('/:id', protectAdmin, deleteFeature);

router.get('/values/:brokerId', getBrokerFeatureValues);
router.post('/values', protectAdmin, saveBrokerFeatureValues);

module.exports = router;
