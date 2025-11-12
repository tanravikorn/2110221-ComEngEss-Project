import mongoose from "mongoose";
import Post from "../models/Post.js";


/** @type {import("express").RequestHandler} */
export const getPosts = async (req, res) => {

  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }


};

/** @type {import("express").RequestHandler} */
export const createPost = async (req, res) => {
  try {
    // const newPost = new Post(req.body);
    // await newPost.save();
    // res.status(200).json({ message: "OK" });
    
    const { content } = req.body;
    
    const authorId = req.user; 

    if (!content) {
      return res.status(400).json({ error: "กรุณากรอกเนื้อหาโพสต์" });
    }

    const newPost = new Post({
      content: content,
      author: authorId
    });
    
    await newPost.save();    

    res.status(201).json(newPost);
    
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Can not Post"});
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};


/** @type {import("express").RequestHandler} */
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const requesterId = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "ไม่พบโพสต์นี้" }); // 404 Not Found
    }

    if (post.author.toString() !== requesterId) {
      return res.status(403).json({ error: "คุณไม่มีสิทธิ์ลบโพสต์นี้" }); // 403 Forbidden
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "ลบโพสต์สำเร็จ" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
};


/** @type {import("express").RequestHandler} */
export const toggleLike = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user;

    const post = await Post.findById(postId).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ error: "ไม่พบโพสต์นี้" });
    }

    if (!post.likes) {
      post.likes = [];
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json(post); 

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
};