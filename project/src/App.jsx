import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { UserProvider } from './components/context/user'; // Adjust path as needed

// Pages
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import VideoPage from './pages/VideoPage';
import BlogPage from './pages/BlogPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/utils/ScrollToTop';
import Auth from "./Authentication/Auth";
import Login from "./Authentication/Login"
import SignupForm from './Authentication/Singup';
import ForgotPasswordForm from './Authentication/Frogget';
// Admin components
import AdminQuiz from "./Admin/AdminQuiz"
import AdminNotes from './Admin/AdminNotes';
import AdminBlog from "./Admin/AdminBlog";
import Admin from "./Admin/Admin";
import HistoryPage from './Admin/History';
import AdminLogin from './Admin/AdLogin';
import QuizApp from './pages/Quiz';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      return false;
    }
    
    try {
      // Optional: Check if token is expired
      // You can decode JWT token here if you're using JWT
      // const decodedToken = jwt_decode(token);
      // return decodedToken.exp > Date.now() / 1000;
      
      return true;
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

// Public Route Component (redirects to admin if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  return isAuthenticated() ? <Navigate to="/admin" replace /> : children;
};

function App() {
  return (
    <UserProvider>
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/quiz" element={<QuizApp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/singup" element={<SignupForm />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/frogget-password" element={<ForgotPasswordForm />} />
              
              {/* Admin Login Route (public but redirects if already logged in) */}
              <Route 
                path="/admin/login" 
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/admin/quiz" 
                element={
                  <PublicRoute>
                    <AdminQuiz />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/notes" 
                element={
                  <ProtectedRoute>
                    <AdminNotes />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/blog" 
                element={
                  <ProtectedRoute>
                    <AdminBlog />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/historypa" 
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Routes */}
              <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;