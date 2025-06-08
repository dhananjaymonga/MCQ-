// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// // const UploadedData = require('./models/users'); // Import the model
// require('dotenv').config();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// // const Admin = require('./models/Admin');
// const mongoose = require('mongoose');
// const cookieParser = require("cookie-parser"); // <== add this

// // const adminRoutes = require('./routes/admin');
// // const authRoutes = require('./routes/auth');

// const Blog = require("./model/blog"); // ✅ Use consistent naming

// // const bcrypt = require('bcryptjs');

// const mongoURI = "mongodb+srv://sarikamonga2306:aCNZgUAZibU6x0au@cluster0.xjq9zqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
// const JWT_SECRET = 'dhananjay'; // Replace with .env in production

// // Connect to MongoDB
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB connected successfully');
// }).catch(err => {
//   console.log('MongoDB connection error:', err);
// });

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173', // ✅ Remove the trailing slash
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());  // Only express.json() is required for JSON requests
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const pdfStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'pdfs',
//     resource_type: 'auto',
//     format: async () => 'pdf',
//     public_id: (req, file) => `${Date.now()}_${file.originalname}`,
//   },
// });
// const imageStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'blogs',
//     resource_type: 'image',
//     public_id: (req, file) => `${Date.now()}_${file.originalname}`,
//   },
// });
// const uploadPdf = multer({ storage: pdfStorage });
// const uploadImage = multer({ storage: imageStorage });

// app.get('/test', (req, res) => {
//   console.log("hii");
//   res.send('Admin route is working!');
// });
// // app.use('/admin', adminRoutes);
// // Admin Login Route
// // app.use('/auth', authRoutes);

// app.post('/admin/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log('Login request:', req.body);

//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       console.log('Admin not found for email:', email);
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       console.log('Password mismatch for email:', email);
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });

//     res.json({ success: true, token });// BACKEND - Fixed PDF URL generation and access with EDIT and DELETE routes

// const express = require('express');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: 'dvn9wwxhl',
//     api_key: '496822881153243',
//     api_secret: 'yHK8hESIHgkrJMjhD5K5sPLRzDs'
// });

// // IMPORTANT: Use local storage first, then we'll upload to Cloudinary
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');  // Make sure this directory exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Serve the uploads directory statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB schema for PDF documents - UPDATED WITH NEW FIELDS
// const pdfSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: false
//   },
//   subject: {
//     type: String,
//     required: true
//   },
//   class: {
//     type: String,
//     required: true
//   },
//   filename: String,
//   filepath: String,
//   pdfUrl: {
//     type: String,
//     default: "#"
//   },
//   thumbnailUrl: String,
//   pageCount: {
//     type: Number,
//     default: 0
//   },
//   pinned: {
//     type: Boolean,
//     default: false
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const PDF = mongoose.model('PDF', pdfSchema);

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/pdf-database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// // Upload PDF endpoint - UPDATED TO HANDLE NEW FIELDS
// app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
//     try {
//       console.log(req.body);
//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }
  
//       const { title, subject, classNumber, description, pinned } = req.body;
  
//       if (!title || !subject || !classNumber) {
//         return res.status(400).json({ error: 'Title, subject, and class are required' });
//       }
  
//       const localFilePath = req.file.path;
  
//       // 1. Upload as raw (for full PDF view)
//       const rawUpload = await cloudinary.uploader.upload(localFilePath, {
//         resource_type: 'raw',
//         folder: 'pdfs',
//       });
  
//       // 2. Upload as auto (for thumbnail)
//       const autoUpload = await cloudinary.uploader.upload(localFilePath, {
//         resource_type: 'auto',
//         folder: 'pdfs',
//       });
  
//       // Generate thumbnail URL from the auto upload
//       const thumbnailUrl = cloudinary.url(autoUpload.public_id, {
//         format: 'jpg',
//         page: 1,
//         secure: true,
//       });
  
//       const localPdfUrl = `${req.protocol}://${req.get('host')}/${localFilePath}`;
  
