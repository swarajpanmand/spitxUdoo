import express from "express";
import * as adjustmentController from "../controllers/adjustmentController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, permit("ADMIN", "MANAGER"), adjustmentController.getAdjustments);
router.post("/", authMiddleware, permit("ADMIN", "MANAGER"), adjustmentController.createAdjustment);

export default router;
