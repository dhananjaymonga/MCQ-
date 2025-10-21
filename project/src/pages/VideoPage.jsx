// // import React, { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { Search, Filter, Video, Play, Clock, Eye } from 'lucide-react';

// // // YouTube API configuration
// // const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
// // const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
// // const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// // // YouTube Video Card Component
// // const YouTubeVideoCard = ({ video }) => {
// //   const formatDuration = (duration) => {
// //     const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
// //     const hours = (match[1] || '').replace('H', '');
// //     const minutes = (match[2] || '').replace('M', '');
// //     const seconds = (match[3] || '').replace('S', '');
    
// //     if (hours) {
// //       return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
// //     }
// //     return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
// //   };

// //   const formatViewCount = (count) => {
// //     if (count >= 1000000) {
// //       return `${(count / 1000000).toFixed(1)}M views`;
// //     } else if (count >= 1000) {
// //       return `${(count / 1000).toFixed(1)}K views`;
// //     }
// //     return `${count} views`;
// //   };

// //   const formatPublishedDate = (dateString) => {
// //     const date = new Date(dateString);
// //     const now = new Date();
// //     const diffTime = Math.abs(now - date);
// //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
// //     if (diffDays === 1) return '1 day ago';
// //     if (diffDays < 7) return `${diffDays} days ago`;
// //     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
// //     if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
// //     return `${Math.floor(diffDays / 365)} years ago`;
// //   };

// //   const openVideo = () => {
// //     window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
// //   };

// //   return (
// //     <motion.div
// //       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       whileHover={{ y: -5 }}
// //       onClick={openVideo}
// //     >
// //       <div className="relative">
// //         <img
// //           src={video.thumbnail}
// //           alt={video.title}
// //           className="w-full h-48 object-cover"
// //           loading="lazy"
// //         />
// //         <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
// //           <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
// //         </div>
// //         {video.duration && (
// //           <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
// //             <Clock className="h-3 w-3 inline mr-1" />
// //             {formatDuration(video.duration)}
// //           </div>
// //         )}
// //       </div>
      
// //       <div className="p-4">
// //         <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
// //           {video.title}
// //         </h3>
// //         <p className="text-gray-600 text-sm mb-3 line-clamp-3">
// //           {video.description}
// //         </p>
        
// //         <div className="flex items-center justify-between text-xs text-gray-500">
// //           <div className="flex items-center">
// //             <Eye className="h-3 w-3 mr-1" />
// //             {formatViewCount(video.viewCount)}
// //           </div>
// //           <span>{formatPublishedDate(video.publishedAt)}</span>
// //         </div>
        
// //         {video.tags && (
// //           <div className="mt-3 flex flex-wrap gap-1">
// //             {video.tags.slice(0, 3).map((tag, index) => (
// //               <span
// //                 key={index}
// //                 className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
// //               >
// //                 {tag}
// //               </span>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </motion.div>
// //   );
// // };

// // // Filter Dropdown Component
// // const FilterDropdown = ({ label, options, value, onChange }) => (
// //   <div>
// //     <label className="block text-sm font-medium text-gray-700 mb-2">
// //       {label}
// //     </label>
// //     <select
// //       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //       value={value}
// //       onChange={(e) => onChange(e.target.value)}
// //     >
// //       <option value="">All {label}s</option>
// //       {options.map((option) => (
// //         <option key={option.value} value={option.value}>
// //           {option.label}
// //         </option>
// //       ))}
// //     </select>
// //   </div>
// // );

// // const VideoPage = () => {
// //   const [videos, setVideos] = useState([]);
// //   const [filteredVideos, setFilteredVideos] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [activeClass, setActiveClass] = useState(null);
// //   const [activeSubject, setActiveSubject] = useState(null);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [showFilters, setShowFilters] = useState(false);

// //   const classes = [6, 7, 8, 9, 10, 11, 12];
// //   const subjects = ['physics', 'chemistry', 'biology', 'mathematics', 'science'];

// //   // Fetch videos from YouTube
// //   const fetchYouTubeVideos = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       // First, get the playlist items
// //       const playlistResponse = await fetch(
// //         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
// //       );
      
// //       if (!playlistResponse.ok) {
// //         throw new Error('Failed to fetch playlist items');
// //       }
      
// //       const playlistData = await playlistResponse.json();
      
// //       if (!playlistData.items || playlistData.items.length === 0) {
// //         setVideos([]);
// //         setFilteredVideos([]);
// //         return;
// //       }

// //       // Get video IDs for detailed information
// //       const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
      
// //       // Fetch detailed video information
// //       const videosResponse = await fetch(
// //         `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
// //       );
      
// //       if (!videosResponse.ok) {
// //         throw new Error('Failed to fetch video details');
// //       }
      
// //       const videosData = await videosResponse.json();
      
// //       // Process and format video data
// //       const processedVideos = videosData.items.map(video => ({
// //         id: video.id,
// //         title: video.snippet.title,
// //         description: video.snippet.description || 'No description available',
// //         thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
// //         publishedAt: video.snippet.publishedAt,
// //         duration: video.contentDetails.duration,
// //         viewCount: parseInt(video.statistics.viewCount || 0),
// //         likeCount: parseInt(video.statistics.likeCount || 0),
// //         tags: video.snippet.tags || [],
// //         // Extract class and subject from title/description/tags
// //         class: extractClass(video.snippet.title, video.snippet.description, video.snippet.tags),
// //         subject: extractSubject(video.snippet.title, video.snippet.description, video.snippet.tags)
// //       }));

// //       setVideos(processedVideos);
// //       setFilteredVideos(processedVideos);
// //     } catch (err) {
// //       console.error('Error fetching YouTube videos:', err);
// //       setError('Failed to load videos. Please try again later.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Helper function to extract class from video metadata
// //   const extractClass = (title, description, tags) => {
// //     const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
// //     for (let i = 6; i <= 12; i++) {
// //       if (text.includes(`class ${i}`) || text.includes(`grade ${i}`) || text.includes(`${i}th`)) {
// //         return i;
// //       }
// //     }
// //     return null;
// //   };

// //   // Helper function to extract subject from video metadata
// //   const extractSubject = (title, description, tags) => {
// //     const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
// //     const subjectKeywords = {
// //       physics: ['physics', 'motion', 'force', 'energy', 'wave', 'optics', 'thermodynamics'],
// //       chemistry: ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'compound', 'element'],
// //       biology: ['biology', 'cell', 'organism', 'genetics', 'evolution', 'ecology', 'anatomy'],
// //       mathematics: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics'],
// //       science: ['science', 'experiment', 'hypothesis', 'theory', 'research']
// //     };

// //     for (const [subject, keywords] of Object.entries(subjectKeywords)) {
// //       if (keywords.some(keyword => text.includes(keyword))) {
// //         return subject;
// //       }
// //     }
// //     return null;
// //   };

// //   useEffect(() => {
// //     fetchYouTubeVideos();
// //   }, []);

