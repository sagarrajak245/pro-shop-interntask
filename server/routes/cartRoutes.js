import express from 'express';
import { addToCart, getCart, removeFromCart, updateQuantity } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// All routes here are protected
router.use(protect);

router.route('/').get(getCart);
router.route('/add').post(addToCart);
router.route('/remove').post(removeFromCart);
router.route('/update').post(updateQuantity);

export default router;
