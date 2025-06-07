import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog, featured }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (featured) {
    return (
      <motion.div
        className="card overflow-hidden"
        variants={cardVariants}
        whileHover={{ y: -5 }}
      >
        <div className="md:flex">
          <div className="md:w-2/5 h-48 md:h-auto">
            <img 
              src={blog.imageUrl} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-3/5">
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.categories.map((category, index) => (
                <span 
                  key={index}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700"
                >
                  {category}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
            <div className="flex items-center text-gray-500 text-xs mb-4">
              <div className="flex items-center mr-4">
                <User size={12} className="mr-1" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                {blog.date}
              </div>
            </div>
            <a 
              href={`/blog/${blog.id}`} 
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              Read More <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card overflow-hidden"
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={blog.imageUrl} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.categories.map((category, index) => (
            <span 
              key={index}
              className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700"
            >
              {category}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
        <div className="flex items-center text-gray-500 text-xs mb-4">
          <div className="flex items-center mr-4">
            <User size={12} className="mr-1" />
            {blog.author}
          </div>
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            {blog.date}
          </div>
        </div>
        <a 
          href={`/blog/${blog.id}`} 
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </motion.div>
  );
};

export default BlogCard;