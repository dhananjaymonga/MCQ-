// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Search, Filter, Video, Play, Clock, Eye } from 'lucide-react';

// // YouTube API configuration
// const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
// const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
// const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// // YouTube Video Card Component
// const YouTubeVideoCard = ({ video }) => {
//   const formatDuration = (duration) => {
//     const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//     const hours = (match[1] || '').replace('H', '');
//     const minutes = (match[2] || '').replace('M', '');
//     const seconds = (match[3] || '').replace('S', '');
    
//     if (hours) {
//       return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
//     }
//     return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
//   };

//   const formatViewCount = (count) => {
//     if (count >= 1000000) {
//       return `${(count / 1000000).toFixed(1)}M views`;
//     } else if (count >= 1000) {
//       return `${(count / 1000).toFixed(1)}K views`;
//     }
//     return `${count} views`;
//   };

//   const formatPublishedDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return '1 day ago';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
//     return `${Math.floor(diffDays / 365)} years ago`;
//   };

//   const openVideo = () => {
//     window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
//   };

//   return (
//     <motion.div
//       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -5 }}
//       onClick={openVideo}
//     >
//       <div className="relative">
//         <img
//           src={video.thumbnail}
//           alt={video.title}
//           className="w-full h-48 object-cover"
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//           <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
//         </div>
//         {video.duration && (
//           <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
//             <Clock className="h-3 w-3 inline mr-1" />
//             {formatDuration(video.duration)}
//           </div>
//         )}
//       </div>
      
//       <div className="p-4">
//         <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
//           {video.title}
//         </h3>
//         <p className="text-gray-600 text-sm mb-3 line-clamp-3">
//           {video.description}
//         </p>
        
//         <div className="flex items-center justify-between text-xs text-gray-500">
//           <div className="flex items-center">
//             <Eye className="h-3 w-3 mr-1" />
//             {formatViewCount(video.viewCount)}
//           </div>
//           <span>{formatPublishedDate(video.publishedAt)}</span>
//         </div>
        
