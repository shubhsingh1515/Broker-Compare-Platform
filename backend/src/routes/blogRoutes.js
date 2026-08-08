const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protectAdmin, upload.single('image'), createBlog);
router.put('/:id', protectAdmin, upload.single('image'), updateBlog);
router.delete('/:id', protectAdmin, deleteBlog);

module.exports = router;
