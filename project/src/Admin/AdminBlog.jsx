import React, { useState, useEffect } from "react";
import axios from "axios";
// import BlogPage from "./BlogPage";

const categoryOptions = [
  "Biology",
  "Physics",
  "Chemistry",
  "Study Plan",
  "Exam Preparation",
];

const tagsByCategory = {
  Biology: ["Cells", "Genetics", "Evolution"],
  Physics: ["Mechanics", "Optics", "Thermodynamics"],
  Chemistry: ["Organic", "Inorganic", "Reactions"],
  "Study Plan": ["Time Table", "Weekly Goals", "Revision"],
  "Exam Preparation": ["Mock Tests", "Strategies", "Tips"],
};

const BlogForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    timeToRead: "",
    author: "",
    category: "",
    tags: "",
    image: null,
  });

  const [createdBlog, setCreatedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null); // to track which blog we are editing

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get("https://blogmanagment.onrender.com/api/blogs");
      setAllBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      timeToRead: "",
      author: "",
      category: "",
      tags: "",
      image: null,
    });
    setEditingBlogId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // Append form data; if editing, append only changed image or keep old image URL
    for (const [key, value] of Object.entries(form)) {
      if (key === "image" && value && typeof value !== "string") {
        data.append(key, value); // file object
      } else if (key !== "image") {
        data.append(key, value);
      }
    }

    try {
      let response;
      if (editingBlogId) {
        // Edit existing blog
        response = await axios.put(
          `http://localhost:5000/api/blogs/${editingBlogId}`,
          data
        );
        alert("✅ Blog Updated Successfully!");
      } else {
        // Create new blog
        response = await axios.post("https://blogmanagment.onrender.com/api/blogs/create", data);
        alert("✅ Blog Created Successfully!");
      }

      setCreatedBlog(response.data);
      resetForm();
      fetchAllBlogs();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Edit: populate form with blog data and set editing ID
  const handleEdit = (blog) => {
    setEditingBlogId(blog._id);
    setForm({
      title: blog.title || "",
      description: blog.description || "",
      date: blog.date ? blog.date.split("T")[0] : new Date().toISOString().split("T")[0],
      timeToRead: blog.timeToRead || "",
      author: blog.author || "",
      category: blog.category || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      image: blog.image || null, // If it's a URL, keep it as string to avoid overwriting file input
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top for form visibility
  };

  const handleDelete = async (blog) => {
    if (
      window.confirm(
        `Are you sure you want to delete the blog titled "${blog.title}"?`
      )
    ) {
      try {
        await axios.delete(`https://blogmanagment.onrender.com/api/blogs/${blog._id}`);
        alert("Blog deleted successfully");
        fetchAllBlogs();
      } catch (err) {
        alert("Failed to delete blog: " + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 m-12">
      {/* <BlogPage /> */}

      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        📝 {editingBlogId ? "Edit Blog" : "Create New Blog"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white shadow-lg p-8 rounded-lg border border-gray-300"
      >
        {["title", "description", "date", "timeToRead", "author"].map((field) => (
          <input
            key={field}
            type={field === "date" ? "date" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field === "date" ? "" : field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
            required={field !== "timeToRead"} // optional timeToRead
          />
        ))}

        {/* Category Select */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
          required
        >
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Tags Input */}
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        />

        {/* Suggested Tags */}
        {form.category && tagsByCategory[form.category] && (
          <div className="text-sm text-gray-500 italic mt-1">
            Suggested Tags: {tagsByCategory[form.category].join(", ")}
          </div>
        )}

        {/* File upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={loading}
        />

        {/* Show current image preview if editing and image is a URL */}
        {form.image && typeof form.image === "string" && (
          <img
            src={form.image}
            alt="Current"
            className="mt-2 max-h-48 rounded-lg border border-gray-300"
          />
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className={`py-3 px-5 flex-1 rounded-lg text-lg transition text-white ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : editingBlogId ? "Update Blog" : "Submit Blog"}
          </button>

          {editingBlogId && (
            <button
              type="button"
              onClick={resetForm}
              className="py-3 px-5 flex-1 rounded-lg text-lg bg-gray-500 hover:bg-gray-600 text-white transition"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {createdBlog && (
        <div className="mt-8 p-6 border border-green-400 bg-green-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-700 mb-4">✅ Blog {editingBlogId ? "Updated" : "Created"}</h3>
          <p>
            <strong>Title:</strong> {createdBlog.title}
          </p>
          <p>
            <strong>Description:</strong> {createdBlog.description}
          </p>
          <p>
            <strong>Date:</strong> {new Date(createdBlog.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Author:</strong> {createdBlog.author}
          </p>
          <p>
            <strong>Category:</strong> {createdBlog.category}
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {Array.isArray(createdBlog.tags) ? createdBlog.tags.join(", ") : createdBlog.tags}
          </p>
          <p>
            <strong>Time to Read:</strong> {createdBlog.timeToRead} mins
          </p>
          <p>
            <strong>Created At:</strong> {new Date(createdBlog.createdAt).toLocaleString()}
          </p>
          {createdBlog.image && (
            <img
              src={createdBlog.image}
              alt="Blog"
              className="mt-4 max-h-60 rounded-lg shadow-lg border"
            />
          )}
        </div>
      )}

      {/* All Blogs - Admin Panel Style */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-gray-800">
          All Blogs <span className="text-gray-500 text-lg">({allBlogs.length})</span>
        </h2>

        {allBlogs.length === 0 ? (
          <p className="text-gray-600 italic">No blogs found.</p>
        ) : (
          <div className="space-y-6">
            {allBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:shadow-lg transition-shadow duration-300"
              >
                {/* Left: Info */}
                <div className="md:flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{blog.title}</h3>
                  <p className="text-gray-700 mt-1 line-clamp-3">{blog.description}</p>

                  <div className="mt-3 text-sm text-gray-500 space-x-4">
                    <span>
                      <strong>Date:</strong>{" "}
                      {new Date(blog.date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>Author:</strong> {blog.author}
                    </span>
                    <span>
                      <strong>Category:</strong> {blog.category}
                    </span>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-2 text-sm text-blue-600">
                      <strong>Tags:</strong>{" "}
                      {blog.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-0.5 mr-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Image + Actions */}
                <div className="mt-4 md:mt-0 md:ml-6 flex items-center space-x-4">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                  )}

                  <div className="flex flex-col space-y-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(blog)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogForm;
