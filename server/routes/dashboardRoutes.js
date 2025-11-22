import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

// GET /api/dashboard/kpis
router.get("/kpis", authMiddleware, permit("ADMIN", "MANAGER", "WAREHOUSE"), dashboardController.getKpis);
router.get("/recent-activity",authMiddleware,permit("ADMIN", "MANAGER", "WAREHOUSE"),dashboardController.getRecentActivity);

export default router;