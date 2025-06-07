import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';

const VideoCard = ({ video }) => {
  const getSubjectColor = (subject) => {
    switch (subject.toLowerCase()) {
      case 'physics':
        return 'physics';
      case 'chemistry':
        return 'chemistry';
      case 'biology':
        return 'biology';
      default:
        return 'gray';
    }
  };

  const subjectColor = getSubjectColor(video.subject);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="card overflow-hidden"
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <motion.div
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={20} className="text-primary-600 ml-1" />
          </motion.div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded-md flex items-center">
          <Clock size={12} className="mr-1" />
          {video.duration}
        </div>
        <div className={`absolute top-2 left-2 bg-${subjectColor}-DEFAULT text-white text-xs py-1 px-2 rounded-md`}>
          {video.subject}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Class {video.class}</span>
          <span className="text-xs text-gray-500">{video.date}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{video.description}</p>
        
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-${subjectColor}-DEFAULT hover:text-${subjectColor}-dark font-medium text-sm inline-flex items-center`}
        >
          Watch on YouTube
          <Play size={14} className="ml-1" />
        </a>
      </div>
    </motion.div>
  );
};

export default VideoCard;