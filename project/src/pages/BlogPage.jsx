import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';

import BlogCard from '../components/blog/BlogCard';
import FilterDropdown from '../components/notes/FilterDropdown';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(response.data);
        setFilteredBlogs(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get unique categories from blogs
  const categories = [...new Set(blogs.map(blog => blog.category?.toLowerCase()).filter(Boolean))];

  useEffect(() => {
    let result = blogs;

    // Filter by category
    if (activeCategory) {
      result = result.filter(blog => 
        blog.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title?.toLowerCase().includes(query) || 
        blog.description?.toLowerCase().includes(query) ||
        blog.author?.toLowerCase().includes(query) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredBlogs(result);
  }, [activeCategory, searchQuery, blogs]);

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory(null);
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

  // Featured blogs (you can add a featured field to your blog schema)
  const featuredBlogs = blogs.filter(blog => blog.featured);

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Blogs</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
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
            Educational Blog
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-3xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our educational articles, study tips, and insights on Physics, Chemistry, and Biology.
          </motion.p>
        </div>

        {/* Featured Articles */}
        {featuredBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredBlogs.slice(0, 2).map((blog) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog}
                  featured={true}
                />
              ))}
            </div>
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
                placeholder="Search articles by title, description, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn-outline md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Categories
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
              <div>
                <FilterDropdown 
                  label="Category"
                  options={categories.map(c => ({ 
                    value: c, 
                    label: c.charAt(0).toUpperCase() + c.slice(1)
                  }))}
                  value={activeCategory || ''}
                  onChange={(value) => setActiveCategory(value)}
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

        {/* Blog Count */}
        {blogs.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredBlogs.length} of {blogs.length} articles
            </p>
            {(activeCategory || searchQuery) && (
              <button
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                onClick={resetFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Blog List */}
        {filteredBlogs.length > 0 ? (
          <div className="mb-8">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs
                .filter(blog => !featuredBlogs.slice(0, 2).some(featured => featured._id === blog._id))
                .map((blog) => (
                  <BlogCard 
                    key={blog._id} 
                    blog={blog}
                    featured={false}
                  />
                ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || activeCategory 
                ? "We couldn't find any articles matching your filters. Try adjusting your search or filters."
                : "No articles have been published yet."
              }
            </p>
            <button
              className="btn-primary"
              onClick={resetFilters}
            >
              {searchQuery || activeCategory ? 'Reset Filters' : 'Refresh'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;