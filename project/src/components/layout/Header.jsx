import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Youtube, Beaker, BookOpen, Atom, User, LogOut } from 'lucide-react';
import { UserContext } from '../context/user';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Access UserContext
  const { user, logout } = useContext(UserContext);

  // ✅ Handle nested user structure from API
  // API returns { user: { _id, name, email } } but context stores it as is
  const actualUser = user?.user || user || null;

  // ✅ Scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  // ✅ Navbar links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Videos', path: '/videos' },
    { name: 'Notes', path: '/notes' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Contact', path: '/contact' },
    { name: 'Services', path: '/services' },
  ];

  // ✅ Logout handler
  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  // ✅ Get display name
  const getDisplayName = () => {
    if (!actualUser) return 'User';
    return actualUser.name || actualUser.username || 'User';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Beaker className="h-6 w-6 text-chemistry-DEFAULT" />
            <Atom className="h-6 w-6 text-physics-DEFAULT" />
            <BookOpen className="h-6 w-6 text-biology-DEFAULT" />
          </div>
          <span className="font-heading font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-physics-DEFAULT via-chemistry-DEFAULT to-biology-DEFAULT">
            PCMB with Malika
          </span>
        </Link>

        {/* ✅ Desktop Navbar */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === link.path ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* ✅ YouTube Button */}
          <a
            href="https://www.youtube.com/@PCMB_with_Malika"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-1"
          >
            <Youtube size={16} />
            <span>Subscribe</span>
          </a>

          {/* ✅ User Section */}
          {actualUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User size={16} />
                <span className="text-sm font-medium">{getDisplayName()}</span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                    {actualUser.email && (
                      <p className="text-xs text-gray-500">{actualUser.email}</p>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-secondary flex items-center space-x-1">
              <User size={16} />
              <span>Login</span>
            </Link>
          )}
        </nav>

        {/* ✅ Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ Mobile Navbar */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40"
        >
          <div className="container-custom py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary-600 ${
                  location.pathname === link.path ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* ✅ YouTube Button */}
            <a
              href="https://www.youtube.com/@PCMB_with_Malika"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-1 justify-center"
            >
              <Youtube size={16} />
              <span>Subscribe</span>
            </a>

            {/* ✅ Mobile User Menu */}
            {actualUser ? (
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center space-x-2 mb-3">
                  <User size={16} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                    {/* {actualUser.email && (
                      <p className="text-xs text-gray-500">{actualUser.email}</p>
                    )} */}
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block text-sm font-medium py-2 text-gray-700 hover:text-primary-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left text-sm font-medium py-2 text-gray-700 hover:text-primary-600 flex items-center space-x-2"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-secondary flex items-center space-x-1 justify-center"
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;