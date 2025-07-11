import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Pin, Download } from 'lucide-react';

// Import components
import NoteCard from '../components/notes/NoteCard';
import FilterDropdown from '../components/notes/FilterDropdown';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classes = [6, 7, 8, 9, 10, 11, 12];
  const subjects = ['physics', 'chemistry', 'biology'];

  // Fetch notes from backend API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // const response = await fetch('http://localhost:5000/api/pdfs');
        const response = await fetch('https://pdfman.onrender.com/api/pdfs');

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        console.log('Fetched notes:', data); // Debug log
        
        // Debug: Show unique class values in your data
        const uniqueClasses = [...new Set(data.map(note => note.class))];
        console.log('Unique class values found:', uniqueClasses);
        console.log('Unique class types:', uniqueClasses.map(c => typeof c));
        
        setNotes(data);
        setFilteredNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Fixed filtering logic
  useEffect(() => {
    let result = [...notes]; // Create a copy to avoid mutation

    console.log('Filtering with:', { activeClass, activeSubject, searchQuery }); // Debug log

    // Filter by class - improved comparison logic
    if (activeClass !== null && activeClass !== '') {
      result = result.filter(note => {
        console.log('Note class:', note.class, 'Type:', typeof note.class);
        console.log('Active class:', activeClass, 'Type:', typeof activeClass);
        
        // Convert both to strings for comparison to handle edge cases
        const noteClassStr = String(note.class).trim();
        const activeClassStr = String(activeClass).trim();
        
        // Also try numeric comparison
        const noteClassNum = parseInt(noteClassStr);
        const activeClassNum = parseInt(activeClassStr);
        
        const stringMatch = noteClassStr === activeClassStr;
        const numericMatch = !isNaN(noteClassNum) && !isNaN(activeClassNum) && noteClassNum === activeClassNum;
        
        console.log('String match:', stringMatch, 'Numeric match:', numericMatch);
        
        return stringMatch || numericMatch;
      });
      console.log('After class filter:', result.length);
    }

    // Filter by subject - ensure proper case handling
    if (activeSubject !== null && activeSubject !== '') {
      result = result.filter(note => {
        const noteSubject = note.subject?.toLowerCase().trim();
        const filterSubject = activeSubject.toLowerCase().trim();
        return noteSubject === filterSubject;
      });
      console.log('After subject filter:', result.length);
    }

    // Filter by search query - improved search logic
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(note => {
        const title = note.title?.toLowerCase() || '';
        const description = note.description?.toLowerCase() || '';
        const subject = note.subject?.toLowerCase() || '';
        
        return title.includes(query) || 
               description.includes(query) || 
               subject.includes(query);
      });
      console.log('After search filter:', result.length);
    }

    console.log('Final filtered result:', result.length);
    setFilteredNotes(result);
  }, [activeClass, activeSubject, searchQuery, notes]);

  // Toggle pin status - fixed API endpoint
  const togglePin = async (id) => {
    try {
      const updatedNotes = notes.map(note => 
        note.id === id ? { ...note, pinned: !note.pinned } : note
      );
      setNotes(updatedNotes);
      
      // Update on server - use the correct endpoint
      const noteToUpdate = notes.find(note => note.id === id);
      // const response = await fetch(`http://localhost:5000/api/pdfs/${id}`, {
      const response = await fetch(`https://pdfman.onrender.com/api/pdfs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pinned: !noteToUpdate.pinned }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update pin status');
      }
    } catch (err) {
      console.error('Error updating pin status:', err);
      // Revert the optimistic update on error
      const revertedNotes = notes.map(note => 
        note.id === id ? { ...note, pinned: !note.pinned } : note
      );
      setNotes(revertedNotes);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveClass(null);
    setActiveSubject(null);
    setSearchQuery('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 container-custom flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 container-custom flex flex-col items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error loading notes</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Study Notes
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-3xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comprehensive notes for Physics, Chemistry, and Biology for classes 6 to 12. 
            Filter by class and subject to find exactly what you need.
          </motion.p>
        </div>

        {/* Active Filters Display */}
        {(activeClass || activeSubject || searchQuery) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeClass && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Class {activeClass}
                <button
                  onClick={() => setActiveClass(null)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {activeSubject && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                {activeSubject.charAt(0).toUpperCase() + activeSubject.slice(1)}
                <button
                  onClick={() => setActiveSubject(null)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn-outline md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div 
              className="bg-white p-4 rounded-md shadow-md mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FilterDropdown 
                  label="Class"
                  options={classes.map(c => ({ value: c.toString(), label: `Class ${c}` }))}
                  value={activeClass?.toString() || ''}
                  onChange={(value) => setActiveClass(value ? parseInt(value) : null)}
                />
                <FilterDropdown 
                  label="Subject"
                  options={subjects.map(s => ({ 
                    value: s, 
                    label: s.charAt(0).toUpperCase() + s.slice(1)
                  }))}
                  value={activeSubject || ''}
                  onChange={(value) => setActiveSubject(value || null)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'} Found
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onTogglePin={() => togglePin(note.id)} 
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Notes Found</h3>
            <p className="text-gray-500 mb-4">
              {notes.length === 0 
                ? "We couldn't find any notes in our database." 
                : "We couldn't find any notes matching your filters. Try adjusting your search or filters."}
            </p>
            <button
              className="btn-primary"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotesPage;