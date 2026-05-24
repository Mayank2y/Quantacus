import express from 'express';
import {
  getAllProducts,
  getProductById,
  updateProduct,
  enhanceTitle,
  getDashboardStats
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.post('/:id/enhance-title', enhanceTitle);

export default router;