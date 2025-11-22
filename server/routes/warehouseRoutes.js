import express from "express";
import * as warehouseController from "../controllers/warehouseController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, permit("ADMIN", "MANAGER"), warehouseController.getWarehouses);
router.post("/", authMiddleware, permit("ADMIN"), warehouseController.createWarehouse);
router.patch("/:id", authMiddleware, permit("ADMIN", "MANAGER"), warehouseController.updateWarehouse);
router.post("/:id/locations", authMiddleware, permit("ADMIN", "MANAGER"), warehouseController.addLocation);

export default router;
