const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  replies: [{
    username: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String
  }],
  thumbsUp: [String],
  thumbsDown: [String]
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);