const mongoose = require('mongoose');

// MongoDB schema for PDF documents
const pdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  filename: String,
  filepath: String,
  pdfUrl: {
    type: String,
    default: "#"
  },
  thumbnailUrl: String,
  pageCount: {
    type: Number,
    default: 0
  },
  pinned: {
    type: Boolean,
    default: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;