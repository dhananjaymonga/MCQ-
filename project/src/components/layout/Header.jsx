import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Youtube, Beaker, BookOpen, Atom } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Notes', path: '/notes' },
    { name: 'Videos', path: '/videos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Beaker className="h-6 w-6 text-chemistry-DEFAULT" />
            <Atom className="h-6 w-6 text-physics-DEFAULT" />
            <BookOpen className="h-6 w-6 text-biology-DEFAULT" />
          </div>
          <span className="font-heading font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-physics-DEFAULT via-chemistry-DEFAULT to-biology-DEFAULT">
            MHS Guruk
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === link.path
                  ? 'text-primary-600'
                  : 'text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-1"
          >
            <Youtube size={16} />
            <span>Subscribe</span>
          </a>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg"
        >
          <div className="container-custom py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary-600 ${
                  location.pathname === link.path
                    ? 'text-primary-600'
                    : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-1 justify-center"
            >
              <Youtube size={16} />
              <span>Subscribe</span>
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;