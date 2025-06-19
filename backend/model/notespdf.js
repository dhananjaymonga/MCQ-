// --- models/PDF.js ---
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  class: { type: String, required: true, trim: true },
  filename: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: "" },
  imagekitFileId: { type: String, required: true },
  pageCount: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  uploadDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PDF', pdfSchema);