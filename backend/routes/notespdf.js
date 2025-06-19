// --- routes/pdfRoutes.js ---
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDF = require('../model/notespdf');
const imagekit = require('../utiliss/imagekit');
const { generateThumbnail } = require('../utiliss/claudinary');
const { cleanupTempFile } = require('../utiliss/fileCleanup');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Upload PDF
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  let tempFilePath = null;
  try {
    const { title, subject, classNumber, description, pinned } = req.body;
    tempFilePath = req.file.path;
    if (!title || !subject || !classNumber) {
      cleanupTempFile(tempFilePath);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imagekitUpload = await imagekit.upload({
      file: fs.readFileSync(tempFilePath),
      fileName: `pdf_${Date.now()}_${req.file.originalname}`,
      folder: "/pdfs/",
      useUniqueFileName: true
    });

    const thumbnailUrl = await generateThumbnail(tempFilePath);

    const newPdf = new PDF({
      title: title.trim(),
      description: description?.trim() || '',
      subject: subject.trim(),
      class: classNumber.trim(),
      filename: req.file.originalname,
      pdfUrl: imagekitUpload.url,
      thumbnailUrl,
      imagekitFileId: imagekitUpload.fileId,
      pinned: pinned === 'true' || pinned === true
    });

    await newPdf.save();
    cleanupTempFile(tempFilePath);
    res.status(201).json({ message: 'Uploaded', pdf: newPdf });

  } catch (error) {
    if (tempFilePath) cleanupTempFile(tempFilePath);
    res.status(500).json({ error: error.message });
  }
});

// Get all PDFs
router.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadDate: -1 });
    res.status(200).json(pdfs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Other endpoints like /filter, /classes, /subjects, /pdf/:id, DELETE, PUT... can be added here

module.exports = router;
