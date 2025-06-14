const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  timeToRead: String,
  author: String,
  category: String,
  tags: [String],
  image: String,
  imagePublicId: String, // Add this field
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
