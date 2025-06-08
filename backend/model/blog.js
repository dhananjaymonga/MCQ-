const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  date: Date,
  timeToRead: String,
  author: String,
  category: String,
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