// //   useEffect(() => {
// //     let result = videos;

// //     // Filter by class
// //     if (activeClass) {
// //       result = result.filter(video => video.class === activeClass);
// //     }

// //     // Filter by subject
// //     if (activeSubject) {
// //       result = result.filter(video => video.subject === activeSubject);
// //     }

// //     // Filter by search query
// //     if (searchQuery) {
// //       const query = searchQuery.toLowerCase();
// //       result = result.filter(video => 
// //         video.title.toLowerCase().includes(query) || 
// //         video.description.toLowerCase().includes(query) ||
// //         video.tags.some(tag => tag.toLowerCase().includes(query))
// //       );
// //     }

// //     setFilteredVideos(result);
// //   }, [activeClass, activeSubject, searchQuery, videos]);

// //   // Reset all filters
// //   const resetFilters = () => {
// //     setActiveClass(null);
// //     setActiveSubject(null);
// //     setSearchQuery('');
// //   };

// //   // Animation variants
// //   const containerVariants = {
// //     hidden: { opacity: 0 },
// //     visible: {
// //       opacity: 1,
// //       transition: {
// //         staggerChildren: 0.1
// //       }
// //     }
// //   };

// //   if (error) {
// //     return (
// //       <div className="pt-24 pb-16">
// //         <div className="container mx-auto px-4">
// //           <div className="flex flex-col items-center justify-center py-12 text-center">
// //             <Video className="h-16 w-16 text-red-400 mb-4" />
// //             <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Videos</h3>
// //             <p className="text-gray-500 mb-4">{error}</p>
// //             <button
// //               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //               onClick={fetchYouTubeVideos}
// //             >
// //               Try Again
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <motion.div
// //       className="pt-24 pb-16 min-h-screen bg-gray-50"
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       exit={{ opacity: 0 }}
// //     >
// //       <div className="container mx-auto px-4">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <motion.h1 
// //             className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
// //             initial={{ opacity: 0, y: -20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5 }}
// //           >
// //             Video Lessons
// //           </motion.h1>
// //           <motion.p
// //             className="text-gray-600 max-w-3xl"
// //             initial={{ opacity: 0, y: -20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5, delay: 0.2 }}
// //           >
// //             Watch our comprehensive video lessons for Physics, Chemistry, Biology, and more. 
// //             Filter by class and subject to find the perfect video for your studies.
// //           </motion.p>
// //         </div>

// //         {/* Search and Filters */}
// //         <div className="mb-8">
// //           <div className="flex flex-col md:flex-row gap-4 mb-4">
// //             <div className="relative flex-grow">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <Search className="h-5 w-5 text-gray-400" />
// //               </div>
// //               <input
// //                 type="text"
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 placeholder="Search videos..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //               />
// //             </div>
// //             <button
// //               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center md:w-auto"
// //               onClick={() => setShowFilters(!showFilters)}
// //             >
// //               <Filter className="h-5 w-5 mr-2" />
// //               Filters
// //             </button>
// //           </div>

// //           {/* Filters */}
// //           {showFilters && (
// //             <motion.div 
// //               className="bg-white p-4 rounded-md shadow-md mb-4"
// //               initial={{ opacity: 0, height: 0 }}
// //               animate={{ opacity: 1, height: 'auto' }}
// //               exit={{ opacity: 0, height: 0 }}
// //               transition={{ duration: 0.3 }}
// //             >
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <FilterDropdown 
// //                   label="Class"
// //                   options={classes.map(c => ({ value: c.toString(), label: `Class ${c}` }))}
// //                   value={activeClass?.toString() || ''}
// //                   onChange={(value) => setActiveClass(value ? parseInt(value) : null)}
// //                 />
// //                 <FilterDropdown 
// //                   label="Subject"
// //                   options={subjects.map(s => ({ 
// //                     value: s, 
// //                     label: s.charAt(0).toUpperCase() + s.slice(1)
// //                   }))}
// //                   value={activeSubject || ''}
// //                   onChange={(value) => setActiveSubject(value)}
// //                 />
// //               </div>
// //               <div className="mt-4 flex justify-end">
// //                 <button
// //                   className="text-blue-600 hover:text-blue-700 font-medium"
// //                   onClick={resetFilters}
// //                 >
// //                   Reset Filters
// //                 </button>
// //               </div>
// //             </motion.div>
// //           )}
// //         </div>

// //         {/* Loading State */}
// //         {loading && (
// //           <div className="flex justify-center items-center py-12">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //             <span className="ml-4 text-gray-600">Loading videos...</span>
// //           </div>
// //         )}

// //         {/* Videos List */}
// //         {!loading && filteredVideos.length > 0 && (
// //           <div className="mb-8">
// //             <h2 className="text-xl font-semibold mb-4 text-gray-800">
// //               {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
// //             </h2>
// //             <motion.div 
// //               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
// //               variants={containerVariants}
// //               initial="hidden"
// //               animate="visible"
// //             >
// //               {filteredVideos.map((video) => (
// //                 <YouTubeVideoCard 
// //                   key={video.id} 
// //                   video={video}
// //                 />
// //               ))}
// //             </motion.div>
// //           </div>
// //         )}

// //         {/* No Videos Found */}
// //         {!loading && filteredVideos.length === 0 && (
// //           <div className="flex flex-col items-center justify-center py-12 text-center">
// //             <Video className="h-16 w-16 text-gray-400 mb-4" />
// //             <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
// //             <p className="text-gray-500 mb-4">
// //               We couldn't find any videos matching your filters. Try adjusting your search or filters.
// //             </p>
// //             <button
// //               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //               onClick={resetFilters}
// //             >
// //               Reset Filters
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </motion.div>
// //   );
// // };

// // export default VideoPage;
// // // import React, { useState, useEffect } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { Search, Filter, Video, Play, Clock, Eye, X, ThumbsUp, Share2, Download, MoreHorizontal, ArrowLeft } from 'lucide-react';

// // // // YouTube API configuration
// // // const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
// // // const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
// // // const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// // // // YouTube Video Player Component
// // // const VideoPlayer = ({ video, onClose, onVideoSelect, allVideos }) => {
// // //   const [showDescription, setShowDescription] = useState(false);
  
// // //   const formatViewCount = (count) => {
// // //     if (count >= 1000000) {
// // //       return `${(count / 1000000).toFixed(1)}M views`;
// // //     } else if (count >= 1000) {
// // //       return `${(count / 1000).toFixed(1)}K views`;
// // //     }
// // //     return `${count} views`;
// // //   };

// // //   const formatPublishedDate = (dateString) => {
// // //     const date = new Date(dateString);
// // //     return date.toLocaleDateString('en-US', { 
// // //       year: 'numeric', 
// // //       month: 'short', 
// // //       day: 'numeric' 
// // //     });
// // //   };

// // //   const getRelatedVideos = () => {
// // //     return allVideos
// // //       .filter(v => v.id !== video.id)
// // //       .filter(v => v.subject === video.subject || v.class === video.class)
// // //       .slice(0, 10);
// // //   };

