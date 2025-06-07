import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, MessageCircle, Users, Calendar, Check } from 'lucide-react';
import ServiceCard from '../components/services/ServiceCard';

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      title: 'Doubt Solving Sessions',
      description: 'Get your doubts and questions resolved through dedicated one-on-one sessions with our expert teachers.',
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      color: 'physics',
      features: [
        'Personalized attention to your specific questions',
        'Flexible scheduling options',
        'Coverage of all topics from classes 6 to 12',
        'Detailed explanations with visual aids',
        'Follow-up materials and practice questions'
      ]
    },
    {
      id: 2,
      title: 'Personal Mentoring',
      description: 'Receive guidance and mentorship from experienced educators to help you achieve your academic goals.',
      icon: <HeartHandshake className="h-6 w-6 text-white" />,
      color: 'chemistry',
      features: [
        'Academic goal setting and planning',
        'Regular progress tracking and feedback',
        'Study strategy and time management advice',
        'Exam preparation guidance',
        'Career counseling and subject specialization advice'
      ]
    },
    {
      id: 3,
      title: 'Group Study Sessions',
      description: 'Join our interactive group study sessions to learn collaboratively and benefit from peer discussions.',
      icon: <Users className="h-6 w-6 text-white" />,
      color: 'biology',
      features: [
        'Topic-focused group discussions',
        'Collaborative problem-solving activities',
        'Peer learning opportunities',
        'Weekly scheduled sessions',
        'Moderated by expert teachers'
      ]
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Aditya Sharma',
      role: 'Class 12 Student',
      content: 'The doubt solving sessions helped me overcome my fear of complex physics problems. The teachers explain everything so clearly!',
      imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'Meera Patel',
      role: 'Class 10 Student',
      content: 'The personal mentoring service helped me improve my grades significantly. My mentor helped me create a study plan that worked perfectly for me.',
      imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: '₹999',
      duration: 'per month',
      features: [
        'Access to all video lessons',
        'Download study notes',
        '2 doubt-solving sessions',
        'Access to telegram group',
        'Email support'
      ],
      highlighted: false
    },
    {
      id: 2,
      name: 'Premium',
      price: '₹1,999',
      duration: 'per month',
      features: [
        'Everything in Basic',
        'Unlimited doubt-solving sessions',
        '1 personal mentoring session per week',
        'Priority support',
        'Mock test and assessments',
        'Study planner and progress tracking'
      ],
      highlighted: true
    },
    {
      id: 3,
      name: 'Ultimate',
      price: '₹2,999',
      duration: 'per month',
      features: [
        'Everything in Premium',
        '2 personal mentoring sessions per week',
        'Personalized study materials',
        'Weekend group study sessions',
        'Direct phone support',
        'Parent-teacher meetings'
      ],
      highlighted: false
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
      {/* Header */}
      <div className="bg-primary-50 py-12 mb-12">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
              variants={itemVariants}
            >
              Our Services
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              variants={itemVariants}
            >
              We offer a range of educational services designed to help students excel in their science subjects.
              From doubt solving to personal mentoring, we're here to support your academic journey.
            </motion.p>
            <motion.div
              className="flex justify-center gap-4"
              variants={itemVariants}
            >
              <a href="#services" className="btn-primary">
                Explore Services
              </a>
              <a href="#plans" className="btn-outline">
                View Plans
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What We Offer
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our services are designed to provide comprehensive support for students at every stage of their learning journey.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Pricing Plans
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Choose the plan that best fits your needs and budget. All plans include access to our core learning resources.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                  plan.highlighted ? 'border-primary-500 relative' : 'border-transparent'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {plan.highlighted && (
                  <div className="bg-primary-500 text-white text-xs font-bold px-4 py-1 text-center">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.duration}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full py-2 rounded-md font-medium ${
                      plan.highlighted 
                        ? 'bg-primary-600 text-white hover:bg-primary-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Excel in Your Studies?
            </motion.h2>
            <motion.p
              className="text-lg text-primary-100 mb-8"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of students who have improved their grades and understanding with our services.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a 
                href="/contact" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
              >
                Contact Us
              </a>
              <a 
                href="https://www.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-md font-medium"
              >
                Visit YouTube Channel
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
              What Our Students Say
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Read testimonials from students who have benefited from our services.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ServicesPage;