//       // Save to MongoDB with new fields
//       const newPdf = new PDF({
//         title: title,
//         description: description || '',           // Optional description field
//         subject: subject,
//         class: classNumber,
//         filename: req.file.filename,
//         filepath: localPdfUrl,
//         pdfUrl: rawUpload.secure_url,            // Cloudinary PDF URL
//         thumbnailUrl: thumbnailUrl,              // Cloudinary thumbnail URL
//         pageCount: 5,                            // Optional static count
//         pinned: pinned === 'true' || pinned === true,  // Handle boolean conversion
//         uploadDate: new Date(),                  // Current upload time
//         createdAt: new Date()                    // Current creation time
//       });
  
//       await newPdf.save();
  
//       res.status(201).json({
//         message: 'PDF uploaded successfully',
//         pdf: newPdf
//       });
  
//     } catch (error) {
//       console.error('Error uploading PDF:', error);
//       res.status(500).json({ error: 'Error uploading PDF: ' + error.message });
//     }
//   });

// // Get all PDFs endpoint
// app.get('/api/pdfs', async (req, res) => {
//   try {
//     const pdfs = await PDF.find().sort({ uploadDate: -1 });
//     res.status(200).json(pdfs);
//   } catch (error) {
//     console.error('Error fetching PDFs:', error);
//     res.status(500).json({ error: 'Error fetching PDFs' });
//   }
// });

// // Get single PDF by ID
// app.get('/api/pdfs/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pdf = await PDF.findById(id);

//     if (!pdf || !pdf.fileUrl) {
//       return res.status(404).json({ error: 'PDF not found' });
//     }

//     const fileResponse = await fetch(pdf.fileUrl);
//     if (!fileResponse.ok) throw new Error('Cloud file fetch failed');

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${pdf.title || 'study-note'}.pdf"`);

//     fileResponse.body.pipe(res);
//   } catch (error) {
//     console.error('Error fetching PDF:', error);
//     res.status(500).json({ error: 'Error fetching PDF' });
//   }
// });


// // Get PDFs by class and subject
// app.get('/api/pdfs/filter', async (req, res) => {
//   try {
//     const { class: classNumber, subject } = req.query;
//     const query = {};
    
//     if (classNumber) query.class = classNumber;
//     if (subject) query.subject = subject;
    
//     const pdfs = await PDF.find(query).sort({ uploadDate: -1 });
//     res.status(200).json(pdfs);
//   } catch (error) {
//     console.error('Error fetching filtered PDFs:', error);
//     res.status(500).json({ error: 'Error fetching filtered PDFs' });
//   }
// });

// // Get pinned PDFs endpoint
// app.get('/api/pdfs/pinned', async (req, res) => {
//   try {
//     const pinnedPdfs = await PDF.find({ pinned: true }).sort({ uploadDate: -1 });
//     res.status(200).json(pinnedPdfs);
//   } catch (error) {
//     console.error('Error fetching pinned PDFs:', error);
//     res.status(500).json({ error: 'Error fetching pinned PDFs' });
//   }
// });

// // Toggle pin status for a PDF
// app.patch('/api/pdfs/:id/pin', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pdf = await PDF.findById(id);
    
//     if (!pdf) {
//       return res.status(404).json({ error: 'PDF not found' });
//     }
    
//     pdf.pinned = !pdf.pinned;
//     await pdf.save();
    
//     res.status(200).json({
//       message: `PDF ${pdf.pinned ? 'pinned' : 'unpinned'} successfully`,
//       pdf: pdf
//     });
//   } catch (error) {
//     console.error('Error toggling pin status:', error);
//     res.status(500).json({ error: 'Error toggling pin status' });
//   }
// });

// // NEW: UPDATE/EDIT PDF endpoint
// app.put('/api/pdfs/:id', upload.single('pdf'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, subject, classNumber, description, pinned } = req.body;

//     // Find the existing PDF
//     const existingPdf = await PDF.findById(id);
//     if (!existingPdf) {
//       return res.status(404).json({ error: 'PDF not found' });
//     }

//     // Prepare update data
//     const updateData = {
//       title: title || existingPdf.title,
//       description: description !== undefined ? description : existingPdf.description,
//       subject: subject || existingPdf.subject,
//       class: classNumber || existingPdf.class,
//       pinned: pinned !== undefined ? (pinned === 'true' || pinned === true) : existingPdf.pinned
//     };

//     // If a new file is uploaded, handle file replacement
//     if (req.file) {
//       try {
//         // Delete old local file if it exists
//         if (existingPdf.filepath && fs.existsSync(existingPdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, ''))) {
//           fs.unlinkSync(existingPdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, ''));
//         }

