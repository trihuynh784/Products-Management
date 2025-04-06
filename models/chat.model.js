const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user_id: String,
  room_chat_id: String,
  content: String,
  images: Array,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
});

const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;
