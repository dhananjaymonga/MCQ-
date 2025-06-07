import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Video as VideoIcon } from 'lucide-react';

import VideoCard from '../components/videos/VideoCard';
import FilterDropdown from '../components/notes/FilterDropdown';
import { mockVideos } from '../data/mockData';

const VideoPage = () => {
  const [videos, setVideos] = useState(mockVideos);
  const [filteredVideos, setFilteredVideos] = useState(mockVideos);
  const [activeClass, setActiveClass] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const classes = [6, 7, 8, 9, 10, 11, 12];
  const subjects = ['physics', 'chemistry', 'biology'];

  useEffect(() => {
    let result = videos;

    // Filter by class
    if (activeClass) {
      result = result.filter(video => video.class === activeClass);
    }

    // Filter by subject
    if (activeSubject) {
      result = result.filter(video => video.subject.toLowerCase() === activeSubject);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.description.toLowerCase().includes(query)
      );
    }

    setFilteredVideos(result);
  }, [activeClass, activeSubject, searchQuery, videos]);

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
            Video Lessons
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-3xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Watch our comprehensive video lessons for Physics, Chemistry, and Biology. 
            Filter by class and subject to find the perfect video for your studies.
          </motion.p>
        </div>

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
                placeholder="Search videos..."
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
                  onChange={(value) => setActiveSubject(value)}
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

        {/* Videos List */}
        {filteredVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVideos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video}
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <VideoIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any videos matching your filters. Try adjusting your search or filters.
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

export default VideoPage;