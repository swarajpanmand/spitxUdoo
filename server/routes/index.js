import express from 'express';
const router = express.Router();

import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import receiptRoutes from './receiptRoutes.js';
import deliveryRoutes from './deliveryRoutes.js';
import adjustmentRoutes from './adjustmentRoutes.js';
import transferRoutes from './transferRoutes.js';
import warehouseRoutes from './warehouseRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import moveHistoryRoutes from './moveHistoryRoutes.js';
import userRoutes from './users.js';

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/receipts', receiptRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/adjustments', adjustmentRoutes);
router.use('/transfers', transferRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/categories', categoryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/moves', moveHistoryRoutes);
router.use('/users', userRoutes);

export default router;
