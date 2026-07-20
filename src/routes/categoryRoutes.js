const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin protected routes
router.post('/', protectAdmin, upload.single('image'), createCategory);
router.put('/:id', protectAdmin, upload.single('image'), updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;
