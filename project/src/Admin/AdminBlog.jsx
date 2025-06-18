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
      const response = await axios.get("http://localhost:5000/api/blogs");
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
        response = await axios.post("http://localhost:5000/api/blogs/create", data);
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
        await axios.delete(`http://localhost:5000/api/blogs/${blog._id}`);
        alert("Blog deleted successfully");
        fetchAllBlogs();
      } catch (err) {
        alert("Failed to delete blog: " + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
// import React, { useState, useEffect } from 'react';
// import { Upload, Search, Filter, Eye, Download, Edit3, Trash2, Pin, X, Save, Plus, FileText, BookOpen, GraduationCap, Calendar } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:5000/api';

// const AdminPanel = () => {
//   const [pdfs, setPdfs] = useState([]);
//   const [filteredPdfs, setFilteredPdfs] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
  
//   // Filter states
//   const [selectedSubject, setSelectedSubject] = useState('all');
//   const [selectedClass, setSelectedClass] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Modal states
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedPdf, setSelectedPdf] = useState(null);
  
//   // Form states
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     subject: '',
//     classNumber: '',
//     pinned: false,
//     file: null
//   });

//   // Fetch data functions
//   const fetchPdfs = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/pdfs`);
//       const data = await response.json();
//       setPdfs(data);
//       setFilteredPdfs(data);
//     } catch (error) {
//       console.error('Error fetching PDFs:', error);
//       alert('Error fetching PDFs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/subjects`);
//       const data = await response.json();
//       setSubjects(data);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/classes`);
//       const data = await response.json();
//       setClasses(data);
//     } catch (error) {
//       console.error('Error fetching classes:', error);
//     }
//   };

//   // Filter PDFs
//   const filterPdfs = () => {
//     let filtered = pdfs;

//     if (selectedSubject !== 'all') {
//       filtered = filtered.filter(pdf => pdf.subject === selectedSubject);
//     }

//     if (selectedClass !== 'all') {
//       filtered = filtered.filter(pdf => pdf.class === selectedClass);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(pdf => 
//         pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pdf.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredPdfs(filtered);
//   };

//   // Upload PDF
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!formData.file || !formData.title || !formData.subject || !formData.classNumber) {
//       alert('Please fill all required fields');
//       return;
//     }

//     setUploadLoading(true);
//     const uploadFormData = new FormData();
//     uploadFormData.append('pdf', formData.file);
//     uploadFormData.append('title', formData.title);
//     uploadFormData.append('description', formData.description);
//     uploadFormData.append('subject', formData.subject);
//     uploadFormData.append('classNumber', formData.classNumber);
//     uploadFormData.append('pinned', formData.pinned);

//     try {
//       const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
//         method: 'POST',
//         body: uploadFormData
//       });

//       if (response.ok) {
//         alert('PDF uploaded successfully!');
//         setShowUploadModal(false);
//         resetForm();
//         fetchPdfs();
//         fetchSubjects();
//         fetchClasses();
//       } else {
//         const errorData = await response.json();
//         alert(`Upload failed: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Upload failed. Please try again.');
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   // Delete PDF
//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this PDF?')) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/pdf/${id}`, {
//         method: 'DELETE'
//       });

//       if (response.ok) {
//         alert('PDF deleted successfully!');
//         fetchPdfs();
//       } else {
//         alert('Failed to delete PDF');
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       alert('Delete failed. Please try again.');
//     }
//   };

//   // Update PDF
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE_URL}/pdf/${selectedPdf._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           title: formData.title,
//           description: formData.description,
//           subject: formData.subject,
//           classNumber: formData.classNumber,
//           pinned: formData.pinned
//         })
//       });

//       if (response.ok) {
//         alert('PDF updated successfully!');
//         setShowEditModal(false);
//         fetchPdfs();
//       } else {
//         alert('Failed to update PDF');
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       alert('Update failed. Please try again.');
//     }
//   };

//   // Utility functions
//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       subject: '',
//       classNumber: '',
//       pinned: false,
//       file: null
//     });
//   };

//   const openEditModal = (pdf) => {
//     setSelectedPdf(pdf);
//     setFormData({
//       title: pdf.title,
//       description: pdf.description,
//       subject: pdf.subject,
//       classNumber: pdf.class,
//       pinned: pdf.pinned,
//       file: null
//     });
//     setShowEditModal(true);
//   };

//   const openViewModal = (pdf) => {
//     setSelectedPdf(pdf);
//     setShowViewModal(true);
//   };

//   // Effects
//   useEffect(() => {
//     fetchPdfs();
//     fetchSubjects();
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     filterPdfs();
//   }, [selectedSubject, selectedClass, searchTerm, pdfs]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Notes Admin Panel</h1>
//               <p className="text-gray-600">Manage your educational PDFs and notes</p>
//             </div>
//             <button
//               onClick={() => setShowUploadModal(true)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <Plus size={20} />
//               Upload PDF
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search PDFs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Subjects</option>
//               {subjects.map(subject => (
//                 <option key={subject} value={subject}>{subject}</option>
//               ))}
//             </select>

//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Classes</option>
//               {classes.map(cls => (
//                 <option key={cls} value={cls}>{cls}</option>
//               ))}
//             </select>

//             <div className="text-sm text-gray-600 flex items-center gap-2">
//               <FileText size={16} />
//               Total: {filteredPdfs.length} PDFs
//             </div>
//           </div>
//         </div>

//         {/* PDF Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {loading ? (
//             <div className="col-span-full text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading PDFs...</p>
//             </div>
//           ) : filteredPdfs.length === 0 ? (
//             <div className="col-span-full text-center py-12">
//               <FileText size={48} className="mx-auto text-gray-400 mb-4" />
//               <p className="text-gray-600">No PDFs found</p>
//             </div>
//           ) : (
//             filteredPdfs.map(pdf => (
//               <div key={pdf._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
//                 {/* Thumbnail */}
//                 <div className="h-48 bg-gray-100 flex items-center justify-center relative">
//                   {pdf.thumbnailUrl ? (
//                     <img 
//                       src={pdf.thumbnailUrl} 
//                       alt={pdf.title}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <FileText size={48} className="text-gray-400" />
//                   )}
//                   {pdf.pinned && (
//                     <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
//                       <Pin size={16} />
//                     </div>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-4">
//                   <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{pdf.title}</h3>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                     <BookOpen size={14} />
//                     <span>{pdf.subject}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                     <GraduationCap size={14} />
//                     <span>Class {pdf.class}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
//                     <Calendar size={14} />
//                     <span>{new Date(pdf.uploadDate).toLocaleDateString()}</span>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => openViewModal(pdf)}
//                       className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors"
//                     >
//                       <Eye size={16} />
//                       View
//                     </button>
//                     <button
//                       onClick={() => window.open(pdf.pdfUrl, '_blank')}
//                       className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors"
//                     >
//                       <Download size={16} />
//                       Download
//                     </button>
//                     <button
//                       onClick={() => openEditModal(pdf)}
//                       className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 px-3 rounded-md transition-colors"
//                     >
//                       <Edit3 size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(pdf._id)}
//                       className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-md transition-colors"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Upload Modal */}
//         {showUploadModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Upload New PDF</h2>
//                 <button onClick={() => setShowUploadModal(false)}>
//                   <X size={24} />
//                 </button>
//               </div>
              
//               <form onSubmit={handleUpload} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">PDF File *</label>
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Title *</label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Subject *</label>
//                   <input
//                     type="text"
//                     value={formData.subject}
//                     onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Class *</label>
//                   <input
//                     type="text"
//                     value={formData.classNumber}
//                     onChange={(e) => setFormData({...formData, classNumber: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none"
//                   />
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="pinned"
//                     checked={formData.pinned}
//                     onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
//                     className="rounded"
//                   />
//                   <label htmlFor="pinned" className="text-sm">Pin this PDF</label>
//                 </div>
                
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowUploadModal(false)}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={uploadLoading}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
//                   >
//                     {uploadLoading ? 'Uploading...' : 'Upload'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {showEditModal && selectedPdf && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit PDF</h2>
//                 <button onClick={() => setShowEditModal(false)}>
//                   <X size={24} />
//                 </button>
//               </div>
              