// // //   return (
// // //     <motion.div
// // //       className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto"
// // //       initial={{ opacity: 0 }}
// // //       animate={{ opacity: 1 }}
// // //       exit={{ opacity: 0 }}
// // //     >
// // //       <div className="min-h-screen bg-black text-white">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between p-4 bg-black bg-opacity-90">
// // //           <button
// // //             onClick={onClose}
// // //             className="flex items-center text-white hover:text-gray-300 transition-colors"
// // //           >
// // //             <ArrowLeft className="h-6 w-6 mr-2" />
// // //             Back to Videos
// // //           </button>
// // //           <button
// // //             onClick={onClose}
// // //             className="text-white hover:text-gray-300 transition-colors"
// // //           >
// // //             <X className="h-6 w-6" />
// // //           </button>
// // //         </div>

// // //         <div className="max-w-7xl mx-auto px-4 pb-8">
// // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //             {/* Main Video Section */}
// // //             <div className="lg:col-span-2">
// // //               {/* Video Player */}
// // //               <div className="relative bg-black rounded-lg overflow-hidden mb-4">
// // //                 <div className="aspect-video">
// // //                   <iframe
// // //                     src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
// // //                     title={video.title}
// // //                     className="w-full h-full"
// // //                     frameBorder="0"
// // //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// // //                     allowFullScreen
// // //                   ></iframe>
// // //                 </div>
// // //               </div>

// // //               {/* Video Info */}
// // //               <div className="mb-6">
// // //                 <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">
// // //                   {video.title}
// // //                 </h1>
                
// // //                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
// // //                   <div className="flex items-center text-gray-300 text-sm mb-2 md:mb-0">
// // //                     <Eye className="h-4 w-4 mr-2" />
// // //                     <span className="mr-4">{formatViewCount(video.viewCount)}</span>
// // //                     <span>{formatPublishedDate(video.publishedAt)}</span>
// // //                   </div>
                  
// // //                   <div className="flex items-center space-x-4">
// // //                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// // //                       <ThumbsUp className="h-4 w-4" />
// // //                       <span className="text-sm">{video.likeCount ? `${video.likeCount}` : 'Like'}</span>
// // //                     </button>
// // //                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// // //                       <Share2 className="h-4 w-4" />
// // //                       <span className="text-sm">Share</span>
// // //                     </button>
// // //                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// // //                       <Download className="h-4 w-4" />
// // //                       <span className="text-sm">Save</span>
// // //                     </button>
// // //                     <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// // //                       <MoreHorizontal className="h-4 w-4" />
// // //                     </button>
// // //                   </div>
// // //                 </div>

// // //                 {/* Tags */}
// // //                 {video.tags && video.tags.length > 0 && (
// // //                   <div className="flex flex-wrap gap-2 mb-4">
// // //                     {video.tags.slice(0, 5).map((tag, index) => (
// // //                       <span
// // //                         key={index}
// // //                         className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
// // //                       >
// // //                         {tag}
// // //                       </span>
// // //                     ))}
// // //                   </div>
// // //                 )}

// // //                 {/* Description */}
// // //                 <div className="bg-gray-900 rounded-lg p-4">
// // //                   <div className="flex items-center justify-between mb-3">
// // //                     <h3 className="font-semibold text-white">Description</h3>
// // //                     <button
// // //                       onClick={() => setShowDescription(!showDescription)}
// // //                       className="text-blue-400 hover:text-blue-300 text-sm"
// // //                     >
// // //                       {showDescription ? 'Show less' : 'Show more'}
// // //                     </button>
// // //                   </div>
// // //                   <p className={`text-gray-300 text-sm leading-relaxed ${
// // //                     showDescription ? '' : 'line-clamp-3'
// // //                   }`}>
// // //                     {video.description || 'No description available'}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Sidebar - Related Videos */}
// // //             <div className="lg:col-span-1">
// // //               <h3 className="text-lg font-semibold mb-4 text-white">Related Videos</h3>
// // //               <div className="space-y-3">
// // //                 {getRelatedVideos().map((relatedVideo) => (
// // //                   <div
// // //                     key={relatedVideo.id}
// // //                     className="flex cursor-pointer hover:bg-gray-900 p-2 rounded-lg transition-colors"
// // //                     onClick={() => onVideoSelect(relatedVideo)}
// // //                   >
// // //                     <div className="relative flex-shrink-0 mr-3">
// // //                       <img
// // //                         src={relatedVideo.thumbnail}
// // //                         alt={relatedVideo.title}
// // //                         className="w-32 h-20 object-cover rounded"
// // //                       />
// // //                       <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded">
// // //                         <Play className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
// // //                       </div>
// // //                     </div>
// // //                     <div className="flex-1 min-w-0">
// // //                       <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
// // //                         {relatedVideo.title}
// // //                       </h4>
// // //                       <p className="text-xs text-gray-400 mb-1">
// // //                         {formatViewCount(relatedVideo.viewCount)}
// // //                       </p>
// // //                       <p className="text-xs text-gray-500">
// // //                         {formatPublishedDate(relatedVideo.publishedAt)}
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </motion.div>
// // //   );
// // // };

// // // // YouTube Video Card Component
// // // const YouTubeVideoCard = ({ video, onVideoSelect }) => {
// // //   const formatDuration = (duration) => {
// // //     const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
// // //     const hours = (match[1] || '').replace('H', '');
// // //     const minutes = (match[2] || '').replace('M', '');
// // //     const seconds = (match[3] || '').replace('S', '');
    
// // //     if (hours) {
// // //       return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
// // //     }
// // //     return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
// // //   };

// // //   const formatViewCount = (count) => {
// // //     if (count >= 1000000) {
// // //       return `${(count / 1000000).toFixed(1)}M views`;
// // //     } else if (count >= 1000) {
// // //       return `${(count / 1000).toFixed(1)}K views`;
// // //     }
// // //     return `${count} views`;
// // //   };

// // //   const formatPublishedDate = (dateString) => {
// // //     const date = new Date(dateString);
// // //     const now = new Date();
// // //     const diffTime = Math.abs(now - date);
// // //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
// // //     if (diffDays === 1) return '1 day ago';
// // //     if (diffDays < 7) return `${diffDays} days ago`;
// // //     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
// // //     if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
// // //     return `${Math.floor(diffDays / 365)} years ago`;
// // //   };

// // //   return (
// // //     <motion.div
// // //       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
// // //       initial={{ opacity: 0, y: 20 }}
// // //       animate={{ opacity: 1, y: 0 }}
// // //       whileHover={{ y: -5 }}
// // //       onClick={() => onVideoSelect(video)}
// // //     >
// // //       <div className="relative">
// // //         <img
// // //           src={video.thumbnail}
// // //           alt={video.title}
// // //           className="w-full h-48 object-cover"
// // //           loading="lazy"
// // //         />
// // //         <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
// // //           <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
// // //         </div>
// // //         {video.duration && (
// // //           <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
// // //             <Clock className="h-3 w-3 inline mr-1" />
// // //             {formatDuration(video.duration)}
// // //           </div>
// // //         )}
// // //       </div>
      
