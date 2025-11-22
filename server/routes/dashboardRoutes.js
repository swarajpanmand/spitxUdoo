import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

// GET /api/dashboard/kpis
router.get("/kpis", authMiddleware, permit("ADMIN", "MANAGER", "WAREHOUSE"), dashboardController.getKpis);

export default router;
