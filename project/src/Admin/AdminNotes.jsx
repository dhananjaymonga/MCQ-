// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// // import './App.css';

// function App() {
//   const [pdfs, setPdfs] = useState([]);
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [subject, setSubject] = useState('');
//   const [classNumber, setClassNumber] = useState('');
//   const [description, setDescription] = useState('');
//   const [pinned, setPinned] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Predefined options
//   const [predefinedClasses] = useState(['6', '7', '8', '9', '10', '11', '12']);
//   const [predefinedSubjects] = useState(['Physics', 'Chemistry', 'Biology']);

//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [showPinnedOnly, setShowPinnedOnly] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(''); // NEW: Search functionality
//   const [filteredPdfs, setFilteredPdfs] = useState([]); // NEW: For search results

//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [editingPdf, setEditingPdf] = useState(null);
//   const [showStats, setShowStats] = useState(false);
//   const galleryRef = useRef(null);

//   useEffect(() => {
//     fetchPdfs();
//     fetchClasses();
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     fetchSubjects(selectedClass);
//   }, [selectedClass]);

//   useEffect(() => {
//     if (showPinnedOnly) {
//       fetchPinnedPdfs();
//     } else {
//       fetchFilteredPdfs();
//     }
//   }, [selectedClass, selectedSubject, showPinnedOnly]);

//   // NEW: Search functionality
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredPdfs(pdfs);
//     } else {
//       const filtered = pdfs.filter(pdf =>
//         pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         pdf.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         pdf.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (pdf.description && pdf.description.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredPdfs(filtered);
//     }
//   }, [searchQuery, pdfs]);

//   const fetchPdfs = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/pdfs');
//       const sorted = response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//       setPdfs(sorted);
//       setFilteredPdfs(sorted);
//     } catch (err) {
//       console.error('Error fetching PDFs:', err);
//       setError('Failed to load PDFs');
//     }
//   };

//   const fetchPinnedPdfs = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/pdfs/pinned');
//       const sorted = response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//       setPdfs(sorted);
//       setFilteredPdfs(sorted);
//     } catch (err) {
//       console.error('Error fetching pinned PDFs:', err);
//       setError('Failed to load pinned PDFs');
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/classes');
//       setClasses(response.data);
//     } catch (err) {
//       console.error('Error fetching classes:', err);
//     }
//   };

//   const fetchSubjects = async (classFilter = '') => {
//     try {
//       let url = 'http://localhost:5000/api/subjects';
//       if (classFilter) {
//         url += `?class=${classFilter}`;
//       }
//       const response = await axios.get(url);
//       setSubjects(response.data);
//     } catch (err) {
//       console.error('Error fetching subjects:', err);
//     }
//   };

//   const fetchFilteredPdfs = async () => {
//     try {
//       let url = 'http://localhost:5000/api/pdfs/filter?';
//       const params = new URLSearchParams();
//       if (selectedClass) params.append('class', selectedClass);
//       if (selectedSubject) params.append('subject', selectedSubject);

//       const response = await axios.get(`${url}${params.toString()}`);
//       const sorted = response.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//       setPdfs(sorted);
//       setFilteredPdfs(sorted);
//     } catch (err) {
//       console.error('Error fetching filtered PDFs:', err);
//       setError('Failed to load PDFs');
//     }
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) return setError('Please select a file');
//     if (file.type !== 'application/pdf') return setError('Please upload a PDF file');
//     if (!title || !subject || !classNumber) return setError('Please fill in all fields');

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);
//       formData.append('title', title);
//       formData.append('subject', subject);
//       formData.append('classNumber', classNumber);
//       formData.append('description', description);
//       formData.append('pinned', pinned);

//       await axios.post('http://localhost:5000/api/upload-pdf', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       // Reset form
//       setFile(null);
//       setTitle('');
//       setSubject('');
//       setClassNumber('');
//       setDescription('');
//       setPinned(false);
//       document.getElementById('file-upload').value = '';

//       setSuccess('PDF uploaded successfully!');
      
//       await fetchPdfs();
//       await fetchClasses();
//       await fetchSubjects();

//       if (galleryRef.current) {
//         galleryRef.current.scrollIntoView({ behavior: 'smooth' });
//       }
//     } catch (err) {
//       console.error('Error uploading PDF:', err);
//       setError('Failed to upload PDF');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTogglePin = async (pdfId) => {
//     try {
//       const response = await axios.patch(`http://localhost:5000/api/pdfs/${pdfId}/pin`);
//       setSuccess(response.data.message);
      
