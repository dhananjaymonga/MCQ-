const Blog = require("../model/blog");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Blog
const createBlog = async (req, res) => {
  try {
    const { title, description, date, timeToRead, author, category, tags } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const blog = new Blog({
      title,
      description,
      date,
      timeToRead,
      author,
      category,
      tags: tags.split(",").map(tag => tag.trim()),
      image: result.secure_url,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Blog by ID
const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description, date, timeToRead, author, category, tags } = req.body;

    const updateData = {
      title,
      description,
      date,
      timeToRead,
      author,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    };

    if (req.file) {
      // Upload new image to Cloudinary and delete local file
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      updateData.image = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Blog by ID
const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createBlog, getAllBlogs, editBlog, deleteBlog };
