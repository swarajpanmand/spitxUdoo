import express from 'express';
const router = express.Router();
import * as receiptController from "../controllers/receiptController.js";
import { authMiddleware, permit } from '../middleware/auth.js';

router.get('/', authMiddleware, receiptController.getAllReceipts);
router.post('/', authMiddleware, permit('ADMIN','MANAGER','WAREHOUSE_STAFF'), receiptController.createReceipt);
router.post('/:id/validate', authMiddleware, permit('ADMIN','MANAGER'), receiptController.validateReceipt);

export default router;
