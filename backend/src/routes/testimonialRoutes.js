const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getTestimonials);
router.post('/', protectAdmin, upload.single('avatar'), createTestimonial);
router.put('/:id', protectAdmin, upload.single('avatar'), updateTestimonial);
router.delete('/:id', protectAdmin, deleteTestimonial);

module.exports = router;
