import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, BookOpen, Youtube, Target, Heart } from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Physics Educator',
      bio: 'Ph.D in Physics with 15 years of teaching experience. Specializes in making complex physics concepts easy to understand.',
      imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Chemistry Educator',
      bio: 'Ph.D in Chemistry with expertise in organic chemistry. Passionate about creating engaging chemistry experiments.',
      imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Dr. Anand Patel',
      role: 'Biology Educator',
      bio: 'Ph.D in Biology with a focus on molecular biology. Makes biology fun and relatable through real-world examples.',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const achievements = [
    {
      title: '10,000+',
      subtitle: 'Students',
      icon: <BookOpen className="h-8 w-8 text-primary-500" />
    },
    {
      title: '500+',
      subtitle: 'Video Lessons',
      icon: <Youtube className="h-8 w-8 text-primary-500" />
    },
    {
      title: '95%',
      subtitle: 'Success Rate',
      icon: <Target className="h-8 w-8 text-primary-500" />
    },
    {
      title: '1000+',
      subtitle: '5-Star Reviews',
      icon: <Star className="h-8 w-8 text-primary-500" />
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our teaching and content creation.',
      icon: <Award className="h-6 w-6 text-primary-500" />
    },
    {
      title: 'Simplicity',
      description: 'We believe in making complex scientific concepts simple and accessible to all students.',
      icon: <BookOpen className="h-6 w-6 text-primary-500" />
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate our teaching methods to keep learning engaging and effective.',
      icon: <Target className="h-6 w-6 text-primary-500" />
    },
    {
      title: 'Compassion',
      description: 'We approach education with compassion, understanding each student\'s unique learning journey.',
      icon: <Heart className="h-6 w-6 text-primary-500" />
    }
  ];

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
    <motion.div
      className="pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="bg-primary-50 py-16 mb-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About PCMB with Malika
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Empowering students with quality science education since 2018
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
               PCMB with Malika was founded by a team of passionate educators with a mission to make quality science education accessible to all students across India. What started as a small YouTube channel has now grown into a comprehensive educational platform serving thousands of students.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that every student has the potential to excel in science subjects when provided with the right guidance and resources. Our teaching methodology focuses on building strong fundamentals and critical thinking skills rather than rote memorization.
              </p>
              <p className="text-gray-600">
                Over the years, we have helped thousands of students improve their understanding of Physics, Chemistry, and Biology, leading to better academic performance and a genuine interest in science.
              </p>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Students learning"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Mission & Vision
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-primary-600">Our Mission</h3>
              <p className="text-gray-600">
PCMB with Malika is an innovative online education platform dedicated to delivering high-quality learning in #physics, #chemistry, #biology, and #science for students preparing for #NEET, #JEEMains, and those in #Class6, #Class7, #Class8, #Class9, #Class10, #Class11, and #Class12. Our mission is to inspire students to embrace the CAS rule (Clarity, Accuracy, Simplicity) while fostering a deep understanding of concepts without relying on rote memorization. We specialize in clarifying doubts related to #MCQs, #MCQChemistry, #ImportantMCQs, and #MCQPractice, ensuring effective learning. Additionally, we keep students informed with the latest updates on CBSE and State Board news. #MalikaMam #ScienceWithMalikaMam #NEET #MedicalStudent
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-primary-600">Our Vision</h3>
              <p className="text-gray-600">
                To become the leading educational platform for science subjects in India, fostering a generation of students who approach science with curiosity, critical thinking, and a problem-solving mindset.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 J
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              These core values guide everything we do at MHS Guruk.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div 
                key={value.title}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Meet Our Educators
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our team of expert educators who are passionate about teaching and making science accessible to all.
            </motion.p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div 
                key={member.name}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={itemVariants}
              >
                <img 
                  src={member.imageUrl} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Achievements
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={achievement.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-3xl font-bold mb-1">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Join Our Educational Journey
            </motion.h2>
            <motion.p
              className="text-xl text-primary-100 mb-8"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Start learning with PCMB with Malika today and unlock your full potential in science subjects.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a 
                href="https://www.youtube.com/@PCMB_with_Malika" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium inline-flex items-center"
              >
                <Youtube size={20} className="mr-2" />
                Subscribe to Our Channel
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;