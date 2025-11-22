import express from "express";
import * as moveHistoryController from "../controllers/moveHistoryController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, permit("ADMIN", "MANAGER"), moveHistoryController.getMoveHistory);

export default router;
