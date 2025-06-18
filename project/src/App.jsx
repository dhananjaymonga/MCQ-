import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import VideoPage from './pages/VideoPage';
import BlogPage from './pages/BlogPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/utils/ScrollToTop';
import AdminNotes from './Admin/AdminNotes';
import AdminBlog from "./Admin/AdminBlog"
import Admin from "./Admin/Admin"
import HistoryPage from './Admin/History';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/notes" element={<AdminNotes />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/historypa" element={<HistoryPage />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;