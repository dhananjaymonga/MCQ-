import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SubjectCard = ({ subject, index }) => {
  return (
    <motion.div 
      className={`card hover:border-${subject.color}-light border-2 border-transparent`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className={`p-6`}>
        <div className="mb-4">
          {subject.icon}
        </div>
        <h3 className={`text-xl font-semibold mb-2 text-${subject.color}-dark`}>{subject.title}</h3>
        <p className="text-gray-600 mb-4">{subject.description}</p>
        <Link 
          to={subject.link} 
          className={`text-${subject.color}-DEFAULT font-medium inline-flex items-center hover:text-${subject.color}-dark`}
        >
          Explore {subject.title} <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default SubjectCard;