const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: String,
  likes: { type: Number, default: 0 },
  comments: [
    {
      id: String,
      content: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);