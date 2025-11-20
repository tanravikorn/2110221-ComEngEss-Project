import express from "express";
import * as postController from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", postController.getPosts);


router.post("/", authMiddleware, postController.createPost);


router.delete("/:id", authMiddleware, postController.deletePost);


router.put("/:id/like", authMiddleware, postController.toggleLike);

export default router;