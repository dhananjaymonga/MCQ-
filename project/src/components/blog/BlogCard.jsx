// import React from 'react';
// import { motion } from 'framer-motion';
// import { Calendar, User, ArrowRight } from 'lucide-react';

// const BlogCard = ({ blog, featured }) => {
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
//   };

//   if (featured) {
//     return (
//       <motion.div
//         className="card overflow-hidden"
//         variants={cardVariants}
//         whileHover={{ y: -5 }}
//       >
//         <div className="md:flex">
//           <div className="md:w-2/5 h-48 md:h-auto">
//             <img 
//               src={blog.imageUrl} 
//               alt={blog.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="p-6 md:w-3/5">
//             <div className="flex flex-wrap gap-2 mb-3">
//               {blog.categories.map((category, index) => (
//                 <span 
//                   key={index}
//                   className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700"
//                 >
//                   {category}
//                 </span>
//               ))}
//             </div>
//             <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
//             <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
//             <div className="flex items-center text-gray-500 text-xs mb-4">
//               <div className="flex items-center mr-4">
//                 <User size={12} className="mr-1" />
//                 {blog.author}
//               </div>
//               <div className="flex items-center">
//                 <Calendar size={12} className="mr-1" />
//                 {blog.date}
//               </div>
//             </div>
//             <a 
//               href={`/blog/${blog.id}`} 
//               className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
//             >
//               Read More <ArrowRight size={16} className="ml-1" />
//             </a>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       className="card overflow-hidden"
//       variants={cardVariants}
//       whileHover={{ y: -5 }}
//     >
//       <div className="h-48 overflow-hidden">
//         <img 
//           src={blog.imageUrl} 
//           alt={blog.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-6">
//         <div className="flex flex-wrap gap-2 mb-3">
//           {blog.categories.map((category, index) => (
//             <span 
//               key={index}
//               className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700"
//             >
//               {category}
//             </span>
//           ))}
//         </div>
//         <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
//         <div className="flex items-center text-gray-500 text-xs mb-4">
//           <div className="flex items-center mr-4">
//             <User size={12} className="mr-1" />
//             {blog.author}
//           </div>
//           <div className="flex items-center">
//             <Calendar size={12} className="mr-1" />
//             {blog.date}
//           </div>
//         </div>
//         <a 
//           href={`/blog/${blog.id}`} 
//           className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
//         >
//           Read More <ArrowRight size={16} className="ml-1" />
//         </a>
//       </div>
//     </motion.div>
//   );
// };

// export default BlogCard;
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const BlogCard = ({ blog, featured }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Truncate description for excerpt
  const getExcerpt = (description, maxLength = 150) => {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...'
      : description;
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
              src={blog.image || '/placeholder-image.jpg'} 
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          <div className="p-6 md:w-3/5">
            {/* Category Tag */}
            {blog.category && (
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                  {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                </span>
              </div>
            )}
            
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {getExcerpt(blog.description, 120)}
            </p>
            
            <div className="flex items-center text-gray-500 text-xs mb-4 flex-wrap gap-4">
              <div className="flex items-center">
                <User size={12} className="mr-1" />
                {blog.author || 'Anonymous'}
              </div>
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                {formatDate(blog.date || blog.createdAt)}
              </div>
              {blog.timeToRead && (
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {blog.timeToRead} min read
                </div>
              )}
            </div>
            
            <a 
              href={`/blog/${blog._id}`} 
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center transition-colors duration-200"
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
          src={blog.image || '/placeholder-image.jpg'} 
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      <div className="p-6">
        {/* Category Tag */}
        {blog.category && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700">
              {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
            </span>
          </div>
        )}
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {blog.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                +{blog.tags.length - 2}
              </span>
            )}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getExcerpt(blog.description)}
        </p>
        
        <div className="flex items-center text-gray-500 text-xs mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <User size={12} className="mr-1" />
            {blog.author || 'Anonymous'}
          </div>
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            {formatDate(blog.date || blog.createdAt)}
          </div>
          {blog.timeToRead && (
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              {blog.timeToRead} min read
            </div>
          )}
        </div>
        
        <a 
          href={`/blog/${blog._id}`} 
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center transition-colors duration-200"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </motion.div>
  );
};

export default BlogCard;