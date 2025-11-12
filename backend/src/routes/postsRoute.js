import express from "express";
import * as postController from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/posts/ -> ดึงโพสต์ทั้งหมด
router.get("/", postController.getPosts);

// POST /api/posts/ -> สร้างโพสต์ใหม่
router.post("/", authMiddleware, postController.createPost);

// DELETE /api/posts/:id -> ลบโพสต์
router.delete("/:id", authMiddleware, postController.deletePost);

// PUT /api/posts/:id/like -> ไลค์/อัลไลค์ โพสต์
router.put("/:id/like", authMiddleware, postController.toggleLike);

export default router;