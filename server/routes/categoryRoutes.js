import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, permit("ADMIN", "MANAGER"), categoryController.getCategories);
router.post("/", authMiddleware, permit("ADMIN"), categoryController.createCategory);
router.patch("/:id", authMiddleware, permit("ADMIN", "MANAGER"), categoryController.updateCategory);
router.delete("/:id", authMiddleware, permit("ADMIN"), categoryController.deleteCategory);

export default router;
