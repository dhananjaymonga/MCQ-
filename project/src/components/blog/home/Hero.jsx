import React, { useState, useEffect } from 'react';
import { BookOpen, Video, Play, Atom, Dna, Zap, Youtube, Calendar, Eye, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const Hero = () => {
  const [latestVideo, setLatestVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSubject, setActiveSubject] = useState('physics');
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [subjectVideos, setSubjectVideos] = useState({});

  const API_KEY = "AIzaSyBKhtL5_3QiPQxzhd60smT6UFZltLqyZBM";
  const CHANNEL_ID = 'UCe_4EwNFWnGMMymUqRcDP7A';
  const UPLOADS_PLAYLIST_ID = 'UUe_4EwNFWnGMMymUqRcDP7A';

  const subjects = {
    physics: {
      color: 'from-blue-500 to-purple-600',
      icon: Zap,
      title: 'Physics',
      description: 'Explore the fundamental laws of nature',
      keywords: ['physics', 'mechanics', 'electricity', 'magnetism', 'waves', 'motion', 'force', 'energy']
    },
    chemistry: {
      color: 'from-red-500 to-orange-600',
      icon: Atom,
      title: 'Chemistry',
      description: 'Discover molecular interactions',
      keywords: ['chemistry', 'organic', 'inorganic', 'reaction', 'molecule', 'compound', 'element', 'acid', 'base']
    },
    biology: {
      color: 'from-green-500 to-teal-600',
      icon: Dna,
      title: 'Biology',
      description: 'Understanding living organisms',
      keywords: ['biology', 'cell', 'genetics', 'evolution', 'ecosystem', 'plant', 'animal', 'dna', 'protein']
    }
  };

  // Fetch videos from YouTube
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // Get recent videos from uploads playlist
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=20&order=date&key=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
          
          // Get video statistics and details
          const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`
          );
          
          const statsData = await statsResponse.json();
          
          const videosWithStats = data.items.map(item => {
            const videoId = item.snippet.resourceId.videoId;
            const stats = statsData.items.find(stat => stat.id === videoId);
            
            return {
              id: videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
              publishedAt: item.snippet.publishedAt,
              channelTitle: item.snippet.channelTitle,
              viewCount: stats?.statistics.viewCount || '0',
              likeCount: stats?.statistics.likeCount || '0',
              duration: stats?.contentDetails.duration || 'PT0S'
            };
          });
          
          // Categorize videos by subject
          const categorizedVideos = {
            physics: [],
            chemistry: [],
            biology: []
          };
          
          videosWithStats.forEach(video => {
            const subject = getSubjectFromTitle(video.title);
            categorizedVideos[subject].push(video);
          });
          
          setSubjectVideos(categorizedVideos);
          setLatestVideo(videosWithStats[0]);
          setSelectedVideoId(videosWithStats[0].id);
          setRelatedVideos(categorizedVideos[activeSubject].slice(0, 5));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError(err.message);
        // Set mock data for demonstration
        const mockVideo = {
          id: 'dQw4w9WgXcQ',
          title: 'Physics: Laws of Motion Explained',
          description: 'Understanding Newton\'s laws of motion with examples',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          publishedAt: '2024-01-15T10:00:00Z',
          channelTitle: 'PCMB with Malika',
          viewCount: '12500',
          likeCount: '450',
          duration: 'PT10M30S'
        };
        setLatestVideo(mockVideo);
        setSelectedVideoId(mockVideo.id);
        setRelatedVideos([mockVideo]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    
    // Set up daily refresh
    const interval = setInterval(fetchVideos, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Update related videos when subject changes
  useEffect(() => {
    if (subjectVideos[activeSubject] && subjectVideos[activeSubject].length > 0) {
      setRelatedVideos(subjectVideos[activeSubject].slice(0, 5));
      if (!subjectVideos[activeSubject].find(v => v.id === selectedVideoId)) {
        const firstVideo = subjectVideos[activeSubject][0];
        setLatestVideo(firstVideo);
        setSelectedVideoId(firstVideo.id);
        setIsPlaying(false);
      }
    }
  }, [activeSubject, subjectVideos]);

  const formatViewCount = (viewCount) => {
    const num = parseInt(viewCount);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSubjectFromTitle = (title) => {
    const titleLower = title.toLowerCase();
    for (const [key, subject] of Object.entries(subjects)) {
      if (subject.keywords.some(keyword => titleLower.includes(keyword))) {
        return key;
      }
    }
    return 'physics'; // default
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectVideo = (video) => {
    setLatestVideo(video);
    setSelectedVideoId(video.id);
    setIsPlaying(false);
  };

  const handleSubjectChange = (subject) => {
    setActiveSubject(subject);
    setIsPlaying(false);
  };

  return (
    <section className="pt-28 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-500 opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-red-500 opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-green-500 opacity-10 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Mastering <span className="text-blue-400">Science</span> Made <span className="text-green-400">Simple</span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Comprehensive learning resources for Physics, Chemistry, and Biology for classes 6 to 12. Expertly crafted by PCMB with Malika
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full inline-flex items-center font-medium transition-all duration-300 transform hover:scale-105">
                <BookOpen size={18} className="mr-2" />
                Explore Notes
              </button>
              <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full inline-flex items-center font-medium transition-all duration-300 transform hover:scale-105">
                <Video size={18} className="mr-2" />
                Watch Videos
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Subject Selector Buttons - Moved to top */}
              <div className="flex justify-center mb-6 space-x-4">
                {Object.entries(subjects).map(([key, subject]) => (
                  <button
                    key={key}
                    onClick={() => handleSubjectChange(key)}
                    className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      activeSubject === key 
                        ? `bg-gradient-to-r ${subject.color} text-white shadow-lg scale-110` 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    title={subject.title}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {React.createElement(subject.icon, { size: 24 })}
                      <span className="text-xs font-medium">{subject.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* YouTube Video Player Container */}
              <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl bg-black">
                {loading ? (
                  <div className="bg-gray-700 h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                ) : error ? (
                  <div className={`bg-gradient-to-br ${subjects[activeSubject].color} h-full flex items-center justify-center`}>
                    <div className="text-center">
                      <Youtube size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-white text-sm">Unable to load video</p>
                      <p className="text-white text-xs opacity-75 mt-1">Using demo content</p>
                    </div>
                  </div>
                ) : latestVideo ? (
                  <div className="relative h-full">
                    {/* Embedded YouTube Player */}
                    {isPlaying && selectedVideoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={latestVideo.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <img 
                          src={latestVideo.thumbnail} 
                          alt={latestVideo.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <button 
                            onClick={togglePlay}
                            className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
                          >
                            <Play size={28} className="text-white ml-1" fill="white" />
                          </button>
                        </div>

                        {/* Duration Badge */}
                        {latestVideo.duration && (
                          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium">
                            {formatDuration(latestVideo.duration)}
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Video Info Overlay (when not playing) */}
                    {!isPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                          {latestVideo.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye size={12} />
                              <span>{formatViewCount(latestVideo.viewCount)} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} />
                              <span>{formatDate(latestVideo.publishedAt)}</span>
                            </div>
                          </div>
                          <Youtube size={16} className="text-red-500" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              
              {/* Related Videos Grid */}
              {relatedVideos.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
                    <Video size={16} className="mr-2" />
                    {subjects[activeSubject].title} Videos
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {relatedVideos.map((video, index) => (
                      <button
                        key={video.id}
                        onClick={() => selectVideo(video)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 group ${
                          selectedVideoId === video.id 
                            ? 'border-red-500 scale-105' 
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        title={video.title}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                          <Play size={16} className="text-white" fill="white" />
                        </div>
                        
                        {/* Video number */}
                        <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs rounded px-1.5 py-0.5">
                          {index + 1}
                        </div>
                        
                        {/* Duration */}
                        {video.duration && (
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs rounded px-1">
                            {formatDuration(video.duration)}
                          </div>
                        )}
                        
                        {/* Views count */}
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs rounded px-1">
                          {formatViewCount(video.viewCount)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Live Badge */}
              {latestVideo && (
                <div className="absolute -top-2 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LATEST</span>
                </div>
              )}
              
              {/* Floating Achievement Cards */}
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg animate-bounce">
                <BookOpen size={24} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-red-600 text-white p-3 rounded-lg shadow-lg" style={{animation: 'bounce 2s infinite 0.5s'}}>
                <Youtube size={24} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-red-600">
                  HD
                </div>
              </div>
              
              {/* Auto-refresh indicator */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full px-3 py-1">
                <div className="flex items-center space-x-2 text-xs text-white">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Daily updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;