//         const localFilePath = req.file.path;

//         // Upload new file to Cloudinary
//         const rawUpload = await cloudinary.uploader.upload(localFilePath, {
//           resource_type: 'raw',
//           folder: 'pdfs',
//         });

//         const autoUpload = await cloudinary.uploader.upload(localFilePath, {
//           resource_type: 'auto',
//           folder: 'pdfs',
//         });

//         const thumbnailUrl = cloudinary.url(autoUpload.public_id, {
//           format: 'jpg',
//           page: 1,
//           secure: true,
//         });

//         const localPdfUrl = `${req.protocol}://${req.get('host')}/${localFilePath}`;

//         // Update file-related fields
//         updateData.filename = req.file.filename;
//         updateData.filepath = localPdfUrl;
//         updateData.pdfUrl = rawUpload.secure_url;
//         updateData.thumbnailUrl = thumbnailUrl;
//       } catch (fileError) {
//         console.error('Error handling file update:', fileError);
//         return res.status(500).json({ error: 'Error updating file: ' + fileError.message });
//       }
//     }

//     // Update the PDF document
//     const updatedPdf = await PDF.findByIdAndUpdate(id, updateData, { new: true });

//     res.status(200).json({
//       message: 'PDF updated successfully',
//       pdf: updatedPdf
//     });

//   } catch (error) {
//     console.error('Error updating PDF:', error);
//     res.status(500).json({ error: 'Error updating PDF: ' + error.message });
//   }
// });

// // NEW: DELETE PDF endpoint
// app.delete('/api/pdfs/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Find the PDF to get file information
//     const pdf = await PDF.findById(id);
//     if (!pdf) {
//       return res.status(404).json({ error: 'PDF not found' });
//     }

//     // Delete local file if it exists
//     try {
//       if (pdf.filepath) {
//         const localPath = pdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, '');
//         if (fs.existsSync(localPath)) {
//           fs.unlinkSync(localPath);
//           console.log('Local file deleted successfully');
//         }
//       }
//     } catch (fileError) {
//       console.warn('Warning: Could not delete local file:', fileError.message);
//       // Continue with database deletion even if file deletion fails
//     }

//     // Delete from Cloudinary (optional - you might want to keep files in cloud)
//     try {
//       if (pdf.pdfUrl && pdf.pdfUrl !== "#") {
//         // Extract public_id from Cloudinary URL for deletion
//         const urlParts = pdf.pdfUrl.split('/');
//         const publicIdWithExtension = urlParts.slice(-2).join('/'); // folder/filename
//         const publicId = publicIdWithExtension.split('.')[0]; // remove extension
        
//         await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
//         console.log('Cloudinary file deleted successfully');
//       }
//     } catch (cloudinaryError) {
//       console.warn('Warning: Could not delete Cloudinary file:', cloudinaryError.message);
//       // Continue with database deletion even if Cloudinary deletion fails
//     }

//     // Delete from database
//     await PDF.findByIdAndDelete(id);

//     res.status(200).json({
//       message: 'PDF deleted successfully',
//       deletedPdf: {
//         id: pdf._id,
//         title: pdf.title
//       }
//     });

//   } catch (error) {
//     console.error('Error deleting PDF:', error);
//     res.status(500).json({ error: 'Error deleting PDF: ' + error.message });
//   }
// });

// // NEW: BULK DELETE PDFs endpoint
// app.delete('/api/pdfs/bulk', async (req, res) => {
//   try {
//     const { ids } = req.body;
    
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ error: 'No PDF IDs provided' });
//     }

//     // Find all PDFs to be deleted
//     const pdfsToDelete = await PDF.find({ _id: { $in: ids } });
    
//     if (pdfsToDelete.length === 0) {
//       return res.status(404).json({ error: 'No PDFs found with provided IDs' });
//     }

//     // Delete local files and Cloudinary files
//     const deletionResults = {
//       successful: [],
//       failed: []
//     };

//     for (const pdf of pdfsToDelete) {
//       try {
//         // Delete local file
//         if (pdf.filepath) {
//           const localPath = pdf.filepath.replace(/^https?:\/\/[^\/]+\//, '');
//           if (fs.existsSync(localPath)) {
//             fs.unlinkSync(localPath);
//           }
//         }

