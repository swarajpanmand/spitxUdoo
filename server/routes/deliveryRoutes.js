import express from "express";
import * as deliveryController from "../controllers/deliveryController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, deliveryController.getDeliveries);
router.post("/", authMiddleware, permit("ADMIN", "MANAGER"), deliveryController.createDelivery);
router.post("/:id/status", authMiddleware, permit("ADMIN", "MANAGER"), deliveryController.updateDeliveryStatus);

export default router;