// // //       <div className="p-4">
// // //         <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
// // //           {video.title}
// // //         </h3>
// // //         <p className="text-gray-600 text-sm mb-3 line-clamp-3">
// // //           {video.description}
// // //         </p>
        
// // //         <div className="flex items-center justify-between text-xs text-gray-500">
// // //           <div className="flex items-center">
// // //             <Eye className="h-3 w-3 mr-1" />
// // //             {formatViewCount(video.viewCount)}
// // //           </div>
// // //           <span>{formatPublishedDate(video.publishedAt)}</span>
// // //         </div>
        
// // //         {video.tags && (
// // //           <div className="mt-3 flex flex-wrap gap-1">
// // //             {video.tags.slice(0, 3).map((tag, index) => (
// // //               <span
// // //                 key={index}
// // //                 className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
// // //               >
// // //                 {tag}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </motion.div>
// // //   );
// // // };

// // // // Filter Dropdown Component
// // // const FilterDropdown = ({ label, options, value, onChange }) => (
// // //   <div>
// // //     <label className="block text-sm font-medium text-gray-700 mb-2">
// // //       {label}
// // //     </label>
// // //     <select
// // //       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //       value={value}
// // //       onChange={(e) => onChange(e.target.value)}
// // //     >
// // //       <option value="">All {label}s</option>
// // //       {options.map((option) => (
// // //         <option key={option.value} value={option.value}>
// // //           {option.label}
// // //         </option>
// // //       ))}
// // //     </select>
// // //   </div>
// // // );

// // // const VideoPage = () => {
// // //   const [videos, setVideos] = useState([]);
// // //   const [filteredVideos, setFilteredVideos] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [activeClass, setActiveClass] = useState(null);
// // //   const [activeSubject, setActiveSubject] = useState(null);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [showFilters, setShowFilters] = useState(false);
// // //   const [selectedVideo, setSelectedVideo] = useState(null);

// // //   const classes = [6, 7, 8, 9, 10, 11, 12];
// // //   const subjects = ['physics', 'chemistry', 'biology', 'mathematics', 'science'];

// // //   // Fetch videos from YouTube
// // //   const fetchYouTubeVideos = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       // First, get the playlist items
// // //       const playlistResponse = await fetch(
// // //         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
// // //       );
      
// // //       if (!playlistResponse.ok) {
// // //         throw new Error('Failed to fetch playlist items');
// // //       }
      
// // //       const playlistData = await playlistResponse.json();
      
// // //       if (!playlistData.items || playlistData.items.length === 0) {
// // //         setVideos([]);
// // //         setFilteredVideos([]);
// // //         return;
// // //       }

// // //       // Get video IDs for detailed information
// // //       const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
      
// // //       // Fetch detailed video information
// // //       const videosResponse = await fetch(
// // //         `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
// // //       );
      
// // //       if (!videosResponse.ok) {
// // //         throw new Error('Failed to fetch video details');
// // //       }
      
// // //       const videosData = await videosResponse.json();
      
// // //       // Process and format video data
// // //       const processedVideos = videosData.items.map(video => ({
// // //         id: video.id,
// // //         title: video.snippet.title,
// // //         description: video.snippet.description || 'No description available',
// // //         thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
// // //         publishedAt: video.snippet.publishedAt,
// // //         duration: video.contentDetails.duration,
// // //         viewCount: parseInt(video.statistics.viewCount || 0),
// // //         likeCount: parseInt(video.statistics.likeCount || 0),
// // //         tags: video.snippet.tags || [],
// // //         // Extract class and subject from title/description/tags
// // //         class: extractClass(video.snippet.title, video.snippet.description, video.snippet.tags),
// // //         subject: extractSubject(video.snippet.title, video.snippet.description, video.snippet.tags)
// // //       }));

// // //       setVideos(processedVideos);
// // //       setFilteredVideos(processedVideos);
// // //     } catch (err) {
// // //       console.error('Error fetching YouTube videos:', err);
// // //       setError('Failed to load videos. Please try again later.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Helper function to extract class from video metadata
// // //   const extractClass = (title, description, tags) => {
// // //     const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
// // //     for (let i = 6; i <= 12; i++) {
// // //       if (text.includes(`class ${i}`) || text.includes(`grade ${i}`) || text.includes(`${i}th`)) {
// // //         return i;
// // //       }
// // //     }
// // //     return null;
// // //   };

// // //   // Helper function to extract subject from video metadata
// // //   const extractSubject = (title, description, tags) => {
// // //     const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
// // //     const subjectKeywords = {
// // //       physics: ['physics', 'motion', 'force', 'energy', 'wave', 'optics', 'thermodynamics'],
// // //       chemistry: ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'compound', 'element'],
// // //       biology: ['biology', 'cell', 'organism', 'genetics', 'evolution', 'ecology', 'anatomy'],
// // //       mathematics: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics'],
// // //       science: ['science', 'experiment', 'hypothesis', 'theory', 'research']
// // //     };

// // //     for (const [subject, keywords] of Object.entries(subjectKeywords)) {
// // //       if (keywords.some(keyword => text.includes(keyword))) {
// // //         return subject;
// // //       }
// // //     }
// // //     return null;
// // //   };

// // //   useEffect(() => {
// // //     fetchYouTubeVideos();
// // //   }, []);

// // //   useEffect(() => {
// // //     let result = videos;

// // //     // Filter by class
// // //     if (activeClass) {
// // //       result = result.filter(video => video.class === activeClass);
// // //     }

// // //     // Filter by subject
// // //     if (activeSubject) {
// // //       result = result.filter(video => video.subject === activeSubject);
// // //     }

// // //     // Filter by search query
// // //     if (searchQuery) {
// // //       const query = searchQuery.toLowerCase();
// // //       result = result.filter(video => 
// // //         video.title.toLowerCase().includes(query) || 
// // //         video.description.toLowerCase().includes(query) ||
// // //         video.tags.some(tag => tag.toLowerCase().includes(query))
// // //       );
// // //     }

// // //     setFilteredVideos(result);
// // //   }, [activeClass, activeSubject, searchQuery, videos]);

// // //   // Reset all filters
// // //   const resetFilters = () => {
// // //     setActiveClass(null);
// // //     setActiveSubject(null);
// // //     setSearchQuery('');
// // //   };

// // //   // Handle video selection
// // //   const handleVideoSelect = (video) => {
// // //     setSelectedVideo(video);
// // //   };

// // //   // Handle video close
// // //   const handleVideoClose = () => {
// // //     setSelectedVideo(null);
// // //   };

// // //   // Animation variants
// // //   const containerVariants = {
// // //     hidden: { opacity: 0 },
// // //     visible: {
// // //       opacity: 1,
// // //       transition: {
// // //         staggerChildren: 0.1
// // //       }
// // //     }
// // //   };