//         // Delete from Cloudinary
//         if (pdf.pdfUrl && pdf.pdfUrl !== "#") {
//           const urlParts = pdf.pdfUrl.split('/');
//           const publicIdWithExtension = urlParts.slice(-2).join('/');
//           const publicId = publicIdWithExtension.split('.')[0];
          
//           await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
//         }

//         deletionResults.successful.push({
//           id: pdf._id,
//           title: pdf.title
//         });

//       } catch (fileError) {
//         console.warn(`Warning: Could not delete files for PDF ${pdf._id}:`, fileError.message);
//         deletionResults.failed.push({
//           id: pdf._id,
//           title: pdf.title,
//           error: fileError.message
//         });
//       }
//     }

//     // Delete from database
//     const deleteResult = await PDF.deleteMany({ _id: { $in: ids } });

//     res.status(200).json({
//       message: `${deleteResult.deletedCount} PDFs deleted successfully`,
//       deletedCount: deleteResult.deletedCount,
//       deletionResults: deletionResults
//     });

//   } catch (error) {
//     console.error('Error bulk deleting PDFs:', error);
//     res.status(500).json({ error: 'Error bulk deleting PDFs: ' + error.message });
//   }
// });

// // Get available classes
// app.get('/api/classes', async (req, res) => {
//   try {
//     const classes = await PDF.distinct('class');
//     res.status(200).json(classes);
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     res.status(500).json({ error: 'Error fetching classes' });
//   }
// });

// // Get available subjects (optionally filtered by class)
// app.get('/api/subjects', async (req, res) => {
//   try {
//     const { class: classNumber } = req.query;
//     const query = classNumber ? { class: classNumber } : {};
    
//     const subjects = await PDF.distinct('subject', query);
//     res.status(200).json(subjects);
//   } catch (error) {
//     console.error('Error fetching subjects:', error);
//     res.status(500).json({ error: 'Error fetching subjects' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
//   } catch (err) {
//     console.error('Admin login error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // console.log(adminRoutes);
// // POST route for form submission
// app.post('/upload', uploadPdf.single('file'), async (req, res) => {
//   console.log('Received Body:', JSON.stringify(req.body, null, 2));
// console.log('Received File:', JSON.stringify(req.file, null, 2));

// const { class: className, subject, title } = req.body;
// const fileUrl = req.file ? req.file.path : '';  // Make sure fileUrl is only used if file is present

// // Log any issues with missing or undefined fields
// if (!className || !subject || !title || !fileUrl) {
//   console.log('Missing fields in form data');
//   return res.status(400).json({ message: 'Missing required fields' });
// }

// const newEntry = new UploadedData({
//   class: className,
//   subject,
//   title,
//   pdfUrl: fileUrl,
// });

// try {
//   // Save data to MongoDB
//   await newEntry.save();
//   res.json({
//     message: 'File uploaded successfully!',
//     data: newEntry,
//   });
// } catch (err) {
//   console.error('Error saving to MongoDB:', err);
//   res.status(500).json({ message: 'Error saving data to database' });
// }
// });
// app.get('/uploads', async (req, res) => {
// try {
//   const uploads = await UploadedData.find(); // Fetch all data from MongoDB
//   res.json(uploads);
// } catch (err) {
//   console.error('Error fetching uploads:', err);
//   res.status(500).json({ message: 'Error fetching data from database' });
// }
// });
// app.put('/uploads/:id', async (req, res) => {
// try {
//   const updated = await UploadedData.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   if (!updated) return res.status(404).json({ message: 'Upload not found' });
//   res.json(updated);
// } catch (err) {
//   res.status(400).json({ error: err.message });
// }
// });
// app.delete('/uploads/:id', async (req, res) => {
// try {
//   const deleted = await UploadedData.findByIdAndDelete(req.params.id);
//   if (!deleted) return res.status(404).json({ message: 'Upload not found' });
//   res.json({ message: 'Upload deleted successfully' });
// } catch (err) {
//   res.status(500).json({ error: err.message });
// }
// });

// // blh
// // // Create Blog
// app.post('/blogs', uploadImage.single('image'), async (req, res) => {
//   const { title, content, excerpt, author, category, tags, isPublished } = req.body;
//   const imageUrl = req.file ? req.file.path : '';

