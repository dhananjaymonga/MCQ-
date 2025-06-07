import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <div className={`w-12 h-12 rounded-lg bg-${service.color}-DEFAULT flex items-center justify-center mb-4`}>
          {service.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-6">{service.description}</p>
        
        <h4 className="text-sm font-semibold uppercase text-gray-500 mb-3">Features</h4>
        <ul className="space-y-2">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check size={16} className={`text-${service.color}-DEFAULT mt-1 mr-2 flex-shrink-0`} />
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ServiceCard;