//       if (showPinnedOnly) {
//         fetchPinnedPdfs();
//       } else {
//         fetchFilteredPdfs();
//       }
//     } catch (err) {
//       console.error('Error toggling pin:', err);
//       setError('Failed to update pin status');
//     }
//   };

//   const handlePdfSelect = (pdf) => {
//     setSelectedPdf(pdf);
//     window.open(pdf.filepath, '_blank');
//   };

//   const downloadPDF = async (url, filename) => {
//     try {
//       setSuccess('Starting download...');
      
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to download PDF');
      
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
      
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.download = filename || 'study-note.pdf';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       window.URL.revokeObjectURL(blobUrl);
//       setSuccess('Download complete!');
//     } catch (err) {
//       console.error('Download error:', err);
//       setError('Download failed. Please try again.');
//     }
//   };

//   const getStats = () => {
//     const totalPdfs = pdfs.length;
//     const pinnedPdfs = pdfs.filter(pdf => pdf.pinned).length;
//     const subjectCounts = pdfs.reduce((acc, pdf) => {
//       acc[pdf.subject] = (acc[pdf.subject] || 0) + 1;
//       return acc;
//     }, {});
//     const classCounts = pdfs.reduce((acc, pdf) => {
//       acc[pdf.class] = (acc[pdf.class] || 0) + 1;
//       return acc;
//     }, {});

//     return { totalPdfs, pinnedPdfs, subjectCounts, classCounts };
//   };

//   const stats = getStats();

//   // Clear messages after 3 seconds
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   return (
//     <div className="app">
//       <header style={{ background: '#2c3e50', color: 'white', padding: '1rem', marginBottom: '2rem' }}>
//         <h1>📚 PDF Admin Panel</h1>
//         <p>Manage your PDF database with advanced controls</p>
//       </header>

//       {/* Statistics Dashboard */}
//       <div className="stats-section" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
//           <h2>📊 Dashboard Statistics</h2>
//           <button 
//             onClick={() => setShowStats(!showStats)}
//             style={{ padding: '0.5rem 1rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//           >
//             {showStats ? 'Hide Stats' : 'Show Stats'}
//           </button>
//         </div>
        
//         {showStats && (
//           <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
//             <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
//               <h3 style={{ margin: '0 0 0.5rem 0', color: '#27ae60' }}>Total PDFs</h3>
//               <p style={{ fontSize: '2rem', margin: '0', fontWeight: 'bold' }}>{stats.totalPdfs}</p>
//             </div>
//             <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
//               <h3 style={{ margin: '0 0 0.5rem 0', color: '#f39c12' }}>Pinned PDFs</h3>
//               <p style={{ fontSize: '2rem', margin: '0', fontWeight: 'bold' }}>{stats.pinnedPdfs}</p>
//             </div>
//             <div style={{ padding: '1rem', background: '#d4edda', borderRadius: '8px' }}>
//               <h3 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>Top Subjects</h3>
//               {Object.entries(stats.subjectCounts).slice(0, 3).map(([subject, count]) => (
//                 <p key={subject} style={{ margin: '0.25rem 0' }}>{subject}: {count}</p>
//               ))}
//             </div>
//             <div style={{ padding: '1rem', background: '#d1ecf1', borderRadius: '8px' }}>
//               <h3 style={{ margin: '0 0 0.5rem 0', color: '#0c5460' }}>Classes</h3>
//               {Object.entries(stats.classCounts).slice(0, 3).map(([cls, count]) => (
//                 <p key={cls} style={{ margin: '0.25rem 0' }}>{cls}: {count}</p>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Status Messages */}
//       {error && (
//         <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
//           ❌ {error}
//         </div>
//       )}
//       {success && (
//         <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
//           ✅ {success}
//         </div>
//       )}

//       <div className="upload-section" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
//         <h2>📤 Upload New PDF</h2>
//         <form onSubmit={handleUpload}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
//             <div className="form-group">
//               <label htmlFor="title">Title *:</label>
//               <input 
//                 type="text" 
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)} 
//                 required
//                 style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="subject">Subject *:</label>
//               <select 
//                 id="subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)} 
//                 required
//                 style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
//               >
//                 <option value="">Select Subject</option>
//                 {predefinedSubjects.map((subj) => (
//                   <option key={subj} value={subj}>{subj}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="class">Class *:</label>
//               <select 
//                 id="class"
//                 value={classNumber}
//                 onChange={(e) => setClassNumber(e.target.value)} 
//                 required
//                 style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
//               >
//                 <option value="">Select Class</option>
//                 {predefinedClasses.map((cls) => (
//                   <option key={cls} value={cls}>Class {cls}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="form-group" style={{ marginTop: '1rem' }}>
//             <label htmlFor="description">Description:</label>
//             <textarea 
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)} 
//               placeholder="Enter a detailed description of the PDF content..."
//               rows="3"
//               style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
//             />
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '1rem 0' }}>
//             <div className="form-group">
//               <label htmlFor="file-upload">PDF File *:</label>
//               <input 
//                 type="file" 
//                 id="file-upload"
//                 onChange={handleFileChange} 
//                 accept="application/pdf" 
//                 required
//                 style={{ margin: '0.5rem 0' }}
//               />
//             </div>
            
