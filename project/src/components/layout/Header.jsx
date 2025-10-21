// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Menu, X, Youtube, Beaker, BookOpen, Atom, User, LogOut } from 'lucide-react';
// import { UserContext } from '../context/user'; // Adjust the path as needed
// import axios from 'axios';

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Get user context with error handling
//   const contextValue = useContext(UserContext);
  
//   // Handle case where context is not available
//   if (!contextValue) {
//     console.error('UserContext is not available. Make sure Header is wrapped with UserProvider.');
//     // Provide fallback values
//     const user = null;
//     const handleLogout = () => {};
//     const loading = false;
//   }
  
//   const { user, handleLogout, loading } = contextValue || { 
//     user: null, 
//     handleLogout: () => {}, 
//     loading: false 
//   };

//   const handleScroll = () => {
//     setIsScrolled(window.scrollY > 10);
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//     setShowUserMenu(false);
//   }, [location]);

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'About', path: '/about' },
//     { name: 'Videos', path: '/videos' },
//     { name: 'Notes', path: '/notes' },
//     { name: 'Blog', path: '/blog' },
//     { name: 'Quiz', path: '/quiz' },
//     { name: 'Contact', path: '/contact' },
//     { name: 'Services', path: '/services' },
//   ];

//   // Handle logout
//   const handleLogoutClick = async () => {
//     try {
//       // Call backend logout endpoint
//       await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
//       handleLogout(); // Clear user from context
//       navigate('/'); // Redirect to home page
//       console.log('✅ User logged out successfully');
//     } catch (error) {
//       console.error('❌ Logout error:', error);
//       // Still clear user from context even if backend call fails
//       handleLogout();
//       navigate('/');
//     }
//   };

//   // Show loading state if context is still loading
//   if (loading) {
//     return (
//       <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2">
//         <div className="container-custom flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="flex items-center space-x-1">
//               <Beaker className="h-6 w-6 text-chemistry-DEFAULT" />
//               <Atom className="h-6 w-6 text-physics-DEFAULT" />
//               <BookOpen className="h-6 w-6 text-biology-DEFAULT" />
//             </div>
//             <span className="font-heading font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-physics-DEFAULT via-chemistry-DEFAULT to-biology-DEFAULT">
//               MHS Guruk
//             </span>
//           </div>
//           <div className="text-sm text-gray-500">Loading...</div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header 
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
//       }`}
//     >
//       <div className="container-custom flex items-center justify-between">
//         <Link to="/" className="flex items-center space-x-2">
//           <div className="flex items-center space-x-1">
//             <Beaker className="h-6 w-6 text-chemistry-DEFAULT" />
//             <Atom className="h-6 w-6 text-physics-DEFAULT" />
//             <BookOpen className="h-6 w-6 text-biology-DEFAULT" />
//           </div>
//           <span className="font-heading font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-physics-DEFAULT via-chemistry-DEFAULT to-biology-DEFAULT">
//           PCMB with Malika
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-6">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.path}
//               className={`text-sm font-medium transition-colors hover:text-primary-600 ${
//                 location.pathname === link.path
//                   ? 'text-primary-600'
//                   : 'text-gray-700'
//               }`}
//             >
//               {link.name}
//             </Link>
//           ))}
          
//           {/* YouTube Subscribe Button */}
//           <a
//             href="https://www.youtube.com/@PCMB_with_Malika"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="btn-primary flex items-center space-x-1"
//           >
//             <Youtube size={16} />
//             <span>Subscribe</span>
//           </a>

//           {/* User Authentication Section */}
//           {user ? (
//             // User is logged in - show user menu
//             <div className="relative">
//               <button
//                 onClick={() => setShowUserMenu(!showUserMenu)}
//                 className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
//               >
//                 <User size={16} />
//                 <span className="text-sm font-medium">
//                   {user.name || user.username || 'User'}
//                 </span>
//               </button>
              
//               {/* User dropdown menu */}
//               {showUserMenu && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
//                 >
//                   <div className="px-4 py-2 border-b">
//                     <p className="text-sm font-medium text-gray-900">
//                       {user.name || user.username}
//                     </p>
//                     <p className="text-xs text-gray-500">{user.email}</p>
//                   </div>
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setShowUserMenu(false)}
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={handleLogoutClick}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
//                   >
//                     <LogOut size={14} />
//                     <span>Logout</span>
//                   </button>
//                 </motion.div>
//               )}
//             </div>
//           ) : (
//             // User is not logged in - show login button
//             <Link
//               to="/auth"
//               className="btn-secondary flex items-center space-x-1"
//             >
//               <User size={16} />
//               <span>Login</span>
//             </Link>
//           )}
//         </nav>

