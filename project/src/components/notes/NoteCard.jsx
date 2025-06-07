import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, FileText, Download, ExternalLink, Eye } from 'lucide-react';

// Helper function to safely get subject color
const getSubjectColor = (subject = '') => {
  const lowerSubject = subject.toLowerCase();
  switch (lowerSubject) {
    case 'physics':
      return { 
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-400'
      };
    case 'chemistry':
      return { 
        text: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-400'
      };
    case 'biology':
      return { 
        text: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-400'
      };
    default:
      return { 
        text: 'text-gray-500',
        bg: 'bg-gray-100',
        border: 'border-gray-300'
      };
  }
};

const NoteCard = ({ note = {}, onTogglePin = () => {} }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Safely handle missing note data
  const safeNote = {
    id: note.id || note._id || '',
    title: note.title || 'Untitled Note',
    description: note.description || 'No description available',
    subject: note.subject || 'general',
    class: note.class || '',
    pinned: note.pinned || false,
    filepath: note.filepath || note.pdfUrl || '#',
    thumbnailUrl: note.thumbnailUrl || '',
    pageCount: note.pageCount || 0,
    uploadDate: note.uploadDate || new Date()
  };

  const { text, bg, border } = getSubjectColor(safeNote.subject);

  // VIEW/PREVIEW Function - Opens PDF in new tab
  const handlePdfView = () => {
    if (safeNote.filepath && safeNote.filepath !== '#') {
      window.open(safeNote.filepath, '_blank');
    } else {
      setError('PDF file not available for viewing');
    }
  };

  // DOWNLOAD Function - Forces download with proper file handling
  const handleDownload = async () => {
    if (!safeNote.filepath || safeNote.filepath === '#') {
      setError('PDF file not available for download');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // Fetch the PDF file
      const response = await fetch(safeNote.filepath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        console.warn('Warning: Content type is not PDF:', contentType);
      }

      // Convert to blob with explicit PDF type
      const blob = await response.blob();
      
      // Ensure blob is treated as PDF
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);

      // Create safe filename with proper extension
      let fileName = safeNote.title
        ? safeNote.title.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_')
        : 'study-note';
      
      // Ensure .pdf extension
      if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
      }

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      
      // Add additional attributes for better compatibility
      link.setAttribute('type', 'application/pdf');
      link.style.display = 'none';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      console.log('Download initiated successfully for:', fileName);
      setError(null);
      
    } catch (err) {
      console.error('Download error:', err);
      setError(`Download failed: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className={`relative bg-white rounded-lg shadow-md border-l-4 ${border} hover:shadow-lg transition-shadow duration-300`}
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      {/* Pin button */}
      <button
        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
          safeNote.pinned 
            ? `${text} ${bg} border-2 ${border}` 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        onClick={(e) => {
          e.preventDefault();
          onTogglePin(safeNote.id);
        }}
        aria-label={safeNote.pinned ? 'Unpin note' : 'Pin note'}
      >
        <Pin size={16} className={safeNote.pinned ? 'fill-current' : ''} />
      </button>

      <div className="p-6">
        {/* Subject and Class Info */}
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-full ${bg} mr-3`}>
            <FileText className={`h-5 w-5 ${text}`} />
          </div>
          <div>
            <span className={`text-xs font-medium ${text} uppercase`}>
              {safeNote.subject}
            </span>
            {safeNote.class && (
              <span className="text-xs text-gray-500 ml-2">Class {safeNote.class}</span>
            )}
          </div>
        </div>
        
        {/* Title and Description */}
        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">
          {safeNote.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {safeNote.description}
        </p>
        
        {/* PDF Info */}
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          {safeNote.pageCount > 0 && (
            <p>📄 Pages: {safeNote.pageCount}</p>
          )}
          <p>📅 {new Date(safeNote.uploadDate).toLocaleDateString()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* View Button */}
          <button
            onClick={handlePdfView}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${text} ${bg} hover:opacity-80`}
          >
            <Eye size={16} className="mr-1" />
            View PDF
          </button>
          
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isDownloading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <Download size={16} className="mr-1" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>

        {/* Preview Toggle */}
        <div className="border-t pt-3">
          <button
            className={`text-sm font-medium ${text} hover:opacity-80 flex items-center`}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
            <ExternalLink size={14} className="ml-1" />
          </button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <motion.div
            className="mt-4 border rounded-md overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {safeNote.thumbnailUrl ? (
              <>
                <div className="aspect-video bg-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={safeNote.thumbnailUrl} 
                    alt={`${safeNote.title} preview`}
                    className="max-w-full max-h-full object-contain rounded border"
                  />
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button
                    onClick={handlePdfView}
                    className={`text-sm ${text} hover:opacity-80 font-medium flex items-center justify-center w-full`}
                  >
                    View Full PDF <ExternalLink size={14} className="ml-1" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No preview available</p>
                <button
                  onClick={handlePdfView}
                  className={`mt-2 text-sm ${text} hover:opacity-80 font-medium`}
                >
                  Open PDF to view
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-600 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NoteCard;