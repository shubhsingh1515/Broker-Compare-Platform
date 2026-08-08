const express = require('express');
const router = express.Router();
const {
  getPopularComparisons,
  createPopularComparison,
  updatePopularComparison,
  deletePopularComparison
} = require('../controllers/popularComparisonController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getPopularComparisons);
router.post('/', protectAdmin, createPopularComparison);
router.put('/:id', protectAdmin, updatePopularComparison);
router.delete('/:id', protectAdmin, deletePopularComparison);

module.exports = router;
