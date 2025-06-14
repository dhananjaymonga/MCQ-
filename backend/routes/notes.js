const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const PDF = require('../model/notespdf');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dvn9wwxhl',
    api_key: '496822881153243',
    api_secret: 'yHK8hESIHgkrJMjhD5K5sPLRzDs'
});

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    console.log('Saving file as:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Debug route to check if file exists
router.get('/check-file/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    // Check uploads directory
    const dirExists = fs.existsSync(uploadsDir);
    const fileExists = fs.existsSync(filePath);
    
    // List all files in uploads
    let files = [];
    if (dirExists) {
      files = fs.readdirSync(uploadsDir);
    }
    
    res.json({
      filename,
      filePath,
      uploadsDir,
      dirExists,
      fileExists,
      allFiles: files,
      __dirname: __dirname
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct PDF file access by filename
router.get('/file/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set proper headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Send the file
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Error serving file' });
  }
});

// Upload PDF endpoint
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
      console.log(req.body);
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const { title, subject, classNumber, description, pinned } = req.body;
  
      if (!title || !subject || !classNumber) {
        return res.status(400).json({ error: 'Title, subject, and class are required' });
      }
  
      const localFilePath = req.file.path;
  
      // 1. Upload as raw (for full PDF view)
      const rawUpload = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'raw',
        folder: 'pdfs',
      });
  
      // 2. Upload as auto (for thumbnail)
      const autoUpload = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto',
        folder: 'pdfs',
      });
  
      // Generate thumbnail URL from the auto upload
      const thumbnailUrl = cloudinary.url(autoUpload.public_id, {
        format: 'jpg',
        page: 1,
        secure: true,
      });
  
      const localPdfUrl = `${req.protocol}://${req.get('host')}/${localFilePath}`;
  
      // Save to MongoDB with new fields
      const newPdf = new PDF({
        title: title,
        description: description || '',
        subject: subject,
        class: classNumber,
        filename: req.file.filename,
        filepath: localPdfUrl,
        pdfUrl: rawUpload.secure_url,
        thumbnailUrl: thumbnailUrl,
        pageCount: 5,
        pinned: pinned === 'true' || pinned === true,
        uploadDate: new Date(),
        createdAt: new Date()
      });
  
      await newPdf.save();
  
      res.status(201).json({
        message: 'PDF uploaded successfully',
        pdf: newPdf
      });
  
    } catch (error) {
      console.error('Error uploading PDF:', error);
      res.status(500).json({ error: 'Error uploading PDF: ' + error.message });
    }
});

// Get all PDFs endpoint
router.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadDate: -1 });
    res.status(200).json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ error: 'Error fetching PDFs' });
  }
});

// Get single PDF by ID - FIXED VERSION
router.get('/pdfs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PDF.findById(id);

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // If pdfUrl exists, redirect to Cloudinary URL
    if (pdf.pdfUrl && pdf.pdfUrl !== "#") {
      return res.redirect(pdf.pdfUrl);
    }

    // If local file path exists, serve the local file
    if (pdf.filepath) {
      const localPath = pdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, '');
      const fullPath = path.join(__dirname, '..', localPath);
      
      if (fs.existsSync(fullPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdf.title || 'study-note'}.pdf"`);
        return res.sendFile(path.resolve(fullPath));
      }
    }

    return res.status(404).json({ error: 'PDF file not found' });

  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Error fetching PDF' });
  }
});

// Get PDFs by class and subject
router.get('/pdfs/filter', async (req, res) => {
  try {
    const { class: classNumber, subject } = req.query;
    const query = {};
    
    if (classNumber) query.class = classNumber;
    if (subject) query.subject = subject;
    
    const pdfs = await PDF.find(query).sort({ uploadDate: -1 });
    res.status(200).json(pdfs);
  } catch (error) {
    console.error('Error fetching filtered PDFs:', error);
    res.status(500).json({ error: 'Error fetching filtered PDFs' });
  }
});

// Get pinned PDFs endpoint
router.get('/pdfs/pinned', async (req, res) => {
  try {
    const pinnedPdfs = await PDF.find({ pinned: true }).sort({ uploadDate: -1 });
    res.status(200).json(pinnedPdfs);
  } catch (error) {
    console.error('Error fetching pinned PDFs:', error);
    res.status(500).json({ error: 'Error fetching pinned PDFs' });
  }
});

// Toggle pin status for a PDF
router.patch('/pdfs/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PDF.findById(id);
    
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    pdf.pinned = !pdf.pinned;
    await pdf.save();
    
    res.status(200).json({
      message: `PDF ${pdf.pinned ? 'pinned' : 'unpinned'} successfully`,
      pdf: pdf
    });
  } catch (error) {
    console.error('Error toggling pin status:', error);
    res.status(500).json({ error: 'Error toggling pin status' });
  }
});