//             <div className="form-group">
//               <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
//                 <input 
//                   type="checkbox"
//                   checked={pinned}
//                   onChange={(e) => setPinned(e.target.checked)}
//                 />
//                 📌 Pin this PDF
//               </label>
//             </div>
//           </div>
          
//           <button 
//             type="submit" 
//             disabled={loading || !file}
//             style={{ 
//               padding: '0.75rem 2rem', 
//               background: loading ? '#95a5a6' : '#27ae60', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '4px', 
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontSize: '1rem'
//             }}
//           >
//             {loading ? '⏳ Uploading...' : '📤 Upload PDF'}
//           </button>
//         </form>
//       </div>

//       <div className="filter-section" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
//         <h2>🔍 Filter & Search PDFs</h2>
        
//         {/* NEW: Search Bar */}
//         <div className="search-bar" style={{ marginBottom: '1rem' }}>
//           <label htmlFor="search">🔎 Search PDFs:</label>
//           <input 
//             type="text" 
//             id="search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by title, subject, class, or description..."
//             style={{ 
//               width: '100%', 
//               padding: '0.75rem', 
//               margin: '0.5rem 0', 
//               border: '2px solid #3498db', 
//               borderRadius: '8px',
//               fontSize: '1rem'
//             }}
//           />
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
//           <div className="form-group">
//             <label htmlFor="filter-class">Class:</label>
//             <select 
//               id="filter-class" 
//               value={selectedClass} 
//               onChange={(e) => {
//                 setSelectedClass(e.target.value);
//                 setSelectedSubject('');
//               }}
//               style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
//             >
//               <option value="">All Classes</option>
//               {predefinedClasses.map((cls) => (
//                 <option key={cls} value={cls}>Class {cls}</option>
//               ))}
//               {classes.filter(cls => !predefinedClasses.includes(cls)).map((cls, index) => (
//                 <option key={`custom-${index}`} value={cls}>{cls}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="filter-subject">Subject:</label>
//             <select 
//               id="filter-subject" 
//               value={selectedSubject} 
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', border: '1px solid #ddd', borderRadius: '4px' }}
//             >
//               <option value="">All Subjects</option>
//               {predefinedSubjects.map((subj) => (
//                 <option key={subj} value={subj}>{subj}</option>
//               ))}
//               {subjects.filter(subj => !predefinedSubjects.includes(subj)).map((subj, index) => (
//                 <option key={`custom-${index}`} value={subj}>{subj}</option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
//               <input 
//                 type="checkbox"
//                 checked={showPinnedOnly}
//                 onChange={(e) => setShowPinnedOnly(e.target.checked)}
//               />
//               📌 Show Pinned Only
//             </label>
//           </div>

//           <button 
//             onClick={() => {
//               setSelectedClass('');
//               setSelectedSubject('');
//               setShowPinnedOnly(false);
//               setSearchQuery('');
//               fetchPdfs();
//             }}
//             style={{ 
//               padding: '0.5rem 1rem', 
//               background: '#e74c3c', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '4px', 
//               cursor: 'pointer' 
//             }}
//           >
//             🔄 Reset All
//           </button>
//         </div>
//       </div>

//       <div className="pdf-gallery" ref={galleryRef}>
//         <h2>📋 PDF Collection ({filteredPdfs.length} items)</h2>
//         {filteredPdfs.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
//             <p style={{ fontSize: '1.2rem' }}>📁 No PDFs found.</p>
//             {searchQuery ? (
//               <p>Try adjusting your search terms or filters.</p>
//             ) : (
//               <p>Upload your first PDF to get started!</p>
//             )}
//           </div>
//         ) : (
//           <div className="pdf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
//             {filteredPdfs.map((pdf) => (
//               <div key={pdf._id} className="pdf-card" style={{ 
//                 border: '1px solid #ddd', 
//                 borderRadius: '8px', 
//                 overflow: 'hidden',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                 transition: 'transform 0.2s',
//                 position: 'relative'
//               }}>
//                 {pdf.pinned && (
//                   <div style={{ 
//                     position: 'absolute', 
//                     top: '0.5rem', 
//                     right: '0.5rem', 
//                     background: '#f39c12', 
//                     color: 'white', 
//                     padding: '0.25rem 0.5rem', 
//                     borderRadius: '12px', 
//                     fontSize: '0.8rem',
//                     zIndex: 1
//                   }}>
//                     📌 Pinned
//                   </div>
//                 )}
                
