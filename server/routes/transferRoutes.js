import express from "express";
import * as transferController from "../controllers/transferController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, permit("ADMIN", "MANAGER"), transferController.getTransfers);
router.post("/", authMiddleware, permit("ADMIN", "MANAGER"), transferController.createTransfer);
router.post("/:id/status", authMiddleware, permit("ADMIN", "MANAGER"), transferController.updateTransferStatus);

export default router;
