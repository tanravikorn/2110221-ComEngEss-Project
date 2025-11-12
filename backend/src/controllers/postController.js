
import Post from "../models/Post.js";


/** @type {import("express").RequestHandler} */
export const getPosts = async (req, res) => {


  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }


};

/** @type {import("express").RequestHandler} */
export const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};