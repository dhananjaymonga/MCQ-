import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import './App.css';

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [description, setDescription] = useState('');
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Predefined options
  const [predefinedClasses] = useState(['6', '7', '8', '9', '10', '11', '12']);
  const [predefinedSubjects] = useState(['Physics', 'Chemistry', 'Biology']);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // NEW: Search functionality
  const [filteredPdfs, setFilteredPdfs] = useState([]); // NEW: For search results

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [editingPdf, setEditingPdf] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    fetchPdfs();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchSubjects(selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    if (showPinnedOnly) {
      fetchPinnedPdfs();
    } else {
      fetchFilteredPdfs();
    }
  }, [selectedClass, selectedSubject, showPinnedOnly]);

  // NEW: Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPdfs(pdfs);
    } else {
      const filtered = pdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pdf.description && pdf.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPdfs(filtered);
    }
  }, [searchQuery, pdfs]);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pdfs');
      const sorted = response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setPdfs(sorted);
      setFilteredPdfs(sorted);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setError('Failed to load PDFs');
    }
  };

  const fetchPinnedPdfs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pdfs/pinned');
      const sorted = response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setPdfs(sorted);
      setFilteredPdfs(sorted);
    } catch (err) {
      console.error('Error fetching pinned PDFs:', err);
      setError('Failed to load pinned PDFs');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSubjects = async (classFilter = '') => {
    try {
      let url = 'http://localhost:5000/api/subjects';
      if (classFilter) {
        url += `?class=${classFilter}`;
      }
      const response = await axios.get(url);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const fetchFilteredPdfs = async () => {
    try {
      let url = 'http://localhost:5000/api/pdfs/filter?';
      const params = new URLSearchParams();
      if (selectedClass) params.append('class', selectedClass);
      if (selectedSubject) params.append('subject', selectedSubject);

      const response = await axios.get(`${url}${params.toString()}`);
      const sorted = response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setPdfs(sorted);
      setFilteredPdfs(sorted);
    } catch (err) {
      console.error('Error fetching filtered PDFs:', err);
      setError('Failed to load PDFs');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return setError('Please select a file');
    if (file.type !== 'application/pdf') return setError('Please upload a PDF file');
    if (!title || !subject || !classNumber) return setError('Please fill in all fields');

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('classNumber', classNumber);
      formData.append('description', description);
      formData.append('pinned', pinned);

      await axios.post('http://localhost:5000/api/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Reset form
      setFile(null);
      setTitle('');
      setSubject('');
      setClassNumber('');
      setDescription('');
      setPinned(false);
      document.getElementById('file-upload').value = '';

      setSuccess('PDF uploaded successfully!');
      
      await fetchPdfs();
      await fetchClasses();
      await fetchSubjects();

      if (galleryRef.current) {
        galleryRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError('Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (pdfId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/pdfs/${pdfId}/pin`);
      setSuccess(response.data.message);
      
      if (showPinnedOnly) {
        fetchPinnedPdfs();
      } else {
        fetchFilteredPdfs();
      }
    } catch (err) {
      console.error('Error toggling pin:', err);
      setError('Failed to update pin status');
    }
  };

  const handlePdfSelect = (pdf) => {
    setSelectedPdf(pdf);
    window.open(pdf.filepath, '_blank');
  };

  const downloadPDF = async (url, filename) => {
    try {
      setSuccess('Starting download...');
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'study-note.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
      setSuccess('Download complete!');
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed. Please try again.');
    }
  };

  const getStats = () => {
    const totalPdfs = pdfs.length;
    const pinnedPdfs = pdfs.filter(pdf => pdf.pinned).length;
    const subjectCounts = pdfs.reduce((acc, pdf) => {
      acc[pdf.subject] = (acc[pdf.subject] || 0) + 1;
      return acc;
    }, {});
    const classCounts = pdfs.reduce((acc, pdf) => {
      acc[pdf.class] = (acc[pdf.class] || 0) + 1;
      return acc;
    }, {});

    return { totalPdfs, pinnedPdfs, subjectCounts, classCounts };
  };

  const stats = getStats();

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="app">
      <header style={{ background: '#2c3e50', color: 'white', padding: '1rem', marginBottom: '2rem' }}>
        <h1>📚 PDF Admin Panel</h1>
        <p>Manage your PDF database with advanced controls</p>
      </header>

      {/* Statistics Dashboard */}
      <div className="stats-section" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>📊 Dashboard Statistics</h2>
          <button 
            onClick={() => setShowStats(!showStats)}
            style={{ padding: '0.5rem 1rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
        
        {showStats && (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#27ae60' }}>Total PDFs</h3>
              <p style={{ fontSize: '2rem', margin: '0', fontWeight: 'bold' }}>{stats.totalPdfs}</p>
            </div>
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#f39c12' }}>Pinned PDFs</h3>
              <p style={{ fontSize: '2rem', margin: '0', fontWeight: 'bold' }}>{stats.pinnedPdfs}</p>
            </div>
            <div style={{ padding: '1rem', background: '#d4edda', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>Top Subjects</h3>
              {Object.entries(stats.subjectCounts).slice(0, 3).map(([subject, count]) => (
                <p key={subject} style={{ margin: '0.25rem 0' }}>{subject}: {count}</p>
              ))}
            </div>
            <div style={{ padding: '1rem', background: '#d1ecf1', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0c5460' }}>Classes</h3>
              {Object.entries(stats.classCounts).slice(0, 3).map(([cls, count]) => (
                <p key={cls} style={{ margin: '0.25rem 0' }}>{cls}: {count}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
          ✅ {success}
        </div>
      )}

      <div className="upload-section" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📤 Upload New PDF</h2>
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="title">Title *:</label>
              <input 
                type="text" 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject *:</label>
              <select 
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Subject</option>
                {predefinedSubjects.map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="class">Class *:</label>
              <select 
                id="class"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Class</option>
                {predefinedClasses.map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="description">Description:</label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter a detailed description of the PDF content..."
              rows="3"
              style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '1rem 0' }}>
            <div className="form-group">
              <label htmlFor="file-upload">PDF File *:</label>
              <input 
                type="file" 
                id="file-upload"
                onChange={handleFileChange} 
                accept="application/pdf" 
                required
                style={{ margin: '0.5rem 0' }}
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                📌 Pin this PDF
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !file}
            style={{ 
              padding: '0.75rem 2rem', 
              background: loading ? '#95a5a6' : '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? '⏳ Uploading...' : '📤 Upload PDF'}
          </button>
        </form>
      </div>

      <div className="filter-section" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>🔍 Filter & Search PDFs</h2>
        
        {/* NEW: Search Bar */}
        <div className="search-bar" style={{ marginBottom: '1rem' }}>
          <label htmlFor="search">🔎 Search PDFs:</label>
          <input 
            type="text" 
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject, class, or description..."
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              margin: '0.5rem 0', 
              border: '2px solid #3498db', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label htmlFor="filter-class">Class:</label>
            <select 
              id="filter-class" 
              value={selectedClass} 
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject('');
              }}
              style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">All Classes</option>
              {predefinedClasses.map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
              {classes.filter(cls => !predefinedClasses.includes(cls)).map((cls, index) => (
                <option key={`custom-${index}`} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="filter-subject">Subject:</label>
            <select 
              id="filter-subject" 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">All Subjects</option>
              {predefinedSubjects.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
              {subjects.filter(subj => !predefinedSubjects.includes(subj)).map((subj, index) => (
                <option key={`custom-${index}`} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={showPinnedOnly}
                onChange={(e) => setShowPinnedOnly(e.target.checked)}
              />
              📌 Show Pinned Only
            </label>
          </div>

          <button 
            onClick={() => {
              setSelectedClass('');
              setSelectedSubject('');
              setShowPinnedOnly(false);
              setSearchQuery('');
              fetchPdfs();
            }}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            🔄 Reset All
          </button>
        </div>
      </div>

      <div className="pdf-gallery" ref={galleryRef}>
        <h2>📋 PDF Collection ({filteredPdfs.length} items)</h2>
        {filteredPdfs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem' }}>📁 No PDFs found.</p>
            {searchQuery ? (
              <p>Try adjusting your search terms or filters.</p>
            ) : (
              <p>Upload your first PDF to get started!</p>
            )}
          </div>
        ) : (
          <div className="pdf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredPdfs.map((pdf) => (
              <div key={pdf._id} className="pdf-card" style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                position: 'relative'
              }}>
                {pdf.pinned && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    background: '#f39c12', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    zIndex: 1
                  }}>
                    📌 Pinned
                  </div>
                )}
                
                <div className="thumbnail" style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={pdf.thumbnailUrl} 
                    alt={`Thumbnail for ${pdf.title}`} 
                    onClick={() => handlePdfSelect(pdf)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                  />
                </div>
                
                <div className="pdf-info" style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{pdf.title}</h3>
                  
                  {pdf.description && (
                    <p style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      margin: '0.5rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {pdf.description}
                    </p>
                  )}
                  
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                    <p style={{ margin: '0.25rem 0' }}>📚 {pdf.subject}</p>
                    <p style={{ margin: '0.25rem 0' }}>🎓 Class: {pdf.class}</p>
                    <p style={{ margin: '0.25rem 0' }}>📄 Pages: {pdf.pageCount}</p>
                    <p style={{ margin: '0.25rem 0' }}>📅 {new Date(pdf.uploadDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="pdf-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handlePdfSelect(pdf)} 
                      style={{ 
                        flex: 1,
                        padding: '0.5rem', 
                        background: '#3498db', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      👁️ View
                    </button>
                    <button 
                      onClick={() => downloadPDF(pdf.filepath, `${pdf.title}.pdf`)}
                      style={{ 
                        flex: 1,
                        padding: '0.5rem', 
                        background: '#27ae60', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      📥 Download
                    </button>
                    <button 
                      onClick={() => handleTogglePin(pdf._id)}
                      style={{ 
                        padding: '0.5rem', 
                        background: pdf.pinned ? '#e74c3c' : '#f39c12', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                      title={pdf.pinned ? 'Unpin PDF' : 'Pin PDF'}
                    >
                      {pdf.pinned ? '📌' : '📍'}
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
}

export default App;