// // //   if (error) {
// // //     return (
// // //       <div className="pt-24 pb-16">
// // //         <div className="container mx-auto px-4">
// // //           <div className="flex flex-col items-center justify-center py-12 text-center">
// // //             <Video className="h-16 w-16 text-red-400 mb-4" />
// // //             <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Videos</h3>
// // //             <p className="text-gray-500 mb-4">{error}</p>
// // //             <button
// // //               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // //               onClick={fetchYouTubeVideos}
// // //             >
// // //               Try Again
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <motion.div
// // //         className="pt-24 pb-16 min-h-screen bg-gray-50"
// // //         initial={{ opacity: 0 }}
// // //         animate={{ opacity: 1 }}
// // //         exit={{ opacity: 0 }}
// // //       >
// // //         <div className="container mx-auto px-4">
// // //           {/* Header */}
// // //           <div className="mb-8">
// // //             <motion.h1 
// // //               className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
// // //               initial={{ opacity: 0, y: -20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ duration: 0.5 }}
// // //             >
// // //               Video Lessons
// // //             </motion.h1>
// // //             <motion.p
// // //               className="text-gray-600 max-w-3xl"
// // //               initial={{ opacity: 0, y: -20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ duration: 0.5, delay: 0.2 }}
// // //             >
// // //               Watch our comprehensive video lessons for Physics, Chemistry, Biology, and more. 
// // //               Filter by class and subject to find the perfect video for your studies.
// // //             </motion.p>
// // //           </div>

// // //           {/* Search and Filters */}
// // //           <div className="mb-8">
// // //             <div className="flex flex-col md:flex-row gap-4 mb-4">
// // //               <div className="relative flex-grow">
// // //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                   <Search className="h-5 w-5 text-gray-400" />
// // //                 </div>
// // //                 <input
// // //                   type="text"
// // //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                   placeholder="Search videos..."
// // //                   value={searchQuery}
// // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // //                 />
// // //               </div>
// // //               <button
// // //                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center md:w-auto"
// // //                 onClick={() => setShowFilters(!showFilters)}
// // //               >
// // //                 <Filter className="h-5 w-5 mr-2" />
// // //                 Filters
// // //               </button>
// // //             </div>

// // //             {/* Filters */}
// // //             {showFilters && (
// // //               <motion.div 
// // //                 className="bg-white p-4 rounded-md shadow-md mb-4"
// // //                 initial={{ opacity: 0, height: 0 }}
// // //                 animate={{ opacity: 1, height: 'auto' }}
// // //                 exit={{ opacity: 0, height: 0 }}
// // //                 transition={{ duration: 0.3 }}
// // //               >
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <FilterDropdown 
// // //                     label="Class"
// // //                     options={classes.map(c => ({ value: c.toString(), label: `Class ${c}` }))}
// // //                     value={activeClass?.toString() || ''}
// // //                     onChange={(value) => setActiveClass(value ? parseInt(value) : null)}
// // //                   />
// // //                   <FilterDropdown 
// // //                     label="Subject"
// // //                     options={subjects.map(s => ({ 
// // //                       value: s, 
// // //                       label: s.charAt(0).toUpperCase() + s.slice(1)
// // //                     }))}
// // //                     value={activeSubject || ''}
// // //                     onChange={(value) => setActiveSubject(value)}
// // //                   />
// // //                 </div>
// // //                 <div className="mt-4 flex justify-end">
// // //                   <button
// // //                     className="text-blue-600 hover:text-blue-700 font-medium"
// // //                     onClick={resetFilters}
// // //                   >
// // //                     Reset Filters
// // //                   </button>
// // //                 </div>
// // //               </motion.div>
// // //             )}
// // //           </div>

// // //           {/* Loading State */}
// // //           {loading && (
// // //             <div className="flex justify-center items-center py-12">
// // //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// // //               <span className="ml-4 text-gray-600">Loading videos...</span>
// // //             </div>
// // //           )}

// // //           {/* Videos List */}
// // //           {!loading && filteredVideos.length > 0 && (
// // //             <div className="mb-8">
// // //               <h2 className="text-xl font-semibold mb-4 text-gray-800">
// // //                 {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
// // //               </h2>
// // //               <motion.div 
// // //                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
// // //                 variants={containerVariants}
// // //                 initial="hidden"
// // //                 animate="visible"
// // //               >
// // //                 {filteredVideos.map((video) => (
// // //                   <YouTubeVideoCard 
// // //                     key={video.id} 
// // //                     video={video}
// // //                     onVideoSelect={handleVideoSelect}
// // //                   />
// // //                 ))}
// // //               </motion.div>
// // //             </div>
// // //           )}

// // //           {/* No Videos Found */}
// // //           {!loading && filteredVideos.length === 0 && (
// // //             <div className="flex flex-col items-center justify-center py-12 text-center">
// // //               <Video className="h-16 w-16 text-gray-400 mb-4" />
// // //               <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
// // //               <p className="text-gray-500 mb-4">
// // //                 We couldn't find any videos matching your filters. Try adjusting your search or filters.
// // //               </p>
// // //               <button
// // //                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // //                 onClick={resetFilters}
// // //               >
// // //                 Reset Filters
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </motion.div>

// // //       {/* Video Player Modal */}
// // //       <AnimatePresence>
// // //         {selectedVideo && (
// // //           <VideoPlayer
// // //             video={selectedVideo}
// // //             onClose={handleVideoClose}
// // //             onVideoSelect={handleVideoSelect}
// // //             allVideos={videos}
// // //           />
// // //         )}
// // //       </AnimatePresence>
// // //     </>
// // //   );
// // // };

// // // export default VideoPage;
// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Play, Clock, Eye, Calendar, BookOpen, FlaskConical, Atom, Calculator } from 'lucide-react';

// const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
// const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
// const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// const YouTubeVideoFetcher = () => {
//   const [videos, setVideos] = useState([]);
//   const [filteredVideos, setFilteredVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedClass, setSelectedClass] = useState('all');
//   const [selectedSubject, setSelectedSubject] = useState('all');
//   const [selectedDuration, setSelectedDuration] = useState('all');
//   const [selectedContentType, setSelectedContentType] = useState('all');
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Auto-fetch videos when component mounts
//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const classes = [
//     { id: 'all', label: 'All Classes', icon: BookOpen },
//     { id: '6', label: 'Class 6', icon: BookOpen },
//     { id: '7', label: 'Class 7', icon: BookOpen },
//     { id: '8', label: 'Class 8', icon: BookOpen },
//     { id: '9', label: 'Class 9', icon: BookOpen },
//     { id: '10', label: 'Class 10', icon: BookOpen },
//     { id: '11', label: 'Class 11', icon: BookOpen },
//     { id: '12', label: 'Class 12', icon: BookOpen }
//   ];

