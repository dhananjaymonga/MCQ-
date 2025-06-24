import React, { useState, useEffect } from 'react';

// Mock components for demo - replace with your actual imports
const BlogAdmin = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">📝 Blog Management</h2>
    <div className="space-y-4">
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.href = '/admin/blog'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Blog
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          View All Blogs
        </button>
      </div>
      <div className="border-t pt-4">
        <p className="text-gray-600">Blog Admin Component - Replace with your actual BlogAdmin component</p>
      </div>
    </div>
  </div>
);

const UploadedList = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">📚 Notes Management</h2>
    <div className="space-y-4">
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.href = '/admin/notes'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload New Notes
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          View All Notes
        </button>
      </div>
      <div className="border-t pt-4">
        <p className="text-gray-600">Notes Admin Component - Replace with your actual UploadedList component</p>
      </div>
    </div>
  </div>
);

const AdminQuiz = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">🧠 Quiz Management</h2>
    <div className="space-y-4">
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.href = '/admin/quiz'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Quiz
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          View All Quizzes
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Quiz Statistics
        </button>
      </div>
      <div className="border-t pt-4">
        <p className="text-gray-600">Quiz Admin Component - Replace with your actual AdminQuiz component</p>
        <div className="mt-3 text-sm text-gray-500">
          <p>Features available:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Create multiple choice questions</li>
            <li>Set quiz categories and difficulty levels</li>
            <li>View quiz performance analytics</li>
            <li>Manage quiz visibility and scheduling</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const Navbar = () => (
  <div className="bg-blue-600 text-white p-4 mb-6">
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <nav className="space-x-4">
        <button className="hover:text-blue-200">Dashboard</button>
        <button className="hover:text-blue-200">Settings</button>
        <button className="hover:text-blue-200">Logout</button>
      </nav>
    </div>
  </div>
);

