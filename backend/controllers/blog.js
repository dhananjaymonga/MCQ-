const Blog = require("../model/blog");
const ImageKit = require("imagekit");
const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
console.log(process.env.IMAGEKIT_PRIVATE_KEY)
// Utility functions
const validateEnvironmentVariables = () => {
  const requiredEnvVars = [
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

const validateFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const cleanupLocalFile = async (filePath) => {
  try {
    if (filePath && await validateFileExists(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error(`Error cleaning up local file ${filePath}:`, error.message);
  }
};

const uploadToImageKit = async (filePath, fileName, folder = "blog-images") => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      transformation: {
        pre: "l-text,i-Blog,fs-50,l-end", // Optional watermark
        post: [
          {
            type: "transformation",
            value: "w-800,h-600,c-at_max,q-auto,f-webp"
          }
        ]
      },
      tags: ["blog", "production"]
    });

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name
    };
  } catch (error) {
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

const deleteFromImageKit = async (fileId) => {
  try {
    if (fileId) {
      await imagekit.deleteFile(fileId);
    }
  } catch (error) {
    console.error(`Error deleting image from ImageKit:`, error.message);
    // Don't throw error for deletion failures in production
  }
};

const validateBlogData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }
  
  if (!data.author || data.author.trim().length < 2) {
    errors.push("Author name must be at least 2 characters long");
  }
  
  if (!data.category || data.category.trim().length < 2) {
    errors.push("Category must be specified");
  }
  
  if (data.timeToRead && (isNaN(data.timeToRead) || data.timeToRead < 1)) {
    errors.push("Time to read must be a positive number");
  }
  
  return errors;
};

const formatTags = (tags) => {
  if (!tags) return [];
  
  return tags
    .split(",")
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Limit to 10 tags
};

// Initialize environment check
try {
  validateEnvironmentVariables();
} catch (error) {
  console.error("Environment configuration error:", error.message);
  process.exit(1);
}

// Create Blog
const createBlog = async (req, res) => {
  let uploadedFile = null;
  
  try {
    const { title, description, date, timeToRead, author, category, tags } = req.body;

    // Validate input data
    const validationErrors = validateBlogData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed", 
        details: validationErrors 
      });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "Image file is required" 
      });
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      await cleanupLocalFile(req.file.path);
      return res.status(400).json({ 
        success: false,
        error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" 
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      await cleanupLocalFile(req.file.path);
      return res.status(400).json({ 
        success: false,
        error: "File size too large. Maximum size is 5MB" 
      });
    }

    // Upload to ImageKit
    const fileName = `blog_${Date.now()}_${path.basename(req.file.originalname)}`;
    uploadedFile = await uploadToImageKit(req.file.path, fileName);

    // Clean up local file
    await cleanupLocalFile(req.file.path);

    // Create blog document
    const blog = new Blog({
      title: title.trim(),
      description: description.trim(),
      date: date || new Date(),
      timeToRead: parseInt(timeToRead) || 5,
      author: author.trim(),
      category: category.trim().toLowerCase(),
      tags: formatTags(tags),
      image: uploadedFile.url,
      imageFileId: uploadedFile.fileId,
      imageName: uploadedFile.name,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });

  } catch (error) {
    // Clean up local file if it exists
    if (req.file) {
      await cleanupLocalFile(req.file.path);
    }

    // Clean up uploaded image if upload succeeded but blog creation failed
    if (uploadedFile && uploadedFile.fileId) {
      await deleteFromImageKit(uploadedFile.fileId);
    }

    console.error("Create blog error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error", 
      message: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
    });
  }
};

// Get All Blogs with pagination and filtering
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, 'i');
    }
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',').map(tag => tag.trim().toLowerCase()) };
    }

    // Execute query with pagination
    const [blogs, totalCount] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Failed to fetch blogs"
    });
  }
};

// Get Single Blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid blog ID format" 
      });
    }

    const blog = await Blog.findById(id).lean();
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        error: "Blog not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error("Get blog by ID error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Failed to fetch blog"
    });
  }
};

// Edit Blog by ID
const editBlog = async (req, res) => {
  let uploadedFile = null;
  
  try {
    const { id } = req.params;
    const { title, description, date, timeToRead, author, category, tags } = req.body;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid blog ID format" 
      });
    }

    // Validate input data
    const validationErrors = validateBlogData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed", 
        details: validationErrors 
      });
    }

    // Find existing blog
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ 
        success: false,
        error: "Blog not found" 
      });
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      date: date || existingBlog.date,
      timeToRead: parseInt(timeToRead) || existingBlog.timeToRead,
      author: author.trim(),
      category: category.trim().toLowerCase(),
      tags: formatTags(tags),
      updatedAt: new Date()
    };

    // Handle new image upload
    if (req.file) {
      // Validate file type and size
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        await cleanupLocalFile(req.file.path);
        return res.status(400).json({ 
          success: false,
          error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" 
        });
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        await cleanupLocalFile(req.file.path);
        return res.status(400).json({ 
          success: false,
          error: "File size too large. Maximum size is 5MB" 
        });
      }

      // Upload new image to ImageKit
      const fileName = `blog_${Date.now()}_${path.basename(req.file.originalname)}`;
      uploadedFile = await uploadToImageKit(req.file.path, fileName);

      // Clean up local file
      await cleanupLocalFile(req.file.path);

      // Delete old image from ImageKit
      if (existingBlog.imageFileId) {
        await deleteFromImageKit(existingBlog.imageFileId);
      }

      // Update image data
      updateData.image = uploadedFile.url;
      updateData.imageFileId = uploadedFile.fileId;
      updateData.imageName = uploadedFile.name;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    }).lean();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });

  } catch (error) {
    // Clean up local file if it exists
    if (req.file) {
      await cleanupLocalFile(req.file.path);
    }

    // Clean up uploaded image if upload succeeded but blog update failed
    if (uploadedFile && uploadedFile.fileId) {
      await deleteFromImageKit(uploadedFile.fileId);
    }

    console.error("Edit blog error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Failed to update blog"
    });
  }
};

// Delete Blog by ID
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid blog ID format" 
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ 
        success: false,
        error: "Blog not found" 
      });
    }

    // Delete image from ImageKit
    if (deletedBlog.imageFileId) {
      await deleteFromImageKit(deletedBlog.imageFileId);
    }

    res.status(200).json({ 
      success: true,
      message: "Blog deleted successfully" 
    });

  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Failed to delete blog"
    });
  }
};

// Get blogs by category
const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [blogs, totalCount] = await Promise.all([
      Blog.find({ category: category.toLowerCase() })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments({ category: category.toLowerCase() })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Get blogs by category error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Failed to fetch blogs"
    });
  }
};

// Search blogs
const searchBlogs = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        error: "Search query must be at least 2 characters long" 
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const searchFilter = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { author: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    };

    const [blogs, totalCount] = await Promise.all([
      Blog.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(searchFilter)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Search blogs error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Search failed"
    });
  }
};

module.exports = { 
  createBlog, 
  getAllBlogs, 
  getBlogById,
  editBlog, 
  deleteBlog,
  getBlogsByCategory,
  searchBlogs
};