import express from 'express';
import {createPost ,getPosts,getPostById} from '../controllers/post.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();
router.post("/post", authMiddleware, createPost);
router.get("/posts", authMiddleware,getPosts);
router.get("/posts/:id", authMiddleware, getPostById);

export default router;
