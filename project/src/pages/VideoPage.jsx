import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Video, Play, Clock, Eye } from 'lucide-react';

// YouTube API configuration
const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// YouTube Video Card Component
const YouTubeVideoCard = ({ video }) => {
  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatPublishedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const openVideo = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={openVideo}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            <Clock className="h-3 w-3 inline mr-1" />
            {formatDuration(video.duration)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {formatViewCount(video.viewCount)}
          </div>
          <span>{formatPublishedDate(video.publishedAt)}</span>
        </div>
        
        {video.tags && (
          <div className="mt-3 flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All {label}s</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeClass, setActiveClass] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const classes = [6, 7, 8, 9, 10, 11, 12];
  const subjects = ['physics', 'chemistry', 'biology', 'mathematics', 'science'];

  // Fetch videos from YouTube
  const fetchYouTubeVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the playlist items
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
      );
      
      if (!playlistResponse.ok) {
        throw new Error('Failed to fetch playlist items');
      }
      
      const playlistData = await playlistResponse.json();
      
      if (!playlistData.items || playlistData.items.length === 0) {
        setVideos([]);
        setFilteredVideos([]);
        return;
      }

      // Get video IDs for detailed information
      const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
      
      // Fetch detailed video information
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
      );
      
      if (!videosResponse.ok) {
        throw new Error('Failed to fetch video details');
      }
      
      const videosData = await videosResponse.json();
      
      // Process and format video data
      const processedVideos = videosData.items.map(video => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description || 'No description available',
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: parseInt(video.statistics.viewCount || 0),
        likeCount: parseInt(video.statistics.likeCount || 0),
        tags: video.snippet.tags || [],
        // Extract class and subject from title/description/tags
        class: extractClass(video.snippet.title, video.snippet.description, video.snippet.tags),
        subject: extractSubject(video.snippet.title, video.snippet.description, video.snippet.tags)
      }));

      setVideos(processedVideos);
      setFilteredVideos(processedVideos);
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract class from video metadata
  const extractClass = (title, description, tags) => {
    const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
    for (let i = 6; i <= 12; i++) {
      if (text.includes(`class ${i}`) || text.includes(`grade ${i}`) || text.includes(`${i}th`)) {
        return i;
      }
    }
    return null;
  };

  // Helper function to extract subject from video metadata
  const extractSubject = (title, description, tags) => {
    const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
    const subjectKeywords = {
      physics: ['physics', 'motion', 'force', 'energy', 'wave', 'optics', 'thermodynamics'],
      chemistry: ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'compound', 'element'],
      biology: ['biology', 'cell', 'organism', 'genetics', 'evolution', 'ecology', 'anatomy'],
      mathematics: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics'],
      science: ['science', 'experiment', 'hypothesis', 'theory', 'research']
    };

    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return subject;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  useEffect(() => {
    let result = videos;

    // Filter by class
    if (activeClass) {
      result = result.filter(video => video.class === activeClass);
    }

    // Filter by subject
    if (activeSubject) {
      result = result.filter(video => video.subject === activeSubject);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.description.toLowerCase().includes(query) ||
        video.tags.some(tag => tag.toLowerCase().includes(query))
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

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="h-16 w-16 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Videos</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={fetchYouTubeVideos}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pt-24 pb-16 min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
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
            Watch our comprehensive video lessons for Physics, Chemistry, Biology, and more. 
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center md:w-auto"
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
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading videos...</span>
          </div>
        )}

        {/* Videos List */}
        {!loading && filteredVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVideos.map((video) => (
                <YouTubeVideoCard 
                  key={video.id} 
                  video={video}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* No Videos Found */}
        {!loading && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any videos matching your filters. Try adjusting your search or filters.
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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