
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Video, Play, Clock, Eye, X, ThumbsUp, Share2, Download, MoreHorizontal, ArrowLeft, ArrowUp, ArrowDown, Volume2, VolumeX, Heart, MessageCircle, Bookmark, Send } from 'lucide-react';

// YouTube API configuration
const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

// Shorts Player Component
const ShortsPlayer = ({ shorts, currentIndex, onClose, onNext, onPrevious }) => {
  const [muted, setMuted] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const videoRef = useRef(null);

  const currentShort = shorts[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActions(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleVideoClick = () => {
    setShowActions(!showActions);
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!currentShort) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative h-full w-full">
        {/* Video Container */}
        <div className="relative h-full w-full flex items-center justify-center">
          <div 
            className="relative h-full max-w-md w-full bg-black cursor-pointer"
            onClick={handleVideoClick}
          >
            {/* Video Player */}
            <iframe
              ref={videoRef}
              src={`https://www.youtube.com/embed/${currentShort.id}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${currentShort.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            
            {/* Top Controls */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <button
                    onClick={onClose}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div className="text-white text-sm font-medium">
                    {currentIndex + 1} / {shorts.length}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {currentShort.title}
                </h3>
                <p className="text-sm opacity-80 line-clamp-2">
                  {currentShort.description}
                </p>
                <div className="flex items-center mt-2 text-xs opacity-70">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{formatViewCount(currentShort.viewCount)} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
              <Heart className="h-6 w-6" />
            </button>
            <div className="text-center">
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                <MessageCircle className="h-6 w-6" />
              </button>
              <span className="block text-xs text-white mt-1">125</span>
            </div>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
              <Bookmark className="h-6 w-6" />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="h-6 w-6" />
            </button>
            <button 
              onClick={handleMuteToggle}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
            {currentIndex > 0 && (
              <button
                onClick={onPrevious}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            )}
            {currentIndex < shorts.length - 1 && (
              <button
                onClick={onNext}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Shorts Grid Component
const ShortsGrid = ({ shorts, onShortsSelect }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shorts</h2>
        <div className="text-sm text-gray-500">
          {shorts.length} shorts available
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {shorts.map((short, index) => (
          <motion.div
            key={short.id}
            className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => onShortsSelect(index)}
          >
            <img
              src={short.thumbnail}
              alt={short.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Duration */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              <Clock className="h-3 w-3 inline mr-1" />
              0:60
            </div>

            {/* Views */}
            <div className="absolute bottom-2 left-2 flex items-center text-white text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {short.viewCount >= 1000000 
                ? `${(short.viewCount / 1000000).toFixed(1)}M`
                : short.viewCount >= 1000 
                ? `${(short.viewCount / 1000).toFixed(1)}K`
                : short.viewCount}
            </div>

            {/* Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
              <h3 className="text-white text-sm font-medium line-clamp-2">
                {short.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// YouTube Video Player Component
const VideoPlayer = ({ video, onClose, onVideoSelect, allVideos }) => {
  const [showDescription, setShowDescription] = useState(false);
  
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
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRelatedVideos = () => {
    return allVideos
      .filter(v => v.id !== video.id)
      .filter(v => v.subject === video.subject || v.class === video.class)
      .slice(0, 10);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-90">
          <button
            onClick={onClose}
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Videos
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Section */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Video Info */}
              <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">
                  {video.title}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center text-gray-300 text-sm mb-2 md:mb-0">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="mr-4">{formatViewCount(video.viewCount)}</span>
                    <span>{formatPublishedDate(video.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{video.likeCount ? `${video.likeCount}` : 'Like'}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Save</span>
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">Description</h3>
                    <button
                      onClick={() => setShowDescription(!showDescription)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {showDescription ? 'Show less' : 'Show more'}
                    </button>
                  </div>
                  <p className={`text-gray-300 text-sm leading-relaxed ${
                    showDescription ? '' : 'line-clamp-3'
                  }`}>
                    {video.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Related Videos</h3>
              <div className="space-y-3">
                {getRelatedVideos().map((relatedVideo) => (
                  <div
                    key={relatedVideo.id}
                    className="flex cursor-pointer hover:bg-gray-900 p-2 rounded-lg transition-colors"
                    onClick={() => onVideoSelect(relatedVideo)}
                  >
                    <div className="relative flex-shrink-0 mr-3">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-32 h-20 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded">
                        <Play className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-400 mb-1">
                        {formatViewCount(relatedVideo.viewCount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPublishedDate(relatedVideo.publishedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// YouTube Video Card Component
const YouTubeVideoCard = ({ video, onVideoSelect }) => {
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

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onVideoSelect(video)}
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

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'shorts', label: 'Shorts', icon: Play }
  ];

  return (
    <div className="flex border-b border-gray-200 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};