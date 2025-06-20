import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FilePen, HeartHandshake, ChevronRight, PlayCircle, Users, Star } from 'lucide-react';

import Hero from '../components/blog/home/Hero';
import SubjectCard from '../components/blog/home/SubjectCard';
import TestimonialCard from '../components/blog/home/TestimonialCard';

const HomePage = () => {
  const subjects = [
    {
      title: 'Physics',
      description: 'Master the fundamental laws that govern the universe, from mechanics to quantum physics.',
      icon: <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1 }} className="bg-physics-light p-3 rounded-full"><BookOpen className="h-8 w-8 text-white" /></motion.div>,
      color: 'physics',
      link: '/notes?subject=physics'
    },
    {
      title: 'Chemistry',
      description: 'Explore the composition, structure, and properties of matter and the changes it undergoes.',
      icon: <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1 }} className="bg-chemistry-light p-3 rounded-full"><BookOpen className="h-8 w-8 text-white" /></motion.div>,
      color: 'chemistry',
      link: '/notes?subject=chemistry'
    },
    {
      title: 'Biology',
      description: 'Discover the science of life, from cellular structures to complex ecosystems and human physiology.',
      icon: <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1 }} className="bg-biology-light p-3 rounded-full"><BookOpen className="h-8 w-8 text-white" /></motion.div>,
      color: 'biology',
      link: '/notes?subject=biology'
    }
  ];

  const features = [
    {
      title: 'Video Lessons',
      description: 'Engaging, animated video lessons that break down complex topics into easy-to-understand concepts.',
      icon: <Video className="h-6 w-6 text-primary-500" />,
      link: '/videos'
    },
    {
      title: 'Comprehensive Notes',
      description: 'Detailed, well-structured notes that cover all NCERT topics and beyond for classes 6 to 12.',
      icon: <FilePen className="h-6 w-6 text-primary-500" />,
      link: '/notes'
    },
    {
      title: 'Doubt Solving',
      description: 'Get your doubts resolved through our dedicated doubt-solving sessions and community.',
      icon: <HeartHandshake className="h-6 w-6 text-primary-500" />,
      link: '/services'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Class 12 Student',
      content: 'MHS Guruk helped me understand difficult Physics concepts that I was struggling with. The video explanations are clear and concise.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Rahul Patel',
      role: 'Class 10 Student',
      content: 'The Chemistry notes are excellent and the practice questions really helped me prepare for my board exams. I improved my grade from C to A!',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Neha Singh',
      role: 'Parent',
      content: 'As a parent, I appreciate the structured approach to teaching. My daughter loves the Biology lessons and it has sparked her interest in medicine.',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const stats = [
    { label: 'Students Helped', value: '10,000+', icon: <Users className="h-6 w-6 text-primary-500" /> },
    { label: 'Video Lessons', value: '500+', icon: <Video className="h-6 w-6 text-primary-500" /> },
    { label: 'Years Experience', value: '5+', icon: <Star className="h-6 w-6 text-primary-500" /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <Hero />

      {/* Subjects Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Explore Our Subjects
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Comprehensive coverage of NCERT curriculum for classes 6 to 12
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <SubjectCard 
                key={subject.title}
                subject={subject}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What We Offer
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              A complete learning ecosystem to help you excel in your science subjects
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link to={feature.link} className="text-primary-600 font-medium inline-flex items-center hover:text-primary-700">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Visit Our YouTube Channel
              </motion.h2>
              <motion.p 
                className="text-primary-100 mb-6 max-w-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Subscribe to our YouTube channel for regular updates, live classes, and exclusive content to boost your learning journey.
              </motion.p>
              <motion.a 
                href="https://www.youtube.com/@PCMB_with_Malika" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <PlayCircle size={20} className="mr-2" />
                Watch Now
              </motion.a>
            </div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-72 h-48 sm:w-96 sm:h-64 bg-gray-800 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={64} className="text-white opacity-80" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What Our Students Say
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Hear from students who have improved their grades and understanding with MHS Guruk
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;