//               <form onSubmit={handleUpdate} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Title *</label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Subject *</label>
//                   <input
//                     type="text"
//                     value={formData.subject}
//                     onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Class *</label>
//                   <input
//                     type="text"
//                     value={formData.classNumber}
//                     onChange={(e) => setFormData({...formData, classNumber: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none"
//                   />
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="editPinned"
//                     checked={formData.pinned}
//                     onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
//                     className="rounded"
//                   />
//                   <label htmlFor="editPinned" className="text-sm">Pin this PDF</label>
//                 </div>
                
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
//                   >
//                     Update
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* View Modal */}
//         {showViewModal && selectedPdf && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">{selectedPdf.title}</h2>
//                 <button onClick={() => setShowViewModal(false)}>
//                   <X size={24} />
//                 </button>
//               </div>
              
//               <div className="mb-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><strong>Subject:</strong> {selectedPdf.subject}</div>
//                   <div><strong>Class:</strong> {selectedPdf.class}</div>
//                   <div><strong>Upload Date:</strong> {new Date(selectedPdf.uploadDate).toLocaleDateString()}</div>
//                   <div><strong>Pinned:</strong> {selectedPdf.pinned ? 'Yes' : 'No'}</div>
//                 </div>
//                 {selectedPdf.description && (
//                   <div className="mt-4">
//                     <strong>Description:</strong>
//                     <p className="mt-1 text-gray-600">{selectedPdf.description}</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="bg-gray-100 rounded-lg p-4 h-96">
//                 <iframe
//                   src={selectedPdf.pdfUrl}
//                   className="w-full h-full rounded"
//                   title={selectedPdf.title}
//                 />
//               </div>
              
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={() => window.open(selectedPdf.pdfUrl, '_blank')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
//                 >
//                   <Eye size={16} />
//                   Open in New Tab
//                 </button>
//                 <button
//                   onClick={() => {
//                     const link = document.createElement('a');
//                     link.href = selectedPdf.pdfUrl;
//                     link.download = selectedPdf.filename;
//                     link.click();
//                   }}
//                   className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
//                 >
//                   <Download size={16} />
//                   Download
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;