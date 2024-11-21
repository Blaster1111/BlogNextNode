import Post from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create post
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const post = new Post({ title, content, authorId: req.user.id });
  await post.save();

  res.status(201).json(new apiResponse(201, post, "Post created successfully"));
});

// Get posts (filtered by author if provided)
const getPosts = asyncHandler(async (req, res) => {
  const { author } = req.query;  // Get 'author' from query params

  let posts;
  if (author === "me") {
    posts = await Post.find({ authorId: req.user.id }).populate("authorId", "email");
  } else {
    posts = await Post.find().populate("authorId", "email");
  }

  res.status(200).json(new apiResponse(200, posts, "Posts retrieved successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("authorId", "email");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json(new apiResponse(200, post, "Post retrieved successfully"));
});

export { createPost, getPosts, getPostById };
