import express from 'express';
const router = express.Router();
import { getProducts, seedProducts } from '../controllers/productController.js';

// Route to get all products (with filters)
router.route('/').get(getProducts);

// Route to seed the database with initial data
router.route('/seed').post(seedProducts);

export default router;
