// src/routes/productRoutes.js
import express from "express";
import * as productController from "../controllers/productController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

// Public product listing can be protected in your app; here default requires auth
router.get("/", authMiddleware, productController.getProducts);
router.post("/", authMiddleware, permit("ADMIN", "MANAGER"), productController.createProduct);
router.get("/low-stock", authMiddleware, permit("ADMIN","MANAGER"), productController.getLowStock);
router.get("/:id", authMiddleware, productController.getProduct);
router.patch("/:id", authMiddleware, permit("ADMIN","MANAGER"), productController.updateProduct);
router.delete("/:id", authMiddleware, permit("ADMIN"), productController.deleteProduct);

// Stock operations
router.post("/stock/add", authMiddleware, permit("ADMIN","MANAGER","WAREHOUSE_STAFF"), productController.addStock);
router.post("/stock/remove", authMiddleware, permit("ADMIN","MANAGER"), productController.removeStock);
router.post("/stock/transfer", authMiddleware, permit("ADMIN","MANAGER"), productController.transferStock);

// Batch operations
router.post("/batches", authMiddleware, permit("ADMIN","MANAGER"), productController.upsertBatch);

export default router;
