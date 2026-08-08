const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getBanners);
router.post('/', protectAdmin, upload.single('image'), createBanner);
router.put('/:id', protectAdmin, upload.single('image'), updateBanner);
router.delete('/:id', protectAdmin, deleteBanner);

module.exports = router;