//   if (!title || !content || !excerpt || !author || !category) {
//     return res.status(400).json({ 
//       message: 'Title, content, excerpt, author, and category are required' 
//     });
//   }

//   // Parse tags if they're sent as a string
//   const tagArray = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [];

//   const newBlog = new Blog({
//     title,
//     content,
//     excerpt,
//     imageUrl,
//     author,
//     category,
//     tags: tagArray,
//     isPublished: isPublished === 'true' || isPublished === true
//   });

//   try {
//     await newBlog.save();
//     res.json({ message: 'Blog created successfully', blog: newBlog });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to save blog', error: err.message });
//   }
// });

// // Get All Blogs
// app.get('/blogs', async (req, res) => {
//   try {
//     const { category, published, author } = req.query;
    
//     let filter = {};
//     if (category) filter.category = category;
//     if (published !== undefined) filter.isPublished = published === 'true';
//     if (author) filter.author = new RegExp(author, 'i');

//     const blogs = await Blog.find(filter).sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch blogs' });
//   }
// });

// // Get Single Blog
// app.get('/blogs/:id', async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found' });
//     }
//     res.json(blog);
//   } catch (err) {
//     res.status(404).json({ error: 'Blog not found' });
//   }
// });

// // Update Blog
// app.put('/blogs/:id', uploadImage.single('image'), async (req, res) => {
//   const { title, content, excerpt, author, category, tags, isPublished } = req.body;
  
//   const updateData = {
//     title,
//     content,
//     excerpt,
//     author,
//     category,
//     tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [],
//     isPublished: isPublished === 'true' || isPublished === true
//   };

//   if (req.file) updateData.imageUrl = req.file.path;

//   // Calculate reading time
//   if (content) {
//     const wordCount = content.split(/\s+/).length;
//     updateData.readingTime = Math.ceil(wordCount / 200);
//   }

//   // Set published date if publishing for the first time
//   if (updateData.isPublished) {
//     const existingBlog = await Blog.findById(req.params.id);
//     if (existingBlog && !existingBlog.isPublished) {
//       updateData.publishedDate = new Date();
//     }
//   }

//   try {
//     const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Blog not found' });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update blog', error: err.message });
//   }
// });

// // Delete Blog
// app.delete('/blogs/:id', async (req, res) => {
//   try {
//     const deleted = await Blog.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Blog not found' });
//     res.json({ message: 'Blog deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete blog' });
//   }
// });

// // Get blogs by category
// app.get('/blogs/category/:category', async (req, res) => {
//   try {
//     const blogs = await Blog.find({ 
//       category: req.params.category,
//       isPublished: true 
//     }).sort({ publishedDate: -1 });
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch blogs by category' });
//   }
// });

// // Get published blogs only
// app.get('/blogs/published', async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isPublished: true }).sort({ publishedDate: -1 });
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch published blogs' });
//   }
// });
// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const blogRoutes = require("./routes/blog");


// MongoDB Connection
console.log("hello")
console.log(process.env.MONGO_URI)
console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_API_KEY)
console.log(process.env.CLOUDINARY_API_SECRET)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Routes
const PDF = require('./model/notespdf');
const pdfController = require('./controllers/notescontroller');
app.use("/api/blogs", blogRoutes);

// Routes
// app.post('/api/pdfs/upload', upload.single('pdf'), pdfController.uploadPdf);
app.post('/api/upload-pdf', upload.single('pdf'), pdfController.uploadPdf);
app.get('/api/pdfs', pdfController.getAllPdfs);
app.get('/api/pdfs/:id', pdfController.getSinglePdf);
app.get('/api/filter', pdfController.filterPdfs);
app.get('/api/pinned', pdfController.getPinnedPdfs);
app.put('/api/pin/:id', pdfController.pinToggle);
app.put('/api/pdfs/:id', upload.single('pdf'), pdfController.updatePdf);
app.delete('/api/pdfs/:id', pdfController.deletePdf);
app.post('/api/delete-multiple', pdfController.bulkDelete);
app.get('/api/classes', pdfController.getClasses);
app.get('/api/subjects', pdfController.getSubjects);

// Default route
app.get('/', (req, res) => {
  res.send('📚 Study Material API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
