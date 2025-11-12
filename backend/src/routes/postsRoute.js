import express from "express";

import * as postController from "../controllers/postController.js"

const router = express.Router();

router.post("/", postController.createPost);
router.get("/", postController.getPosts);
// TODO3: add a router for the filter function

export default router;