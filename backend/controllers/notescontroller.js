const fs = require('fs');
const path = require('path');
const cloudinary = require('../utilty/cloudinary');
const PDF = require('../model/notespdf');

// Upload PDF
exports.uploadPdf = async (req, res) => {
  try {
    const { title, description, subject, class: className } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw',
      folder: 'study-material/pdfs',
    });

    const newPdf = new PDF({
      title,
      description,
      subject,
      class: className,
      filename: file.originalname,
      filepath: file.path,
      pdfUrl: uploadResult.secure_url,
    });

    await newPdf.save();

    fs.unlinkSync(file.path); // Remove local file

    res.status(201).json(newPdf);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};

// Get all PDFs
exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadDate: -1 });
    res.status(200).json(pdfs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
};

// Get single PDF by ID
exports.getSinglePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PDF.findById(id);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });
    res.status(200).json(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
};

// Filter PDFs by subject/class
exports.filterPdfs = async (req, res) => {
  try {
    const { class: className, subject } = req.query;

    const filters = {};
    if (className) filters.class = className;
    if (subject) filters.subject = subject;

    const filteredPdfs = await PDF.find(filters).sort({ uploadDate: -1 });
    res.status(200).json(filteredPdfs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter PDFs' });
  }
};

// Get pinned PDFs
exports.getPinnedPdfs = async (req, res) => {
  try {
    const pinned = await PDF.find({ pinned: true }).sort({ uploadDate: -1 });
    res.status(200).json(pinned);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pinned PDFs' });
  }
};

// Toggle pin
exports.pinToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PDF.findById(id);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });

    pdf.pinned = !pdf.pinned;
    await pdf.save();

    res.status(200).json(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
};

// Update PDF (metadata or replace file)
exports.updatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject, class: className } = req.body;
    const file = req.file;

    const pdf = await PDF.findById(id);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: 'raw',
        folder: 'study-material/pdfs',
      });
      pdf.filename = file.originalname;
      pdf.pdfUrl = uploadResult.secure_url;
      fs.unlinkSync(file.path); // delete local
    }

    if (title) pdf.title = title;
    if (description) pdf.description = description;
    if (subject) pdf.subject = subject;
    if (className) pdf.class = className;

    await pdf.save();
    res.status(200).json(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update PDF' });
  }
};

// Delete PDF by ID
exports.deletePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PDF.findByIdAndDelete(id);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });

    res.status(200).json({ message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete PDF' });
  }
};

// Bulk delete PDFs by IDs
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid IDs' });

    await PDF.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'PDFs deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete PDFs' });
  }
};

// Get unique class names
exports.getClasses = async (req, res) => {
  try {
    const classes = await PDF.distinct('class');
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Get unique subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await PDF.distinct('subject');
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};