const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalNotes: 0,
    totalBlogs: 0,
    totalQuizzes: 0,
    recentNotes: 0,
    recentBlogs: 0,
    recentQuizzes: 0,
    loading: true
  });

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setDashboardStats(prev => ({ ...prev, loading: true }));
      
      // Fetch notes data
      const notesResponse = await fetch('https://pdfman.onrender.com/api/pdfs');
      let notesData = [];
      if (notesResponse.ok) {
        notesData = await notesResponse.json();
      }
      
      // Fetch blogs data
      const blogsResponse = await fetch('https://mcq-0ldp.onrender.com/api/blogs');
      let blogsData = [];
      if (blogsResponse.ok) {
        blogsData = await blogsResponse.json();
      }
      
      // Fetch quizzes data
      const quizzesResponse = await fetch('https://quiz-pcmq-with-malika-1.onrender.com/api');
      let quizzesData = [];
      if (quizzesResponse.ok) {
        quizzesData = await quizzesResponse.json();
      }
      
      // Calculate recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Handle different possible date field names for notes
      const recentNotes = Array.isArray(notesData) ? notesData.filter(note => {
        const dateFields = [note.createdAt, note.uploadDate, note.created_at, note.upload_date];
        const noteDate = dateFields.find(date => date);
        return noteDate && new Date(noteDate) > sevenDaysAgo;
      }).length : 0;
      
      // Handle different possible date field names for blogs
      const recentBlogs = Array.isArray(blogsData) ? blogsData.filter(blog => {
        const dateFields = [blog.createdAt, blog.publishDate, blog.created_at, blog.publish_date];
        const blogDate = dateFields.find(date => date);
        return blogDate && new Date(blogDate) > sevenDaysAgo;
      }).length : 0;
      
      // Handle different possible date field names for quizzes
      const recentQuizzes = Array.isArray(quizzesData) ? quizzesData.filter(quiz => {
        const dateFields = [quiz.createdAt, quiz.publishDate, quiz.created_at, quiz.publish_date, quiz.dateCreated];
        const quizDate = dateFields.find(date => date);
        return quizDate && new Date(quizDate) > sevenDaysAgo;
      }).length : 0;
      
      setDashboardStats({
        totalNotes: Array.isArray(notesData) ? notesData.length : 0,
        totalBlogs: Array.isArray(blogsData) ? blogsData.length : 0,
        totalQuizzes: Array.isArray(quizzesData) ? quizzesData.length : 0,
        recentNotes,
        recentBlogs,
        recentQuizzes,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardStats({
        totalNotes: 0,
        totalBlogs: 0,
        totalQuizzes: 0,
        recentNotes: 0,
        recentBlogs: 0,
        recentQuizzes: 0,
        loading: false
      });
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {dashboardStats.loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, redirectUrl }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${color} hover:scale-105 transform transition-transform`}
      onClick={() => window.location.href = redirectUrl}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <p className="text-xs text-blue-500 mt-1">Click to navigate →</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 m-20 ">
        Header
        <div className="flex justify-between items-center mb-8 border-b pb-4 m-16">
          <h1 className="text-3xl font-bold text-gray-800">📋 Admin Panel</h1>
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Navigate to:</label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dashboard">🏠 Dashboard</option>
              <option value="blog">📝 Blog Management</option>
              <option value="notes">📚 Notes Management</option>
              <option value="quiz">🧠 Quiz Management</option>
            </select>
          </div>
        </div>

        {/* Dashboard View */}
        {selectedOption === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Overview Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <StatCard
                  title="Total Notes"
                  value={dashboardStats.totalNotes}
                  icon="📚"
                  color="border-blue-500"
                  subtitle="PDF files uploaded"
                />
                <StatCard
                  title="Total Blogs"
                  value={dashboardStats.totalBlogs}
                  icon="📝"
                  color="border-green-500"
                  subtitle="Blog posts created"
                />
                <StatCard
                  title="Total Quizzes"
                  value={dashboardStats.totalQuizzes}
                  icon="🧠"
                  color="border-orange-500"
                  subtitle="Quiz created"
                />
                <StatCard
                  title="Recent Notes"
                  value={dashboardStats.recentNotes}
                  icon="🆕"
                  color="border-yellow-500"
                  subtitle="Last 7 days"
                />
                <StatCard
                  title="Recent Blogs"
                  value={dashboardStats.recentBlogs}
                  icon="✨"
                  color="border-purple-500"
                  subtitle="Last 7 days"
                />
                <StatCard
                  title="Recent Quizzes"
                  value={dashboardStats.recentQuizzes}
                  icon="⚡"
                  color="border-red-500"
                  subtitle="Last 7 days"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickActionCard
                  title="Manage Blogs"
                  description="Create, edit, and delete blog posts"
                  icon="📝"
                  color="border-green-500"
                  redirectUrl="/admin/blog"
                />
                <QuickActionCard
                  title="Manage Notes"
                  description="Upload and manage PDF notes"
                  icon="📚"
                  color="border-blue-500"
                  redirectUrl="/admin/notes"
                />
                <QuickActionCard
                  title="Manage Quizzes"
                  description="Create and manage quiz questions"
                  icon="🧠"
                  color="border-orange-500"
                  redirectUrl="/admin/quiz"
                />
                <QuickActionCard
                  title="View History"
                  description="Check activity logs and history"
                  icon="📋"
                  color="border-purple-500"
                  redirectUrl="/historypa"
                />
              </div>
            </div>

            {/* Recent Activity Summary */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Recent Activity</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-r md:pr-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      📚 Notes Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Notes:</span>
                        <span className="font-semibold">{dashboardStats.totalNotes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New This Week:</span>
                        <span className="font-semibold text-green-600">+{dashboardStats.recentNotes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-r md:pr-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      📝 Blog Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Blogs:</span>
                        <span className="font-semibold">{dashboardStats.totalBlogs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New This Week:</span>
                        <span className="font-semibold text-green-600">+{dashboardStats.recentBlogs}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:pl-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      🧠 Quiz Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Quizzes:</span>
                        <span className="font-semibold">{dashboardStats.totalQuizzes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New This Week:</span>
                        <span className="font-semibold text-green-600">+{dashboardStats.recentQuizzes}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Refresh Button */}
                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={fetchDashboardStats}
                    disabled={dashboardStats.loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {dashboardStats.loading ? '🔄' : '📊'} 
                    {dashboardStats.loading ? 'Refreshing...' : 'Refresh Stats'}
                  </button>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ System Information</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">API Endpoints</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Notes API:</span>
                        <br />
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          https://pdfman.onrender.com/api/pdfs
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600">Blogs API:</span>
                        <br />
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          https://mcq-0ldp.onrender.com/api/blogs
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600">Quiz API:</span>
                        <br />
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          https://quiz-pcmq-with-malika-1.onrender.com/api
                        </code>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Navigation</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => window.location.href = '/historypa'}
                        className="block text-blue-600 hover:text-blue-800 underline bg-none border-none p-0 cursor-pointer text-left"
                      >
                        📋 View Complete History
                      </button>
                      <button 
                        onClick={() => window.location.href = '/admin/blog'}
                        className="block text-green-600 hover:text-green-800 underline bg-none border-none p-0 cursor-pointer text-left"
                      >
                        📝 Go to Blog Management Page
                      </button>
                      <button 
                        onClick={() => window.location.href = '/admin/notes'}
                        className="block text-blue-600 hover:text-blue-800 underline bg-none border-none p-0 cursor-pointer text-left"
                      >
                        📚 Go to Notes Management Page
                      </button>
                      <button 
                        onClick={() => window.location.href = '/admin/quiz'}
                        className="block text-orange-600 hover:text-orange-800 underline bg-none border-none p-0 cursor-pointer text-left"
                      >
                        🧠 Go to Quiz Management Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Link for non-dashboard views */}
        {selectedOption !== 'dashboard' && (
          <div className="flex justify-between items-center mb-8 p-4 bg-blue-50 rounded-lg border">
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/historypa'}
                className="text-blue-600 hover:text-blue-800 font-medium underline bg-none border-none p-0 cursor-pointer"
              >
                📋 View History
              </button>
              <button
                onClick={() => setSelectedOption('dashboard')}
                className="text-green-600 hover:text-green-800 font-medium underline bg-none border-none p-0 cursor-pointer"
              >
                🏠 Back to Dashboard
              </button>
              <button
                onClick={() => {
                  const routes = {
                    blog: '/admin/blog',
                    notes: '/admin/notes',
                    quiz: '/admin/quiz'
                  };
                  window.location.href = routes[selectedOption];
                }}
                className="text-purple-600 hover:text-purple-800 font-medium underline bg-none border-none p-0 cursor-pointer"
              >
                🔗 Go to Dedicated {selectedOption === 'blog' ? 'Blog' : selectedOption === 'notes' ? 'Notes' : 'Quiz'} Page
              </button>
            </div>
            <button
              onClick={fetchDashboardStats}
              disabled={dashboardStats.loading}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {dashboardStats.loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
            </button>
          </div>
        )}

        {/* Component Rendering */}
        {selectedOption === 'blog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">📝 Blog Management</h2>
              <div className="text-sm text-gray-600">
                Total Blogs: <span className="font-semibold">{dashboardStats.totalBlogs}</span>
              </div>
            </div>
            <BlogAdmin />
          </div>
        )}
        
        {selectedOption === 'notes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">📚 Notes Management</h2>
              <div className="text-sm text-gray-600">
                Total Notes: <span className="font-semibold">{dashboardStats.totalNotes}</span>
              </div>
            </div>
            <UploadedList />
          </div>
        )}

        {selectedOption === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">🧠 Quiz Management</h2>
              <div className="text-sm text-gray-600">
                Total Quizzes: <span className="font-semibold">{dashboardStats.totalQuizzes}</span>
              </div>
            </div>
            <AdminQuiz />
            
            {/* Quiz-specific information panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🔧 Quiz Management Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Available Actions:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create multiple choice questions</li>
                    <li>• Set quiz categories (PCM, General Knowledge, etc.)</li>
                    <li>• Configure difficulty levels (Easy, Medium, Hard)</li>
                    <li>• Set time limits for quizzes</li>
                    <li>• Enable/disable quiz visibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Analytics & Reports:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View quiz performance statistics</li>
                    <li>• Track user completion rates</li>
                    <li>• Monitor question difficulty analysis</li>
                    <li>• Export quiz results</li>
                    <li>• Generate performance reports</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-2">Quick Stats:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-orange-50 p-3 rounded">
                    <div className="text-2xl font-bold text-orange-600">{dashboardStats.totalQuizzes}</div>
                    <div className="text-xs text-gray-600">Total Quizzes</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">{dashboardStats.recentQuizzes}</div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">API</div>
                    <div className="text-xs text-gray-600">Connected</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-2xl font-bold text-purple-600">Live</div>
                    <div className="text-xs text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;