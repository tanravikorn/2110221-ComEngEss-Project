import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true
  // },
  likes: {
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', postSchema);
export default Post;