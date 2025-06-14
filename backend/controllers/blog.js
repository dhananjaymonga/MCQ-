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

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload to Cloudinary with specific folder and options
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog-images", // Yeh folder banayega ya use karega
      resource_type: "image",
      // Optional transformations (comment out if not needed)
      // transformation: [
      //   { width: 800, height: 600, crop: "limit" },
      //   { quality: "auto" },
      //   { format: "webp" }
      // ]
    });

    // Delete local file after successful upload
    fs.unlinkSync(req.file.path);

    const blog = new Blog({
      title,
      description,
      date,
      timeToRead,
      author,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      image: result.secure_url,
      imagePublicId: result.public_id, // Store public_id for future deletion
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    // Clean up local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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

// Get Single Blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Blog by ID
const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description, date, timeToRead, author, category, tags } = req.body;

    // Find existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const updateData = {
      title,
      description,
      date,
      timeToRead,
      author,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    };

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingBlog.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingBlog.imagePublicId);
        } catch (deleteError) {
          console.log("Error deleting old image:", deleteError);
        }
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog-images",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { format: "webp" }
        ]
      });

      // Delete local file
      fs.unlinkSync(req.file.path);

      updateData.image = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, { 
      new: true,
      runValidators: true 
    });

    res.status(200).json(updatedBlog);
  } catch (err) {
    // Clean up local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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

    // Delete image from Cloudinary if it exists
    if (deletedBlog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(deletedBlog.imagePublicId);
      } catch (deleteError) {
        console.log("Error deleting image from Cloudinary:", deleteError);
      }
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  createBlog, 
  getAllBlogs, 
  getBlogById,
  editBlog, 
  deleteBlog 
};