//                 <div className="thumbnail" style={{ height: '200px', overflow: 'hidden' }}>
//                   <img 
//                     src={pdf.thumbnailUrl} 
//                     alt={`Thumbnail for ${pdf.title}`} 
//                     onClick={() => handlePdfSelect(pdf)}
//                     style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
//                   />
//                 </div>
                
//                 <div className="pdf-info" style={{ padding: '1rem' }}>
//                   <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{pdf.title}</h3>
                  
//                   {pdf.description && (
//                     <p style={{ 
//                       color: '#666', 
//                       fontSize: '0.9rem', 
//                       margin: '0.5rem 0',
//                       display: '-webkit-box',
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: 'vertical',
//                       overflow: 'hidden'
//                     }}>
//                       {pdf.description}
//                     </p>
//                   )}
                  
//                   <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
//                     <p style={{ margin: '0.25rem 0' }}>📚 {pdf.subject}</p>
//                     <p style={{ margin: '0.25rem 0' }}>🎓 Class: {pdf.class}</p>
//                     <p style={{ margin: '0.25rem 0' }}>📄 Pages: {pdf.pageCount}</p>
//                     <p style={{ margin: '0.25rem 0' }}>📅 {new Date(pdf.uploadDate).toLocaleDateString()}</p>
//                   </div>
                  
//                   <div className="pdf-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//                     <button 
//                       onClick={() => handlePdfSelect(pdf)} 
//                       style={{ 
//                         flex: 1,
//                         padding: '0.5rem', 
//                         background: '#3498db', 
//                         color: 'white', 
//                         border: 'none', 
//                         borderRadius: '4px', 
//                         cursor: 'pointer',
//                         fontSize: '0.9rem'
//                       }}
//                     >
//                       👁️ View
//                     </button>
//                     <button 
//                       onClick={() => downloadPDF(pdf.filepath, `${pdf.title}.pdf`)}
//                       style={{ 
//                         flex: 1,
//                         padding: '0.5rem', 
//                         background: '#27ae60', 
//                         color: 'white', 
//                         border: 'none', 
//                         borderRadius: '4px', 
//                         cursor: 'pointer',
//                         fontSize: '0.9rem'
//                       }}
//                     >
//                       📥 Download
//                     </button>
//                     <button 
//                       onClick={() => handleTogglePin(pdf._id)}
//                       style={{ 
//                         padding: '0.5rem', 
//                         background: pdf.pinned ? '#e74c3c' : '#f39c12', 
//                         color: 'white', 
//                         border: 'none', 
//                         borderRadius: '4px', 
//                         cursor: 'pointer',
//                         fontSize: '0.9rem'
//                       }}
//                       title={pdf.pinned ? 'Unpin PDF' : 'Pin PDF'}
//                     >
//                       {pdf.pinned ? '📌' : '📍'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { Upload, Search, Filter, Edit2, Trash2, Pin, Eye, Download, Plus, X, Save, FileText, Book, Users, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your backend URL