// UPDATE/EDIT PDF endpoint
router.put('/pdfs/:id', upload.single('pdf'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, classNumber, description, pinned } = req.body;

    // Find the existing PDF
    const existingPdf = await PDF.findById(id);
    if (!existingPdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Prepare update data
    const updateData = {
      title: title || existingPdf.title,
      description: description !== undefined ? description : existingPdf.description,
      subject: subject || existingPdf.subject,
      class: classNumber || existingPdf.class,
      pinned: pinned !== undefined ? (pinned === 'true' || pinned === true) : existingPdf.pinned
    };

    // If a new file is uploaded, handle file replacement
    if (req.file) {
      try {
        // Delete old local file if it exists
        if (existingPdf.filepath && fs.existsSync(existingPdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, ''))) {
          fs.unlinkSync(existingPdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, ''));
        }

        const localFilePath = req.file.path;

        // Upload new file to Cloudinary
        const rawUpload = await cloudinary.uploader.upload(localFilePath, {
          resource_type: 'raw',
          folder: 'pdfs',
        });

        const autoUpload = await cloudinary.uploader.upload(localFilePath, {
          resource_type: 'auto',
          folder: 'pdfs',
        });

        const thumbnailUrl = cloudinary.url(autoUpload.public_id, {
          format: 'jpg',
          page: 1,
          secure: true,
        });

        const localPdfUrl = `${req.protocol}://${req.get('host')}/${localFilePath}`;

        // Update file-related fields
        updateData.filename = req.file.filename;
        updateData.filepath = localPdfUrl;
        updateData.pdfUrl = rawUpload.secure_url;
        updateData.thumbnailUrl = thumbnailUrl;
      } catch (fileError) {
        console.error('Error handling file update:', fileError);
        return res.status(500).json({ error: 'Error updating file: ' + fileError.message });
      }
    }

    // Update the PDF document
    const updatedPdf = await PDF.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: 'PDF updated successfully',
      pdf: updatedPdf
    });

  } catch (error) {
    console.error('Error updating PDF:', error);
    res.status(500).json({ error: 'Error updating PDF: ' + error.message });
  }
});

// DELETE PDF endpoint
router.delete('/pdfs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the PDF to get file information
    const pdf = await PDF.findById(id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Delete local file if it exists
    try {
      if (pdf.filepath) {
        const localPath = pdf.filepath.replace(`${req.protocol}://${req.get('host')}/`, '');
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
          console.log('Local file deleted successfully');
        }
      }
    } catch (fileError) {
      console.warn('Warning: Could not delete local file:', fileError.message);
    }

    // Delete from Cloudinary
    try {
      if (pdf.pdfUrl && pdf.pdfUrl !== "#") {
        const urlParts = pdf.pdfUrl.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExtension.split('.')[0];
        
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log('Cloudinary file deleted successfully');
      }
    } catch (cloudinaryError) {
      console.warn('Warning: Could not delete Cloudinary file:', cloudinaryError.message);
    }

    // Delete from database
    await PDF.findByIdAndDelete(id);

    res.status(200).json({
      message: 'PDF deleted successfully',
      deletedPdf: {
        id: pdf._id,
        title: pdf.title
      }
    });

  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ error: 'Error deleting PDF: ' + error.message });
  }
});

// BULK DELETE PDFs endpoint
router.delete('/pdfs/bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No PDF IDs provided' });
    }

    // Find all PDFs to be deleted
    const pdfsToDelete = await PDF.find({ _id: { $in: ids } });
    
    if (pdfsToDelete.length === 0) {
      return res.status(404).json({ error: 'No PDFs found with provided IDs' });
    }

    // Delete local files and Cloudinary files
    const deletionResults = {
      successful: [],
      failed: []
    };

    for (const pdf of pdfsToDelete) {
      try {
        // Delete local file
        if (pdf.filepath) {
          const localPath = pdf.filepath.replace(/^https?:\/\/[^\/]+\//, '');
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
          }
        }

        // Delete from Cloudinary
        if (pdf.pdfUrl && pdf.pdfUrl !== "#") {
          const urlParts = pdf.pdfUrl.split('/');
          const publicIdWithExtension = urlParts.slice(-2).join('/');
          const publicId = publicIdWithExtension.split('.')[0];
          
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }

        deletionResults.successful.push({
          id: pdf._id,
          title: pdf.title
        });

      } catch (fileError) {
        console.warn(`Warning: Could not delete files for PDF ${pdf._id}:`, fileError.message);
        deletionResults.failed.push({
          id: pdf._id,
          title: pdf.title,
          error: fileError.message
        });
      }
    }

    // Delete from database
    const deleteResult = await PDF.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `${deleteResult.deletedCount} PDFs deleted successfully`,
      deletedCount: deleteResult.deletedCount,
      deletionResults: deletionResults
    });

  } catch (error) {
    console.error('Error bulk deleting PDFs:', error);
    res.status(500).json({ error: 'Error bulk deleting PDFs: ' + error.message });
  }
});

// Get available classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await PDF.distinct('class');
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
});

// Get available subjects (optionally filtered by class)
router.get('/subjects', async (req, res) => {
  try {
    const { class: classNumber } = req.query;
    const query = classNumber ? { class: classNumber } : {};
    
    const subjects = await PDF.distinct('subject', query);
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Error fetching subjects' });
  }
});

module.exports = router;