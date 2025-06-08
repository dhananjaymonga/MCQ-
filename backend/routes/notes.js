const express = require('express');
const router = express.Router();
const upload = require("../utilty/multer");
const {
  uploadPdf,
  getAllPdfs,
  getSinglePdf,
  filterPdfs,
  getPinnedPdfs,
  pinToggle,
  updatePdf,
  deletePdf,
  bulkDelete,
  getClasses,
  getSubjects
} = require('../controllers/pdfController');

router.post('/upload-pdf', upload.single('pdf'), uploadPdf);
router.get('/pdfs', getAllPdfs);
router.get('/pdfs/:id', getSinglePdf);
router.get('/pdfs/filter', filterPdfs);
router.get('/pdfs/pinned', getPinnedPdfs);
router.patch('/pdfs/:id/pin', pinToggle);
router.put('/pdfs/:id', upload.single('pdf'), updatePdf);
router.delete('/pdfs/:id', deletePdf);
router.delete('/pdfs/bulk', bulkDelete);
router.get('/classes', getClasses);
router.get('/subjects', getSubjects);

module.exports = router;