//         {/* Mobile menu button */}
//         <button 
//           className="md:hidden text-gray-700"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40"
//         >
//           <div className="container-custom py-4 flex flex-col space-y-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className={`text-sm font-medium py-2 transition-colors hover:text-primary-600 ${
//                   location.pathname === link.path
//                     ? 'text-primary-600'
//                     : 'text-gray-700'
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}
            
//             {/* YouTube Subscribe Button */}
//             <a
//               href="https://www.youtube.com/@PCMB_with_Malika"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="btn-primary flex items-center space-x-1 justify-center"
//             >
//               <Youtube size={16} />
//               <span>Subscribe</span>
//             </a>

//             {/* Mobile User Authentication Section */}
//             {user ? (
//               // User is logged in - show user info and logout
//               <div className="border-t pt-3 mt-3">
//                 <div className="flex items-center space-x-2 mb-3">
//                   <User size={16} className="text-gray-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {user.name || user.username}
//                     </p>
//                     <p className="text-xs text-gray-500">{user.email}</p>
//                   </div>
//                 </div>
//                 <Link
//                   to="/profile"
//                   className="block text-sm font-medium py-2 text-gray-700 hover:text-primary-600"
//                 >
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogoutClick}
//                   className="w-full text-left text-sm font-medium py-2 text-gray-700 hover:text-primary-600 flex items-center space-x-2"
//                 >
//                   <LogOut size={14} />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               // User is not logged in - show login button
//               <Link
//                 to="/auth"
//                 className="btn-secondary flex items-center space-x-1 justify-center"
//               >
//                 <User size={16} />
//                 <span>Login</span>
//               </Link>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Youtube, Beaker, BookOpen, Atom, User, LogOut } from 'lucide-react';
import { UserContext } from '../context/user'; // Adjust the path as needed
import axios from 'axios';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user context with error handling
  const contextValue = useContext(UserContext);
  
  // Provide fallback values if context is not available
  const { user, handleLogout, loading } = contextValue || { 
    user: null, 
    handleLogout: () => {
      console.error('UserContext is not available. Make sure Header is wrapped with UserProvider.');
    }, 
    loading: false 
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Videos', path: '/videos' },
    { name: 'Notes', path: '/notes' },
    { name: 'Blog', path: '/blog' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Contact', path: '/contact' },
    { name: 'Services', path: '/services' },
  ];

  // Handle logout
  const handleLogoutClick = async () => {
    try {
      // Call backend logout endpoint
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      handleLogout(); // Clear user from context
      navigate('/'); // Redirect to home page
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear user from context even if backend call fails
      handleLogout();
      navigate('/');
    }
  };

  // Show loading state if context is still loading
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Beaker className="h-6 w-6 text-chemistry-DEFAULT" />
              <Atom className="h-6 w-6 text-physics-DEFAULT" />
              <BookOpen className="h-6 w-6 text-biology-DEFAULT" />
            </div>
            <span className="font-heading font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-physics-DEFAULT via-chemistry-DEFAULT to-biology-DEFAULT">
              PCMB with Malika
            </span>
          </div>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      </header>
    );
  }

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
          PCMB with Malika
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
          
          {/* YouTube Subscribe Button */}
          <a
            href="https://www.youtube.com/@PCMB_with_Malika"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-1"
          >
            <Youtube size={16} />
            <span>Subscribe</span>
          </a>

          {/* User Authentication Section */}
          {user ? (
            // User is logged in - show user menu
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User size={16} />
                <span className="text-sm font-medium">
                  {user.name || user.username || 'User'}
                </span>
              </button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
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
            // User is not logged in - show login button
            <Link
              to="/auth"
              className="btn-secondary flex items-center space-x-1"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          )}
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
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40"
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
            
            {/* YouTube Subscribe Button */}
            <a
              href="https://www.youtube.com/@PCMB_with_Malika"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-1 justify-center"
            >
              <Youtube size={16} />
              <span>Subscribe</span>
            </a>

            {/* Mobile User Authentication Section */}
            {user ? (
              // User is logged in - show user info and logout
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center space-x-2 mb-3">
                  <User size={16} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
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
              // User is not logged in - show login button
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