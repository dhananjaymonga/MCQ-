import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Video, ArrowRight } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="pt-28 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-physics-dark opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-chemistry-dark opacity-20"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-biology-dark opacity-20"
          animate={{ 
            x: [0, 30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Mastering <span className="text-physics-light">Science</span> Made <span className="text-biology-light">Simple</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Comprehensive learning resources for Physics, Chemistry, and Biology for classes 6 to 12. Expertly crafted by MHS Guruk.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Link 
                to="/notes" 
                className="btn-primary px-6 py-3 rounded-full"
              >
                <BookOpen size={18} className="mr-2" />
                Explore Notes
              </Link>
              <Link 
                to="/videos" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-full inline-flex items-center font-medium transition-colors"
              >
                <Video size={18} className="mr-2" />
                Watch Videos
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              <div className="w-full h-full rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 p-1">
                <div className="bg-gradient-to-br from-physics-dark to-biology-dark rounded-lg aspect-video flex items-center justify-center overflow-hidden relative">
                  {/* Background science icons/illustrations would go here */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <motion.div 
                      className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={32} className="text-white ml-1" />
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-physics-light text-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <BookOpen size={24} />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-chemistry-light text-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  duration: 3.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              >
                <BookOpen size={24} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;