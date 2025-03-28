const mongoose = require("mongoose");

const articlesSchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
  category: String,
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date,
    },
  ],
  deletedBy: {
    account_id: String,
    deletedAt: Date,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Articles = mongoose.model("Articles", articlesSchema, "articles");

module.exports = Articles;