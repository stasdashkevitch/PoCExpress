import mongoose from "mongoose";
import { Post } from "./post.interface";

const postSchema = new mongoose.Schema({
  title: String,
  author: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  content: String,
});

export const postModel = mongoose.model<Post & mongoose.Document>(
  "Post",
  postSchema,
);