const PDFAdminPanel = () => {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    subject: '',
    classNumber: '',
    pinned: false,
    file: null
  });
  const [stats, setStats] = useState({
    total: 0,
    pinned: 0,
    subjects: 0,
    classes: 0
  });

  // Predefined classes and subjects
  const predefinedClasses = ['6', '7', '8', '9', '10', '11', '12'];
  const predefinedSubjects = ['Biology', 'Chemistry', 'Physics'];
  
  // Get unique classes and subjects for filters (combine predefined with existing)
  const existingClasses = [...new Set(pdfs.map(pdf => pdf.class))];
  const existingSubjects = [...new Set(pdfs.map(pdf => pdf.subject))];
  
  const uniqueClasses = [...new Set([...predefinedClasses, ...existingClasses])].sort((a, b) => {
    // Sort numerically for classes
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
  
  const uniqueSubjects = [...new Set([...predefinedSubjects, ...existingSubjects])].sort();

  // Fetch all PDFs
  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs`);
      if (response.ok) {
        const data = await response.json();
        setPdfs(data);
        setFilteredPdfs(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      alert('Error fetching PDFs');
    }
    setLoading(false);
  };

  // Calculate statistics
  const calculateStats = (pdfData) => {
    const uniqueSubjects = [...new Set(pdfData.map(pdf => pdf.subject))];
    const uniqueClasses = [...new Set(pdfData.map(pdf => pdf.class))];
    const pinnedCount = pdfData.filter(pdf => pdf.pinned).length;

    setStats({
      total: pdfData.length,
      pinned: pinnedCount,
      subjects: uniqueSubjects.length,
      classes: uniqueClasses.length
    });
  };

  // Filter PDFs based on search and filters
  useEffect(() => {
    let filtered = pdfs;

    if (searchTerm) {
      filtered = filtered.filter(pdf => 
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(pdf => pdf.class === selectedClass);
    }

    if (selectedSubject) {
      filtered = filtered.filter(pdf => pdf.subject === selectedSubject);
    }

    setFilteredPdfs(filtered);
  }, [searchTerm, selectedClass, selectedSubject, pdfs]);

  // Upload PDF
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title || !uploadData.subject || !uploadData.classNumber) {
      alert('Please fill all required fields and select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('subject', uploadData.subject);
    formData.append('classNumber', uploadData.classNumber);
    formData.append('pinned', uploadData.pinned);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('PDF uploaded successfully!');
        setShowUploadModal(false);
        setUploadData({
          title: '',
          description: '',
          subject: '',
          classNumber: '',
          pinned: false,
          file: null
        });
        fetchPdfs();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
    setLoading(false);
  };

  // Toggle pin status
  const togglePin = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/${id}/pin`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchPdfs();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  // Delete PDF
  const deletePdf = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PDF?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('PDF deleted successfully');
        fetchPdfs();
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert('Error deleting PDF');
    }
  };

  // Edit PDF
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingPdf) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/${editingPdf._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingPdf.title,
          description: editingPdf.description,
          subject: editingPdf.subject,
          class: editingPdf.class,
          pinned: editingPdf.pinned
        }),
      });

      if (response.ok) {
        alert('PDF updated successfully');
        setShowEditModal(false);
        setEditingPdf(null);
        fetchPdfs();
      }
    } catch (error) {
      console.error('Error updating PDF:', error);
      alert('Error updating PDF');
    }
  };

  // Open edit modal
  const openEditModal = (pdf) => {
    setEditingPdf({ ...pdf });
    setShowEditModal(true);
  };

  // View PDF
  const viewPdf = (pdf) => {
    window.open(pdf.pdfUrl, '_blank');
  };

  // Download PDF
  const downloadPdf = async (pdf) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pdf/${pdf._id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pdf.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
      window.open(pdf.pdfUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Admin Panel</h1>
              <p className="text-gray-600">Manage your PDF documents efficiently</p>
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total PDFs</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Pin className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pinned</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pinned}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Book className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{stats.subjects}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.classes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search PDFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PDF List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPdfs.map((pdf) => (
                    <tr key={pdf._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {pdf.thumbnailUrl ? (
                              <img src={pdf.thumbnailUrl} alt="Thumbnail" className="h-12 w-12 rounded-lg object-cover" />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FileText className="text-gray-400" size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{pdf.title}</div>
                            <div className="text-sm text-gray-500">{pdf.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {pdf.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Class {pdf.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pdf.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pdf.pinned ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pinned
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewPdf(pdf)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View PDF"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => downloadPdf(pdf)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => togglePin(pdf._id)}
                            className={`p-1 ${pdf.pinned ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-gray-600'}`}
                            title={pdf.pinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(pdf)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Edit PDF"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deletePdf(pdf._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete PDF"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPdfs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No PDFs found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload PDF</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    value={uploadData.subject}
                    onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Subject</option>
                    {predefinedSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select
                    value={uploadData.classNumber}
                    onChange={(e) => setUploadData({...uploadData, classNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Class</option>
                    {predefinedClasses.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF File *</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={uploadData.pinned}
                    onChange={(e) => setUploadData({...uploadData, pinned: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pinned" className="ml-2 block text-sm text-gray-900">
                    Pin this PDF
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit PDF</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingPdf.title}
                    onChange={(e) => setEditingPdf({...editingPdf, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingPdf.description}
                    onChange={(e) => setEditingPdf({...editingPdf, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={editingPdf.subject}
                    onChange={(e) => setEditingPdf({...editingPdf, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    {predefinedSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={editingPdf.class}
                    onChange={(e) => setEditingPdf({...editingPdf, class: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Class</option>
                    {predefinedClasses.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editPinned"
                    checked={editingPdf.pinned}
                    onChange={(e) => setEditingPdf({...editingPdf, pinned: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editPinned" className="ml-2 block text-sm text-gray-900">
                    Pin this PDF
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFAdminPanel;