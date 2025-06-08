const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  editBlog,
  deleteBlog,
} = require("../controllers/blogController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Routes
router.get("/", getAllBlogs);
router.post("/create", upload.single("image"), createBlog);
router.put("/:id", upload.single("image"), editBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