//   const subjects = [
//     { id: 'all', label: 'All Subjects', icon: BookOpen, color: 'bg-slate-500' },
//     { id: 'physics', label: 'Physics', icon: Atom, color: 'bg-blue-500' },
//     { id: 'chemistry', label: 'Chemistry', icon: FlaskConical, color: 'bg-green-500' },
//     { id: 'biology', label: 'Biology', icon: BookOpen, color: 'bg-emerald-500' },
//     { id: 'math', label: 'Mathematics', icon: Calculator, color: 'bg-purple-500' }
//   ];

//   const durations = [
//     { id: 'all', label: 'All Durations' },
//     { id: 'shorts', label: 'Shorts (< 60s)' },
//     { id: 'short', label: 'Short (1-4 min)' },
//     { id: 'medium', label: 'Medium (4-20 min)' },
//     { id: 'long', label: 'Long (> 20 min)' }
//   ];

//   const contentTypes = [
//     { id: 'all', label: 'All Content' },
//     { id: 'videos', label: 'Regular Videos' },
//     { id: 'shorts', label: 'YouTube Shorts' },
//     { id: 'playlist', label: 'Playlist Videos' }
//   ];

//   const fetchVideos = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
//       );
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch videos');
//       }
      
//       const data = await response.json();
      
//       // Fetch additional details for each video
//       const videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
//       const detailsResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
//       );
      
//       const detailsData = await detailsResponse.json();
      
//       const videosWithDetails = data.items.map(item => {
//         const details = detailsData.items.find(d => d.id === item.snippet.resourceId.videoId);
//         return {
//           ...item,
//           contentDetails: details?.contentDetails,
//           statistics: details?.statistics
//         };
//       });
      
//       setVideos(videosWithDetails);
//       setFilteredVideos(videosWithDetails);
//       setInitialLoad(false);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       alert('Error fetching videos. Please check your API key and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseDuration = (duration) => {
//     const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//     const hours = (match[1] ? parseInt(match[1]) : 0);
//     const minutes = (match[2] ? parseInt(match[2]) : 0);
//     const seconds = (match[3] ? parseInt(match[3]) : 0);
//     return hours * 3600 + minutes * 60 + seconds;
//   };

