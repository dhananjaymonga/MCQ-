import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">PCMB with Malika
</h3>
            <p className="text-gray-300 mb-4">
              Helping students master Physics, Chemistry, and Biology through engaging video lessons, comprehensive notes, and personalized guidance.
            </p>
            <div className="flex space-x-4">
              <a href="https://youtube.com" aria-label="YouTube" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/notes" className="text-gray-300 hover:text-white transition-colors">Notes</Link>
              </li>
              <li>
                <Link to="/videos" className="text-gray-300 hover:text-white transition-colors">Videos</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Subjects</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/notes?subject=physics" className="text-gray-300 hover:text-physics-light transition-colors">Physics</Link>
              </li>
              <li>
                <Link to="/notes?subject=chemistry" className="text-gray-300 hover:text-chemistry-light transition-colors">Chemistry</Link>
              </li>
              <li>
                <Link to="/notes?subject=biology" className="text-gray-300 hover:text-biology-light transition-colors">Biology</Link>
              </li>
            </ul>
            <h3 className="text-xl font-heading font-semibold mb-4 mt-6">Classes</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 7 }, (_, i) => i + 6).map((classNum) => (
                <Link 
                  key={classNum} 
                  to={`/notes?class=${classNum}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Class {classNum}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-gray-300 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Education St, Learning City, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-300 flex-shrink-0" />
                <span className="text-gray-300">+91 8690167053</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-300 flex-shrink-0" />
                <span className="text-gray-300"> pcmwithmalika@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear}PCMB with Malika
. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;