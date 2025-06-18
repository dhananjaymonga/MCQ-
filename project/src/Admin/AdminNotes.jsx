import React, { useState, useEffect } from 'react';
import { Upload, Search, Filter, Eye, Download, Edit3, Trash2, Pin, X, Save, Plus, FileText, BookOpen, GraduationCap, Calendar, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://pdfman.onrender.com/api';

// Predefined options
const PREDEFINED_CLASSES = ['6', '7', '8', '9', '10', '11', '12'];
const PREDEFINED_SUBJECTS = ['Chemistry', 'Physics', 'Biology'];

const AdminPanel = () => {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Filter states
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfToDelete, setPdfToDelete] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    classNumber: '',
    pinned: false,
    file: null
  });

  // Fetch data functions
  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs`);
      const data = await response.json();
      setPdfs(data);
      setFilteredPdfs(data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      alert('Error fetching PDFs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`);
      const data = await response.json();
      // Combine predefined subjects with fetched ones
      const allSubjects = [...new Set([...PREDEFINED_SUBJECTS, ...data])];
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects(PREDEFINED_SUBJECTS);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`);
      const data = await response.json();
      // Combine predefined classes with fetched ones
      const allClasses = [...new Set([...PREDEFINED_CLASSES, ...data])];
      setClasses(allClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses(PREDEFINED_CLASSES);
    }
  };

  // Filter PDFs
  const filterPdfs = () => {
    let filtered = pdfs;

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(pdf => pdf.subject === selectedSubject);
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(pdf => pdf.class === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.filter(pdf => 
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPdfs(filtered);
  };

  // Upload PDF
  const handleUpload = async () => {
    if (!formData.file || !formData.title || !formData.subject || !formData.classNumber) {
      alert('Please fill all required fields');
      return;
    }

    setUploadLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('pdf', formData.file);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('subject', formData.subject);
    uploadFormData.append('classNumber', formData.classNumber);
    uploadFormData.append('pinned', formData.pinned);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        alert('PDF uploaded successfully!');
        setShowUploadModal(false);
        resetForm();
        fetchPdfs();
        fetchSubjects();
        fetchClasses();
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete PDF
  const handleDeleteClick = (pdf) => {
    setPdfToDelete(pdf);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pdfToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pdf/${pdfToDelete._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('PDF deleted successfully!');
        fetchPdfs();
        setShowDeleteModal(false);
        setPdfToDelete(null);
      } else {
        alert('Failed to delete PDF');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  // Update PDF
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pdf/${selectedPdf._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          classNumber: formData.classNumber,
          pinned: formData.pinned
        })
      });

      if (response.ok) {
        alert('PDF updated successfully!');
        setShowEditModal(false);
        fetchPdfs();
      } else {
        alert('Failed to update PDF');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed. Please try again.');
    }
  };

  // Utility functions
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      classNumber: '',
      pinned: false,
      file: null
    });
  };

  const openEditModal = (pdf) => {
    setSelectedPdf(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      subject: pdf.subject,
      classNumber: pdf.class,
      pinned: pdf.pinned,
      file: null
    });
    setShowEditModal(true);
  };

  const openViewModal = (pdf) => {
    setSelectedPdf(pdf);
    setShowViewModal(true);
  };

  // Effects
  useEffect(() => {
    fetchPdfs();
    fetchSubjects();
    fetchClasses();
  }, []);

  useEffect(() => {
    filterPdfs();
  }, [selectedSubject, selectedClass, searchTerm, pdfs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Notes Admin Panel</h1>
              <p className="text-gray-600">Manage your educational PDFs and notes</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Upload PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search PDFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>

            <div className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} />
              Total: {filteredPdfs.length} PDFs
            </div>
          </div>
        </div>

        {/* PDF Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading PDFs...</p>
            </div>
          ) : filteredPdfs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No PDFs found</p>
            </div>
          ) : (
            filteredPdfs.map(pdf => (
              <div key={pdf._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Thumbnail */}
                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                  {pdf.thumbnailUrl ? (
                    <img 
                      src={pdf.thumbnailUrl} 
                      alt={pdf.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileText size={48} className="text-gray-400" />
                  )}
                  {pdf.pinned && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                      <Pin size={16} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{pdf.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <BookOpen size={14} />
                    <span>{pdf.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <GraduationCap size={14} />
                    <span>Class {pdf.class}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar size={14} />
                    <span>{new Date(pdf.uploadDate).toLocaleDateString()}</span>
                  </div>

                  {/* Actions - Fixed Layout */}
                  <div className="space-y-2">
                    {/* First Row - View and Download */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openViewModal(pdf)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors text-sm"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={() => window.open(pdf.pdfUrl, '_blank')}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors text-sm"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                    
                    {/* Second Row - Edit and Delete */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(pdf)}
                        className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors text-sm"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pdf)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload New PDF</h2>
                <button onClick={() => setShowUploadModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">PDF File *</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Subject</option>
                    {PREDEFINED_SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Class *</label>
                  <select
                    value={formData.classNumber}
                    onChange={(e) => setFormData({...formData, classNumber: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Class</option>
                    {PREDEFINED_CLASSES.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="pinned" className="text-sm">Pin this PDF</label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit PDF</h2>
                <button onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Subject</option>
                    {PREDEFINED_SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Class *</label>
                  <select
                    value={formData.classNumber}
                    onChange={(e) => setFormData({...formData, classNumber: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Class</option>
                    {PREDEFINED_CLASSES.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editPinned"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="editPinned" className="text-sm">Pin this PDF</label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && pdfToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Are you sure you want to delete this PDF?</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800">{pdfToDelete.title}</p>
                  <p className="text-sm text-gray-600">{pdfToDelete.subject} - Class {pdfToDelete.class}</p>
                </div>
                <p className="text-red-600 text-sm mt-2">This action cannot be undone.</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPdfToDelete(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Delete PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal - FIXED FULLSCREEN PDF VIEWER */}
        {showViewModal && selectedPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
            {/* Header */}
            <div className="bg-white p-4 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 truncate">{selectedPdf.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span><strong>Subject:</strong> {selectedPdf.subject}</span>
                  <span><strong>Class:</strong> {selectedPdf.class}</span>
                  <span><strong>Upload Date:</strong> {new Date(selectedPdf.uploadDate).toLocaleDateString()}</span>
                  {selectedPdf.pinned && <span className="text-yellow-600"><strong>📌 Pinned</strong></span>}
                </div>
                {selectedPdf.description && (
                  <p className="text-sm text-gray-600 mt-1 truncate">{selectedPdf.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => window.open(selectedPdf.pdfUrl, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Eye size={16} />
                  New Tab
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedPdf.pdfUrl;
                    link.download = selectedPdf.filename;
                    link.click();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Download size={16} />
                  Download
                </button>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer - Full Height */}
            <div className="flex-1 bg-gray-100">
              <iframe
                src={selectedPdf.pdfUrl}
                className="w-full h-full border-0"
                title={selectedPdf.title}
                style={{ minHeight: 'calc(100vh - 100px)' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;