//   const formatDuration = (duration) => {
//     if (!duration) return '';
//     const totalSeconds = parseDuration(duration);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
    
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     }
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const getDurationCategory = (duration) => {
//     if (!duration) return 'unknown';
//     const totalSeconds = parseDuration(duration);
//     if (totalSeconds < 60) return 'shorts';
//     if (totalSeconds < 240) return 'short';
//     if (totalSeconds <= 1200) return 'medium';
//     return 'long';
//   };

//   const getContentType = (video) => {
//     const duration = video.contentDetails?.duration;
//     if (!duration) return 'unknown';
    
//     const totalSeconds = parseDuration(duration);
//     const title = video.snippet.title.toLowerCase();
//     const description = video.snippet.description.toLowerCase();
    
//     // Check if it's a YouTube Short (< 60 seconds)
//     if (totalSeconds < 60) return 'shorts';
    
//     // Check if it's part of a playlist or series
//     if (title.includes('playlist') || title.includes('series') || 
//         description.includes('playlist') || description.includes('series') ||
//         title.includes('part') || title.includes('episode')) {
//       return 'playlist';
//     }
    
//     return 'videos';
//   };

//   const detectSubjectAndClass = (title, description) => {
//     const text = (title + ' ' + description).toLowerCase();
    
//     // Subject detection
//     let subject = 'general';
//     if (text.includes('physics') || text.includes('mechanics') || text.includes('thermodynamics') || text.includes('optics')) {
//       subject = 'physics';
//     } else if (text.includes('chemistry') || text.includes('chemical') || text.includes('organic') || text.includes('inorganic')) {
//       subject = 'chemistry';
//     } else if (text.includes('biology') || text.includes('botany') || text.includes('zoology') || text.includes('genetics')) {
//       subject = 'biology';
//     } else if (text.includes('math') || text.includes('algebra') || text.includes('geometry') || text.includes('calculus') || text.includes('trigonometry')) {
//       subject = 'math';
//     }
    
//     // Class detection
//     let detectedClass = null;
//     for (let i = 6; i <= 12; i++) {
//       if (text.includes(`class ${i}`) || text.includes(`grade ${i}`) || text.includes(`${i}th class`) || text.includes(`std ${i}`)) {
//         detectedClass = i.toString();
//         break;
//       }
//     }
    
//     return { subject, class: detectedClass };
//   };

//   const filterVideos = () => {
//     let filtered = videos.filter(video => {
//       const title = video.snippet.title.toLowerCase();
//       const description = video.snippet.description.toLowerCase();
//       const { subject, class: videoClass } = detectSubjectAndClass(title, description);
      
//       // Search term filter
//       if (searchTerm && !title.includes(searchTerm.toLowerCase()) && !description.includes(searchTerm.toLowerCase())) {
//         return false;
//       }
      
//       // Class filter
//       if (selectedClass !== 'all' && videoClass !== selectedClass) {
//         return false;
//       }
      
//       // Subject filter
//       if (selectedSubject !== 'all' && subject !== selectedSubject) {
//         return false;
//       }
      
//       // Duration filter
//       if (selectedDuration !== 'all') {
//         const durationCategory = getDurationCategory(video.contentDetails?.duration);
//         if (durationCategory !== selectedDuration) {
//           return false;
//         }
//       }
      
//       // Content type filter
//       if (selectedContentType !== 'all') {
//         const contentType = getContentType(video);
//         if (contentType !== selectedContentType) {
//           return false;
//         }
//       }
      
//       return true;
//     });
    
//     setFilteredVideos(filtered);
//   };

//   useEffect(() => {
//     if (videos.length > 0) {
//       filterVideos();
//     }
//   }, [searchTerm, selectedClass, selectedSubject, selectedDuration, selectedContentType, videos]);

//   const formatNumber = (num) => {
//     if (!num) return '0';
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const getSubjectIcon = (subject) => {
//     switch (subject) {
//       case 'physics': return Atom;
//       case 'chemistry': return FlaskConical;
//       case 'biology': return BookOpen;
//       case 'math': return Calculator;
//       default: return BookOpen;
//     }
//   };

//   const getSubjectColor = (subject) => {
//     switch (subject) {
//       case 'physics': return 'bg-blue-500';
//       case 'chemistry': return 'bg-green-500';
//       case 'biology': return 'bg-emerald-500';
//       case 'math': return 'bg-purple-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 ">
//       <div className="max-w-7xl mx-auto m-20">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-sm">
//             Educational Video Hub
//           </h1>
//           <p className="text-xl text-gray-600 drop-shadow-sm">
//             Discover Physics, Chemistry, Biology & Math videos for Classes 6-12
//           </p>
//         </div>

//         {/* Search and Fetch Section */}
//         <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
//           <div className="flex flex-col md:flex-row gap-4 items-center">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search videos..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
//               />
//             </div>
//             <button
//               onClick={fetchVideos}
//               disabled={loading}
//               className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   Loading...
//                 </div>
//               ) : (
//                 'Fetch Videos'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-5 h-5 text-gray-700" />
//             <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
//           </div>
          
//           <div className="space-y-6">
//             {/* Class Filter */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-600 mb-3">Class</h4>
//               <div className="flex flex-wrap gap-2">
//                 {classes.map((cls) => (
//                   <button
//                     key={cls.id}
//                     onClick={() => setSelectedClass(cls.id)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                       selectedClass === cls.id
//                         ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
//                     }`}
//                   >
//                     {cls.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Subject Filter */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-600 mb-3">Subject</h4>
//               <div className="flex flex-wrap gap-2">
//                 {subjects.map((subject) => {
//                   const Icon = subject.icon;
//                   return (
//                     <button
//                       key={subject.id}
//                       onClick={() => setSelectedSubject(subject.id)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                         selectedSubject === subject.id
//                           ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
//                       }`}
//                     >
//                       <Icon className="w-4 h-4" />
//                       {subject.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Duration Filter */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-600 mb-3">Duration</h4>
//               <div className="flex flex-wrap gap-2">
//                 {durations.map((duration) => (
//                   <button
//                     key={duration.id}
//                     onClick={() => setSelectedDuration(duration.id)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                       selectedDuration === duration.id
//                         ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
//                     }`}
//                   >
//                     <Clock className="w-4 h-4" />
//                     {duration.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Content Type Filter */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-600 mb-3">Content Type</h4>
//               <div className="flex flex-wrap gap-2">
//                 {contentTypes.map((type) => (
//                   <button
//                     key={type.id}
//                     onClick={() => setSelectedContentType(type.id)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                       selectedContentType === type.id
//                         ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
//                     }`}
//                   >
//                     <Play className="w-4 h-4" />
//                     {type.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         {videos.length > 0 && (
//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-gray-800 mb-2">
//                 {filteredVideos.length}
//               </div>
//               <div className="text-gray-600">
//                 {filteredVideos.length === 1 ? 'Video Found' : 'Videos Found'}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-16">
//             <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-700 text-xl">Fetching educational videos...</p>
//           </div>
//         )}

//         {/* Video Grid */}
//         {!loading && filteredVideos.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredVideos.map((video) => {
//               const { subject, class: videoClass } = detectSubjectAndClass(
//                 video.snippet.title,
//                 video.snippet.description
//               );
//               const SubjectIcon = getSubjectIcon(subject);
              
//               return (
//                 <div
//                   key={video.id}
//                   className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
//                   onClick={() => window.open(`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`, '_blank')}
//                 >
//                   <div className="relative">
//                     <img
//                       src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url}
//                       alt={video.snippet.title}
//                       className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                       <Play className="w-16 h-16 text-white drop-shadow-lg" />
//                     </div>
                    
//                     {video.contentDetails?.duration && (
//                       <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
//                         {formatDuration(video.contentDetails.duration)}
//                       </div>
//                     )}
                    
//                     <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
//                       <div className={`${getSubjectColor(subject)} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
//                         <SubjectIcon className="w-3 h-3" />
//                         {subject.charAt(0).toUpperCase() + subject.slice(1)}
//                       </div>
//                       {videoClass && (
//                         <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
//                           Class {videoClass}
//                         </div>
//                       )}
//                       {(() => {
//                         const contentType = getContentType(video);
//                         const durationCategory = getDurationCategory(video.contentDetails?.duration);
                        
//                         if (contentType === 'shorts' || durationCategory === 'shorts') {
//                           return (
//                             <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
//                               Short
//                             </div>
//                           );
//                         }
                        
//                         if (contentType === 'playlist') {
//                           return (
//                             <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
//                               Playlist
//                             </div>
//                           );
//                         }
                        
//                         return null;
//                       })()}
//                     </div>
//                   </div>
                  
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
//                       {video.snippet.title}
//                     </h3>
                    
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                       {video.snippet.description}
//                     </p>
                    
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center gap-4">
//                         {video.statistics?.viewCount && (
//                           <div className="flex items-center gap-1">
//                             <Eye className="w-3 h-3" />
//                             {formatNumber(video.statistics.viewCount)}
//                           </div>
//                         )}
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           {new Date(video.snippet.publishedAt).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* No Results */}
//         {!loading && videos.length > 0 && filteredVideos.length === 0 && (
//           <div className="text-center py-16">
//             <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-2xl font-semibold text-gray-700 mb-2">No videos found</h3>
//             <p className="text-gray-600">Try adjusting your filters or search terms</p>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && videos.length === 0 && !initialLoad && (
//           <div className="text-center py-16">
//             <Play className="w-24 h-24 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-2xl font-semibold text-gray-700 mb-2">Ready to explore?</h3>
//             <p className="text-gray-600 mb-6">Click "Fetch Videos" to load educational content</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default YouTubeVideoFetcher;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { List, Video, PlaySquare, ChevronDown, Loader2, Play, Search, X } from 'lucide-react';

const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';

const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Math'];

export default function YouTubeFetcher() {
  const [contentType, setContentType] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [channelInfo, setChannelInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [allVideos, setAllVideos] = useState([]);
  const observerRef = useRef(null);
  const lastVideoRef = useRef(null);

  useEffect(() => {
    fetchChannelInfo();
    fetchPlaylists();
    fetchContent('videos');
  }, []);

  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !searchQuery && !selectedClass && !selectedSubject) {
          loadMoreContent();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;

    if (lastVideoRef.current) {
      observer.observe(lastVideoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [loading, hasMore, nextPageToken, searchQuery, selectedClass, selectedSubject]);

  const fetchChannelInfo = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setChannelInfo(data.items[0]);
      }
    } catch (error) {
      console.error('Error fetching channel info:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&key=${API_KEY}&maxResults=50`
      );
      const data = await response.json();
      setPlaylists(data.items || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchContent = async (type, pageToken = '') => {
    setLoading(true);
    if (!pageToken) {
      setVideos([]);
      setAllVideos([]);
      setNextPageToken(null);
      setHasMore(true);
    }

    try {
      let url = '';
      
      if (type === 'videos') {
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&videoDuration=medium&order=date&key=${API_KEY}&maxResults=50&pageToken=${pageToken}`;
      } else if (type === 'shorts') {
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&videoDuration=short&order=date&key=${API_KEY}&maxResults=50&pageToken=${pageToken}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      const newVideos = data.items || [];
      if (pageToken) {
        setAllVideos(prev => [...prev, ...newVideos]);
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setAllVideos(newVideos);
        setVideos(newVideos);
      }
      setNextPageToken(data.nextPageToken || null);
      setHasMore(!!data.nextPageToken);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  const fetchPlaylistVideos = async (playlistId, pageToken = '') => {
    setLoading(true);
    if (!pageToken) {
      setVideos([]);
      setAllVideos([]);
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50&pageToken=${pageToken}`
      );
      const data = await response.json();
      
      const newVideos = data.items || [];
      if (pageToken) {
        setAllVideos(prev => [...prev, ...newVideos]);
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setAllVideos(newVideos);
        setVideos(newVideos);
      }
      setNextPageToken(data.nextPageToken || null);
      setHasMore(!!data.nextPageToken);
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
    }
    setLoading(false);
  };

  const loadMoreContent = useCallback(() => {
    if (!nextPageToken || loading) return;

    if (selectedPlaylist) {
      fetchPlaylistVideos(selectedPlaylist.id, nextPageToken);
    } else {
      fetchContent(contentType, nextPageToken);
    }
  }, [nextPageToken, loading, selectedPlaylist, contentType]);

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setSelectedPlaylist(null);
    setSearchQuery('');
    setSelectedClass('');
    setSelectedSubject('');
    fetchContent(type);
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setContentType('playlist');
    setSearchQuery('');
    setSelectedClass('');
    setSelectedSubject('');
    fetchPlaylistVideos(playlist.id);
  };

  const filterVideos = () => {
    let filtered = [...allVideos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.snippet.title.toLowerCase().includes(query) ||
        item.snippet.description.toLowerCase().includes(query)
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(item => 
        item.snippet.title.toLowerCase().includes(selectedClass.toLowerCase()) ||
        item.snippet.description.toLowerCase().includes(selectedClass.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(item => 
        item.snippet.title.toLowerCase().includes(selectedSubject.toLowerCase()) ||
        item.snippet.description.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }

    setVideos(filtered);
  };

  useEffect(() => {
    if (allVideos.length > 0) {
      filterVideos();
    }
  }, [searchQuery, selectedClass, selectedSubject]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClass('');
    setSelectedSubject('');
    setVideos(allVideos);
  };

  const getVideoId = (item) => {
    if (contentType === 'playlist' || selectedPlaylist) {
      return item.snippet.resourceId?.videoId;
    }
    return item.id?.videoId;
  };

  const hasActiveFilters = searchQuery || selectedClass || selectedSubject;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Channel Header */}
        {channelInfo && (
          <div className="text-center mb-12 animate-fade-in mt-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
              <img
                src={channelInfo.snippet.thumbnails.medium.url}
                alt={channelInfo.snippet.title}
                className="relative w-32 h-32 rounded-full mx-auto shadow-2xl border-4 border-white animate-scale-in"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-3 shadow-xl animate-float">
                <Play className="w-6 h-6" fill="white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-slide-down">
              {channelInfo.snippet.title}
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg animate-fade-in-delay leading-relaxed">
              {channelInfo.snippet.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 animate-slide-up">
              <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl px-8 py-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full p-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-800 group-hover:text-red-500 transition-colors">
                      {parseInt(channelInfo.statistics.subscriberCount).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Subscribers</div>
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl px-8 py-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-full p-2 group-hover:scale-110 transition-transform">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-800 group-hover:text-purple-500 transition-colors">
                      {parseInt(channelInfo.statistics.videoCount).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Videos</div>
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl px-8 py-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full p-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
                      {(parseInt(channelInfo.statistics.viewCount) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Total Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="max-w-6xl mx-auto mb-8 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Search Box */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos by title or description..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
                />
              </div>
            </div>

            {/* Class and Subject Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Class Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 cursor-pointer"
                >
                  <option value="">All Classes</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700 cursor-pointer"
                >
                  <option value="">All Subjects</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center animate-fade-in">
                <span className="text-sm text-gray-600 font-semibold">Active Filters:</span>
                {searchQuery && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    Search: {searchQuery}
                  </span>
                )}
                {selectedClass && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedClass}
                  </span>
                )}
                {selectedSubject && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedSubject}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-all"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center animate-slide-up">
          <button
            onClick={() => handleContentTypeChange('videos')}
            className={`group flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
              contentType === 'videos' && !selectedPlaylist
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 shadow-md hover:shadow-xl'
            }`}
          >
            <Video className={`w-5 h-5 transition-transform group-hover:rotate-12 ${
              contentType === 'videos' && !selectedPlaylist ? 'animate-pulse-slow' : ''
            }`} />
            <span className="font-semibold">Videos</span>
          </button>
          
          <button
            onClick={() => handleContentTypeChange('shorts')}
            className={`group flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
              contentType === 'shorts' && !selectedPlaylist
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-700 shadow-md hover:shadow-xl'
            }`}
          >
            <PlaySquare className={`w-5 h-5 transition-transform group-hover:rotate-12 ${
              contentType === 'shorts' && !selectedPlaylist ? 'animate-pulse-slow' : ''
            }`} />
            <span className="font-semibold">Shorts</span>
          </button>
          
          {playlists.length > 0 && (
            <div className="relative group">
              <button className={`flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                selectedPlaylist
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-xl'
              }`}>
                <List className={`w-5 h-5 transition-transform group-hover:rotate-12 ${
                  selectedPlaylist ? 'animate-pulse-slow' : ''
                }`} />
                <span className="font-semibold">
                  {selectedPlaylist ? selectedPlaylist.snippet.title.substring(0, 15) + '...' : 'Playlists'}
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 max-h-96 overflow-y-auto border border-gray-100">
                {playlists.map((playlist, index) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistSelect(playlist)}
                    className={`w-full text-left px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border-b border-gray-100 last:border-b-0 ${
                      selectedPlaylist?.id === playlist.id ? 'bg-blue-50' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="font-semibold text-gray-800 truncate">{playlist.snippet.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      📹 {playlist.contentDetails.itemCount} videos
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Playlist Info */}
        {selectedPlaylist && (
          <div className="max-w-3xl mx-auto mb-10 p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl text-white animate-slide-down">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">{selectedPlaylist.snippet.title}</h3>
                <p className="text-blue-100">
                  📹 {selectedPlaylist.contentDetails.itemCount} videos in this playlist
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPlaylist(null);
                  setContentType('videos');
                  fetchContent('videos');
                }}
                className="px-6 py-3 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all font-semibold transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {allVideos.length > 0 && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-gray-600">
              Showing <span className="font-bold text-purple-600">{videos.length}</span> of <span className="font-bold">{allVideos.length}</span> videos
            </p>
          </div>
        )}

        {/* Videos Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((item, index) => {
              const videoId = getVideoId(item);
              const isLast = index === videos.length - 1;
              
              return (
                <div
                  key={`${videoId}-${index}`}
                  ref={isLast ? lastVideoRef : null}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.snippet.thumbnails.medium.url}
                        alt={item.snippet.title}
                        className="w-full aspect-video object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {item.snippet.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.snippet.description}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16 animate-fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600 font-semibold">Loading more content...</p>
          </div>
        )}

        {/* No Content Message */}
        {!loading && videos.length === 0 && allVideos.length > 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-2">No videos found matching your filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {!loading && videos.length === 0 && allVideos.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-600 text-lg">No content found in this section.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.2s backwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.3s backwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out backwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}