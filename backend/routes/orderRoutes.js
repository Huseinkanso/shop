import express from 'express';
const router = express.Router();
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered, payWithStripe } from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)

router.route('/myOrders').get(protect, getMyOrders)

router.route('/:id').get(protect, getOrderById)

router.route('/pay').post(updateOrderToPaid)

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/create-checkout-session').post(protect, payWithStripe)
export default router;