//         {video.tags && (
//           <div className="mt-3 flex flex-wrap gap-1">
//             {video.tags.slice(0, 3).map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // Filter Dropdown Component
// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       {label}
//     </label>
//     <select
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//     >
//       <option value="">All {label}s</option>
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const VideoPage = () => {
//   const [videos, setVideos] = useState([]);
//   const [filteredVideos, setFilteredVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeClass, setActiveClass] = useState(null);
//   const [activeSubject, setActiveSubject] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   const classes = [6, 7, 8, 9, 10, 11, 12];
//   const subjects = ['physics', 'chemistry', 'biology', 'mathematics', 'science'];

//   // Fetch videos from YouTube
//   const fetchYouTubeVideos = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // First, get the playlist items
//       const playlistResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
//       );
      
//       if (!playlistResponse.ok) {
//         throw new Error('Failed to fetch playlist items');
//       }
      
//       const playlistData = await playlistResponse.json();
      
//       if (!playlistData.items || playlistData.items.length === 0) {
//         setVideos([]);
//         setFilteredVideos([]);
//         return;
//       }

//       // Get video IDs for detailed information
//       const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
      
//       // Fetch detailed video information
//       const videosResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
//       );
      
//       if (!videosResponse.ok) {
//         throw new Error('Failed to fetch video details');
//       }
      
//       const videosData = await videosResponse.json();
      
//       // Process and format video data
//       const processedVideos = videosData.items.map(video => ({
//         id: video.id,
//         title: video.snippet.title,
//         description: video.snippet.description || 'No description available',
//         thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
//         publishedAt: video.snippet.publishedAt,
//         duration: video.contentDetails.duration,
//         viewCount: parseInt(video.statistics.viewCount || 0),
//         likeCount: parseInt(video.statistics.likeCount || 0),
//         tags: video.snippet.tags || [],
//         // Extract class and subject from title/description/tags
//         class: extractClass(video.snippet.title, video.snippet.description, video.snippet.tags),
//         subject: extractSubject(video.snippet.title, video.snippet.description, video.snippet.tags)
//       }));

//       setVideos(processedVideos);
//       setFilteredVideos(processedVideos);
//     } catch (err) {
//       console.error('Error fetching YouTube videos:', err);
//       setError('Failed to load videos. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract class from video metadata
//   const extractClass = (title, description, tags) => {
//     const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
//     for (let i = 6; i <= 12; i++) {
//       if (text.includes(`class ${i}`) || text.includes(`grade ${i}`) || text.includes(`${i}th`)) {
//         return i;
//       }
//     }
//     return null;
//   };

//   // Helper function to extract subject from video metadata
//   const extractSubject = (title, description, tags) => {
//     const text = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
//     const subjectKeywords = {
//       physics: ['physics', 'motion', 'force', 'energy', 'wave', 'optics', 'thermodynamics'],
//       chemistry: ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'compound', 'element'],
//       biology: ['biology', 'cell', 'organism', 'genetics', 'evolution', 'ecology', 'anatomy'],
//       mathematics: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics'],
//       science: ['science', 'experiment', 'hypothesis', 'theory', 'research']
//     };

//     for (const [subject, keywords] of Object.entries(subjectKeywords)) {
//       if (keywords.some(keyword => text.includes(keyword))) {
//         return subject;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     fetchYouTubeVideos();
//   }, []);

//   useEffect(() => {
//     let result = videos;

//     // Filter by class
//     if (activeClass) {
//       result = result.filter(video => video.class === activeClass);
//     }

//     // Filter by subject
//     if (activeSubject) {
//       result = result.filter(video => video.subject === activeSubject);
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(video => 
//         video.title.toLowerCase().includes(query) || 
//         video.description.toLowerCase().includes(query) ||
//         video.tags.some(tag => tag.toLowerCase().includes(query))
//       );
//     }

//     setFilteredVideos(result);
//   }, [activeClass, activeSubject, searchQuery, videos]);

//   // Reset all filters
//   const resetFilters = () => {
//     setActiveClass(null);
//     setActiveSubject(null);
//     setSearchQuery('');
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   if (error) {
//     return (
//       <div className="pt-24 pb-16">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <Video className="h-16 w-16 text-red-400 mb-4" />
//             <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Videos</h3>
//             <p className="text-gray-500 mb-4">{error}</p>
//             <button
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               onClick={fetchYouTubeVideos}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="pt-24 pb-16 min-h-screen bg-gray-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <motion.h1 
//             className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Video Lessons
//           </motion.h1>
//           <motion.p
//             className="text-gray-600 max-w-3xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             Watch our comprehensive video lessons for Physics, Chemistry, Biology, and more. 
//             Filter by class and subject to find the perfect video for your studies.
//           </motion.p>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row gap-4 mb-4">
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Search videos..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <button
//               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center md:w-auto"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter className="h-5 w-5 mr-2" />
//               Filters
//             </button>
//           </div>

//           {/* Filters */}
//           {showFilters && (
//             <motion.div 
//               className="bg-white p-4 rounded-md shadow-md mb-4"
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FilterDropdown 
//                   label="Class"
//                   options={classes.map(c => ({ value: c.toString(), label: `Class ${c}` }))}
//                   value={activeClass?.toString() || ''}
//                   onChange={(value) => setActiveClass(value ? parseInt(value) : null)}
//                 />
//                 <FilterDropdown 
//                   label="Subject"
//                   options={subjects.map(s => ({ 
//                     value: s, 
//                     label: s.charAt(0).toUpperCase() + s.slice(1)
//                   }))}
//                   value={activeSubject || ''}
//                   onChange={(value) => setActiveSubject(value)}
//                 />
//               </div>
//               <div className="mt-4 flex justify-end">
//                 <button
//                   className="text-blue-600 hover:text-blue-700 font-medium"
//                   onClick={resetFilters}
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <span className="ml-4 text-gray-600">Loading videos...</span>
//           </div>
//         )}

//         {/* Videos List */}
//         {!loading && filteredVideos.length > 0 && (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//               {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
//             </h2>
//             <motion.div 
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               {filteredVideos.map((video) => (
//                 <YouTubeVideoCard 
//                   key={video.id} 
//                   video={video}
//                 />
//               ))}
//             </motion.div>
//           </div>
//         )}

//         {/* No Videos Found */}
//         {!loading && filteredVideos.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <Video className="h-16 w-16 text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
//             <p className="text-gray-500 mb-4">
//               We couldn't find any videos matching your filters. Try adjusting your search or filters.
//             </p>
//             <button
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               onClick={resetFilters}
//             >
//               Reset Filters
//             </button>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default VideoPage;
// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Search, Filter, Video, Play, Clock, Eye, X, ThumbsUp, Share2, Download, MoreHorizontal, ArrowLeft } from 'lucide-react';

// // // YouTube API configuration
// // const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
// // const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
// // const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// // // YouTube Video Player Component
// // const VideoPlayer = ({ video, onClose, onVideoSelect, allVideos }) => {
// //   const [showDescription, setShowDescription] = useState(false);
  
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
// //     return date.toLocaleDateString('en-US', { 
// //       year: 'numeric', 
// //       month: 'short', 
// //       day: 'numeric' 
// //     });
// //   };

// //   const getRelatedVideos = () => {
// //     return allVideos
// //       .filter(v => v.id !== video.id)
// //       .filter(v => v.subject === video.subject || v.class === video.class)
// //       .slice(0, 10);
// //   };

// //   return (
// //     <motion.div
// //       className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto"
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       exit={{ opacity: 0 }}
// //     >
// //       <div className="min-h-screen bg-black text-white">
// //         {/* Header */}
// //         <div className="flex items-center justify-between p-4 bg-black bg-opacity-90">
// //           <button
// //             onClick={onClose}
// //             className="flex items-center text-white hover:text-gray-300 transition-colors"
// //           >
// //             <ArrowLeft className="h-6 w-6 mr-2" />
// //             Back to Videos
// //           </button>
// //           <button
// //             onClick={onClose}
// //             className="text-white hover:text-gray-300 transition-colors"
// //           >
// //             <X className="h-6 w-6" />
// //           </button>
// //         </div>

// //         <div className="max-w-7xl mx-auto px-4 pb-8">
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //             {/* Main Video Section */}
// //             <div className="lg:col-span-2">
// //               {/* Video Player */}
// //               <div className="relative bg-black rounded-lg overflow-hidden mb-4">
// //                 <div className="aspect-video">
// //                   <iframe
// //                     src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
// //                     title={video.title}
// //                     className="w-full h-full"
// //                     frameBorder="0"
// //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //                     allowFullScreen
// //                   ></iframe>
// //                 </div>
// //               </div>

// //               {/* Video Info */}
// //               <div className="mb-6">
// //                 <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">
// //                   {video.title}
// //                 </h1>
                
// //                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
// //                   <div className="flex items-center text-gray-300 text-sm mb-2 md:mb-0">
// //                     <Eye className="h-4 w-4 mr-2" />
// //                     <span className="mr-4">{formatViewCount(video.viewCount)}</span>
// //                     <span>{formatPublishedDate(video.publishedAt)}</span>
// //                   </div>
                  
// //                   <div className="flex items-center space-x-4">
// //                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// //                       <ThumbsUp className="h-4 w-4" />
// //                       <span className="text-sm">{video.likeCount ? `${video.likeCount}` : 'Like'}</span>
// //                     </button>
// //                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// //                       <Share2 className="h-4 w-4" />
// //                       <span className="text-sm">Share</span>
// //                     </button>
// //                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// //                       <Download className="h-4 w-4" />
// //                       <span className="text-sm">Save</span>
// //                     </button>
// //                     <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
// //                       <MoreHorizontal className="h-4 w-4" />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Tags */}
// //                 {video.tags && video.tags.length > 0 && (
// //                   <div className="flex flex-wrap gap-2 mb-4">
// //                     {video.tags.slice(0, 5).map((tag, index) => (
// //                       <span
// //                         key={index}
// //                         className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
// //                       >
// //                         {tag}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* Description */}
// //                 <div className="bg-gray-900 rounded-lg p-4">
// //                   <div className="flex items-center justify-between mb-3">
// //                     <h3 className="font-semibold text-white">Description</h3>
// //                     <button
// //                       onClick={() => setShowDescription(!showDescription)}
// //                       className="text-blue-400 hover:text-blue-300 text-sm"
// //                     >
// //                       {showDescription ? 'Show less' : 'Show more'}
// //                     </button>
// //                   </div>
// //                   <p className={`text-gray-300 text-sm leading-relaxed ${
// //                     showDescription ? '' : 'line-clamp-3'
// //                   }`}>
// //                     {video.description || 'No description available'}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Sidebar - Related Videos */}
// //             <div className="lg:col-span-1">
// //               <h3 className="text-lg font-semibold mb-4 text-white">Related Videos</h3>
// //               <div className="space-y-3">
// //                 {getRelatedVideos().map((relatedVideo) => (
// //                   <div
// //                     key={relatedVideo.id}
// //                     className="flex cursor-pointer hover:bg-gray-900 p-2 rounded-lg transition-colors"
// //                     onClick={() => onVideoSelect(relatedVideo)}
// //                   >
// //                     <div className="relative flex-shrink-0 mr-3">
// //                       <img
// //                         src={relatedVideo.thumbnail}
// //                         alt={relatedVideo.title}
// //                         className="w-32 h-20 object-cover rounded"
// //                       />
// //                       <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded">
// //                         <Play className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
// //                       </div>
// //                     </div>
// //                     <div className="flex-1 min-w-0">
// //                       <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
// //                         {relatedVideo.title}
// //                       </h4>
// //                       <p className="text-xs text-gray-400 mb-1">
// //                         {formatViewCount(relatedVideo.viewCount)}
// //                       </p>
// //                       <p className="text-xs text-gray-500">
// //                         {formatPublishedDate(relatedVideo.publishedAt)}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // // YouTube Video Card Component
// // const YouTubeVideoCard = ({ video, onVideoSelect }) => {
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

// //   return (
// //     <motion.div
// //       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       whileHover={{ y: -5 }}
// //       onClick={() => onVideoSelect(video)}
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
// //   const [selectedVideo, setSelectedVideo] = useState(null);

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

// //   // Handle video selection
// //   const handleVideoSelect = (video) => {
// //     setSelectedVideo(video);
// //   };

// //   // Handle video close
// //   const handleVideoClose = () => {
// //     setSelectedVideo(null);
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
// //     <>
// //       <motion.div
// //         className="pt-24 pb-16 min-h-screen bg-gray-50"
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         exit={{ opacity: 0 }}
// //       >
// //         <div className="container mx-auto px-4">
// //           {/* Header */}
// //           <div className="mb-8">
// //             <motion.h1 
// //               className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
// //               initial={{ opacity: 0, y: -20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5 }}
// //             >
// //               Video Lessons
// //             </motion.h1>
// //             <motion.p
// //               className="text-gray-600 max-w-3xl"
// //               initial={{ opacity: 0, y: -20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5, delay: 0.2 }}
// //             >
// //               Watch our comprehensive video lessons for Physics, Chemistry, Biology, and more. 
// //               Filter by class and subject to find the perfect video for your studies.
// //             </motion.p>
// //           </div>

// //           {/* Search and Filters */}
// //           <div className="mb-8">
// //             <div className="flex flex-col md:flex-row gap-4 mb-4">
// //               <div className="relative flex-grow">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <Search className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <input
// //                   type="text"
// //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   placeholder="Search videos..."
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //                 />
// //               </div>
// //               <button
// //                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center md:w-auto"
// //                 onClick={() => setShowFilters(!showFilters)}
// //               >
// //                 <Filter className="h-5 w-5 mr-2" />
// //                 Filters
// //               </button>
// //             </div>

// //             {/* Filters */}
// //             {showFilters && (
// //               <motion.div 
// //                 className="bg-white p-4 rounded-md shadow-md mb-4"
// //                 initial={{ opacity: 0, height: 0 }}
// //                 animate={{ opacity: 1, height: 'auto' }}
// //                 exit={{ opacity: 0, height: 0 }}
// //                 transition={{ duration: 0.3 }}
// //               >
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <FilterDropdown 
// //                     label="Class"
// //                     options={classes.map(c => ({ value: c.toString(), label: `Class ${c}` }))}
// //                     value={activeClass?.toString() || ''}
// //                     onChange={(value) => setActiveClass(value ? parseInt(value) : null)}
// //                   />
// //                   <FilterDropdown 
// //                     label="Subject"
// //                     options={subjects.map(s => ({ 
// //                       value: s, 
// //                       label: s.charAt(0).toUpperCase() + s.slice(1)
// //                     }))}
// //                     value={activeSubject || ''}
// //                     onChange={(value) => setActiveSubject(value)}
// //                   />
// //                 </div>
// //                 <div className="mt-4 flex justify-end">
// //                   <button
// //                     className="text-blue-600 hover:text-blue-700 font-medium"
// //                     onClick={resetFilters}
// //                   >
// //                     Reset Filters
// //                   </button>
// //                 </div>
// //               </motion.div>
// //             )}
// //           </div>

// //           {/* Loading State */}
// //           {loading && (
// //             <div className="flex justify-center items-center py-12">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //               <span className="ml-4 text-gray-600">Loading videos...</span>
// //             </div>
// //           )}

// //           {/* Videos List */}
// //           {!loading && filteredVideos.length > 0 && (
// //             <div className="mb-8">
// //               <h2 className="text-xl font-semibold mb-4 text-gray-800">
// //                 {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Found
// //               </h2>
// //               <motion.div 
// //                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
// //                 variants={containerVariants}
// //                 initial="hidden"
// //                 animate="visible"
// //               >
// //                 {filteredVideos.map((video) => (
// //                   <YouTubeVideoCard 
// //                     key={video.id} 
// //                     video={video}
// //                     onVideoSelect={handleVideoSelect}
// //                   />
// //                 ))}
// //               </motion.div>
// //             </div>
// //           )}

// //           {/* No Videos Found */}
// //           {!loading && filteredVideos.length === 0 && (
// //             <div className="flex flex-col items-center justify-center py-12 text-center">
// //               <Video className="h-16 w-16 text-gray-400 mb-4" />
// //               <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
// //               <p className="text-gray-500 mb-4">
// //                 We couldn't find any videos matching your filters. Try adjusting your search or filters.
// //               </p>
// //               <button
// //                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //                 onClick={resetFilters}
// //               >
// //                 Reset Filters
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </motion.div>

// //       {/* Video Player Modal */}
// //       <AnimatePresence>
// //         {selectedVideo && (
// //           <VideoPlayer
// //             video={selectedVideo}
// //             onClose={handleVideoClose}
// //             onVideoSelect={handleVideoSelect}
// //             allVideos={videos}
// //           />
// //         )}
// //       </AnimatePresence>
// //     </>
// //   );
// // };

// // export default VideoPage;
import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Clock, Eye, Calendar, BookOpen, FlaskConical, Atom, Calculator } from 'lucide-react';

const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

const YouTubeVideoFetcher = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [initialLoad, setInitialLoad] = useState(true);

  // Auto-fetch videos when component mounts
  useEffect(() => {
    fetchVideos();
  }, []);

  const classes = [
    { id: 'all', label: 'All Classes', icon: BookOpen },
    { id: '6', label: 'Class 6', icon: BookOpen },
    { id: '7', label: 'Class 7', icon: BookOpen },
    { id: '8', label: 'Class 8', icon: BookOpen },
    { id: '9', label: 'Class 9', icon: BookOpen },
    { id: '10', label: 'Class 10', icon: BookOpen },
    { id: '11', label: 'Class 11', icon: BookOpen },
    { id: '12', label: 'Class 12', icon: BookOpen }
  ];

  const subjects = [
    { id: 'all', label: 'All Subjects', icon: BookOpen, color: 'bg-slate-500' },
    { id: 'physics', label: 'Physics', icon: Atom, color: 'bg-blue-500' },
    { id: 'chemistry', label: 'Chemistry', icon: FlaskConical, color: 'bg-green-500' },
    { id: 'biology', label: 'Biology', icon: BookOpen, color: 'bg-emerald-500' },
    { id: 'math', label: 'Mathematics', icon: Calculator, color: 'bg-purple-500' }
  ];

  const durations = [
    { id: 'all', label: 'All Durations' },
    { id: 'shorts', label: 'Shorts (< 60s)' },
    { id: 'short', label: 'Short (1-4 min)' },
    { id: 'medium', label: 'Medium (4-20 min)' },
    { id: 'long', label: 'Long (> 20 min)' }
  ];

  const contentTypes = [
    { id: 'all', label: 'All Content' },
    { id: 'videos', label: 'Regular Videos' },
    { id: 'shorts', label: 'YouTube Shorts' },
    { id: 'playlist', label: 'Playlist Videos' }
  ];

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      // Fetch additional details for each video
      const videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
      );
      
      const detailsData = await detailsResponse.json();
      
      const videosWithDetails = data.items.map(item => {
        const details = detailsData.items.find(d => d.id === item.snippet.resourceId.videoId);
        return {
          ...item,
          contentDetails: details?.contentDetails,
          statistics: details?.statistics
        };
      });
      
      setVideos(videosWithDetails);
      setFilteredVideos(videosWithDetails);
      setInitialLoad(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Error fetching videos. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] ? parseInt(match[1]) : 0);
    const minutes = (match[2] ? parseInt(match[2]) : 0);
    const seconds = (match[3] ? parseInt(match[3]) : 0);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const totalSeconds = parseDuration(duration);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDurationCategory = (duration) => {
    if (!duration) return 'unknown';
    const totalSeconds = parseDuration(duration);
    if (totalSeconds < 60) return 'shorts';
    if (totalSeconds < 240) return 'short';
    if (totalSeconds <= 1200) return 'medium';
    return 'long';
  };

  const getContentType = (video) => {
    const duration = video.contentDetails?.duration;
    if (!duration) return 'unknown';
    
    const totalSeconds = parseDuration(duration);
    const title = video.snippet.title.toLowerCase();
    const description = video.snippet.description.toLowerCase();
    
    // Check if it's a YouTube Short (< 60 seconds)
    if (totalSeconds < 60) return 'shorts';
    
    // Check if it's part of a playlist or series
    if (title.includes('playlist') || title.includes('series') || 
        description.includes('playlist') || description.includes('series') ||
        title.includes('part') || title.includes('episode')) {
      return 'playlist';
    }
    
    return 'videos';
  };

  const detectSubjectAndClass = (title, description) => {
    const text = (title + ' ' + description).toLowerCase();
    
    // Subject detection
    let subject = 'general';
    if (text.includes('physics') || text.includes('mechanics') || text.includes('thermodynamics') || text.includes('optics')) {
      subject = 'physics';
    } else if (text.includes('chemistry') || text.includes('chemical') || text.includes('organic') || text.includes('inorganic')) {
      subject = 'chemistry';
    } else if (text.includes('biology') || text.includes('botany') || text.includes('zoology') || text.includes('genetics')) {
      subject = 'biology';
    } else if (text.includes('math') || text.includes('algebra') || text.includes('geometry') || text.includes('calculus') || text.includes('trigonometry')) {
      subject = 'math';
    }
    
    // Class detection
    let detectedClass = null;
    for (let i = 6; i <= 12; i++) {
      if (text.includes(`class ${i}`) || text.includes(`grade ${i}`) || text.includes(`${i}th class`) || text.includes(`std ${i}`)) {
        detectedClass = i.toString();
        break;
      }
    }
    
    return { subject, class: detectedClass };
  };

  const filterVideos = () => {
    let filtered = videos.filter(video => {
      const title = video.snippet.title.toLowerCase();
      const description = video.snippet.description.toLowerCase();
      const { subject, class: videoClass } = detectSubjectAndClass(title, description);
      
      // Search term filter
      if (searchTerm && !title.includes(searchTerm.toLowerCase()) && !description.includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Class filter
      if (selectedClass !== 'all' && videoClass !== selectedClass) {
        return false;
      }
      
      // Subject filter
      if (selectedSubject !== 'all' && subject !== selectedSubject) {
        return false;
      }
      
      // Duration filter
      if (selectedDuration !== 'all') {
        const durationCategory = getDurationCategory(video.contentDetails?.duration);
        if (durationCategory !== selectedDuration) {
          return false;
        }
      }
      
      // Content type filter
      if (selectedContentType !== 'all') {
        const contentType = getContentType(video);
        if (contentType !== selectedContentType) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredVideos(filtered);
  };

  useEffect(() => {
    if (videos.length > 0) {
      filterVideos();
    }
  }, [searchTerm, selectedClass, selectedSubject, selectedDuration, selectedContentType, videos]);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'physics': return Atom;
      case 'chemistry': return FlaskConical;
      case 'biology': return BookOpen;
      case 'math': return Calculator;
      default: return BookOpen;
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'physics': return 'bg-blue-500';
      case 'chemistry': return 'bg-green-500';
      case 'biology': return 'bg-emerald-500';
      case 'math': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            Educational Video Hub
          </h1>
          <p className="text-xl text-gray-600 drop-shadow-sm">
            Discover Physics, Chemistry, Biology & Math videos for Classes 6-12
          </p>
        </div>

        {/* Search and Fetch Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={fetchVideos}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                'Fetch Videos'
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
          </div>
          
          <div className="space-y-6">
            {/* Class Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Class</h4>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedClass === cls.id
                        ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Subject</h4>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => {
                  const Icon = subject.icon;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedSubject === subject.id
                          ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {subject.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Duration</h4>
              <div className="flex flex-wrap gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedDuration === duration.id
                        ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Content Type</h4>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedContentType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedContentType === type.id
                        ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {videos.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {filteredVideos.length}
              </div>
              <div className="text-gray-600">
                {filteredVideos.length === 1 ? 'Video Found' : 'Videos Found'}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl">Fetching educational videos...</p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const { subject, class: videoClass } = detectSubjectAndClass(
                video.snippet.title,
                video.snippet.description
              );
              const SubjectIcon = getSubjectIcon(subject);
              
              return (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`, '_blank')}
                >
                  <div className="relative">
                    <img
                      src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url}
                      alt={video.snippet.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                    
                    {video.contentDetails?.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                        {formatDuration(video.contentDetails.duration)}
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                      <div className={`${getSubjectColor(subject)} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                        <SubjectIcon className="w-3 h-3" />
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </div>
                      {videoClass && (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Class {videoClass}
                        </div>
                      )}
                      {(() => {
                        const contentType = getContentType(video);
                        const durationCategory = getDurationCategory(video.contentDetails?.duration);
                        
                        if (contentType === 'shorts' || durationCategory === 'shorts') {
                          return (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Short
                            </div>
                          );
                        }
                        
                        if (contentType === 'playlist') {
                          return (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Playlist
                            </div>
                          );
                        }
                        
                        return null;
                      })()}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {video.snippet.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {video.snippet.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        {video.statistics?.viewCount && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(video.statistics.viewCount)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(video.snippet.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && videos.length > 0 && filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && !initialLoad && (
          <div className="text-center py-16">
            <Play className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Ready to explore?</h3>
            <p className="text-gray-600 mb-6">Click "Fetch Videos" to load educational content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeVideoFetcher;