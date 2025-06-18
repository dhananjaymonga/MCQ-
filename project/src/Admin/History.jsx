import React, { useState, useEffect } from 'react';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState({
    notes: [],
    blogs: [],
    userSessions: [],
    loading: true,
    error: null
  });
  const [filter, setFilter] = useState('all'); // all, notes, blogs, sessions
  const [sortBy, setSortBy] = useState('date-desc'); // date-asc, date-desc, type
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser] = useState('admin@example.com'); // This would come from your auth system

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setHistoryData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
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

      // Generate mock user sessions (replace with actual user session API)
      const userSessions = generateMockUserSessions();

      setHistoryData({
        notes: Array.isArray(notesData) ? notesData : [],
        blogs: Array.isArray(blogsData) ? blogsData : [],
        userSessions,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching history data:', error);
      setHistoryData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch history data'
      }));
    }
  };

  // Mock user sessions - replace with actual API call
  const generateMockUserSessions = () => {
    const sessions = [];
    const actions = ['Login', 'Logout', 'View Dashboard', 'Upload Note', 'Create Blog', 'Edit Blog', 'Delete Note'];
    const users = ['admin@example.com', 'editor@example.com', 'viewer@example.com'];
    
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      sessions.push({
        id: `session-${i}`,
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: date.toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
    }
    
    return sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityType = (item) => {
    if (item.user) return 'session';
    if (item.title || item.content) return 'blog';
    return 'note';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'blog': return '📝';
      case 'note': return '📚';
      case 'session': return '👤';
      default: return '📄';
    }
  };

  const getActivityDate = (item, type) => {
    if (type === 'session') return item.timestamp;
    if (type === 'blog') {
      return item.updatedAt || item.createdAt || item.publishDate || item.created_at;
    }
    if (type === 'note') {
      return item.updatedAt || item.createdAt || item.uploadDate || item.created_at;
    }
    return null;
  };

  const getAllActivities = () => {
    let activities = [];

    // Add notes
    historyData.notes.forEach(note => {
      const createdDate = note.createdAt || note.uploadDate || note.created_at;
      const updatedDate = note.updatedAt || note.updated_at;
      
      if (createdDate) {
        activities.push({
          ...note,
          activityType: 'note',
          activityAction: 'created',
          activityDate: createdDate,
          activityTitle: `Note uploaded: ${note.filename || note.title || 'Untitled'}`,
          activityDescription: `PDF file uploaded (${note.fileSize || 'unknown size'})`
        });
      }
      
      if (updatedDate && updatedDate !== createdDate) {
        activities.push({
          ...note,
          activityType: 'note',
          activityAction: 'updated',
          activityDate: updatedDate,
          activityTitle: `Note updated: ${note.filename || note.title || 'Untitled'}`,
          activityDescription: 'PDF file was modified'
        });
      }
    });

    // Add blogs
    historyData.blogs.forEach(blog => {
      const createdDate = blog.createdAt || blog.publishDate || blog.created_at;
      const updatedDate = blog.updatedAt || blog.updated_at;
      
      if (createdDate) {
        activities.push({
          ...blog,
          activityType: 'blog',
          activityAction: 'created',
          activityDate: createdDate,
          activityTitle: `Blog created: ${blog.title || 'Untitled'}`,
          activityDescription: blog.excerpt || blog.description || 'Blog post created'
        });
      }
      
      if (updatedDate && updatedDate !== createdDate) {
        activities.push({
          ...blog,
          activityType: 'blog',
          activityAction: 'updated',
          activityDate: updatedDate,
          activityTitle: `Blog updated: ${blog.title || 'Untitled'}`,
          activityDescription: 'Blog post was modified'
        });
      }
    });

    // Add user sessions
    historyData.userSessions.forEach(session => {
      activities.push({
        ...session,
        activityType: 'session',
        activityAction: session.action.toLowerCase(),
        activityDate: session.timestamp,
        activityTitle: `${session.action}: ${session.user}`,
        activityDescription: `IP: ${session.ipAddress}`
      });
    });

    return activities;
  };

  const getFilteredAndSortedActivities = () => {
    let activities = getAllActivities();

    // Apply filters
    if (filter !== 'all') {
      activities = activities.filter(activity => {
        if (filter === 'notes') return activity.activityType === 'note';
        if (filter === 'blogs') return activity.activityType === 'blog';
        if (filter === 'sessions') return activity.activityType === 'session';
        return true;
      });
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      if (dateRange === 'today') {
        filterDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'week') {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        filterDate.setMonth(now.getMonth() - 1);
      }
      
      activities = activities.filter(activity => 
        new Date(activity.activityDate) >= filterDate
      );
    }

    // Apply search filter
    if (searchTerm) {
      activities = activities.filter(activity =>
        activity.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.activityDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.user && activity.user.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    activities.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.activityDate) - new Date(b.activityDate);
      } else if (sortBy === 'date-desc') {
        return new Date(b.activityDate) - new Date(a.activityDate);
      } else if (sortBy === 'type') {
        return a.activityType.localeCompare(b.activityType);
      }
      return 0;
    });

    return activities;
  };

  const getActivityColor = (type, action) => {
    if (type === 'session') {
      if (action.includes('login')) return 'border-green-500 bg-green-50';
      if (action.includes('logout')) return 'border-red-500 bg-red-50';
      return 'border-blue-500 bg-blue-50';
    }
    if (type === 'blog') {
      if (action === 'created') return 'border-purple-500 bg-purple-50';
      return 'border-purple-400 bg-purple-25';
    }
    if (type === 'note') {
      if (action === 'created') return 'border-yellow-500 bg-yellow-50';
      return 'border-yellow-400 bg-yellow-25';
    }
    return 'border-gray-500 bg-gray-50';
  };

  const activities = getFilteredAndSortedActivities();

  if (historyData.loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading history data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 Activity History</h1>
          <p className="text-gray-600 mt-1">Track all system activities and user sessions</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            🏠 Back to Dashboard
          </button>
          <button
            onClick={fetchHistoryData}
            disabled={historyData.loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {historyData.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-2">⚠️</span>
            <p className="text-red-700">{historyData.error}</p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Activities</p>
              <p className="text-3xl font-bold text-gray-800">{activities.length}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Notes</p>
              <p className="text-3xl font-bold text-gray-800">{historyData.notes.length}</p>
            </div>
            <div className="text-3xl">📚</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Blogs</p>
              <p className="text-3xl font-bold text-gray-800">{historyData.blogs.length}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">User Sessions</p>
              <p className="text-3xl font-bold text-gray-800">{historyData.userSessions.length}</p>
            </div>
            <div className="text-3xl">👤</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Filters & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="notes">📚 Notes</option>
              <option value="blogs">📝 Blogs</option>
              <option value="sessions">👤 User Sessions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="type">By Type</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">📈 Activity Timeline</h2>
        
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No activities found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={`${activity.activityType}-${activity.id || index}`} 
                   className={`border-l-4 rounded-lg p-4 ${getActivityColor(activity.activityType, activity.activityAction)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {activity.activityTitle}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {activity.activityDescription}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>📅 {formatDate(activity.activityDate)}</span>
                        {activity.user && (
                          <span>👤 {activity.user}</span>
                        )}
                        {activity.ipAddress && (
                          <span>🌐 {activity.ipAddress}</span>
                        )}
                        <span className="capitalize">
                          🏷️ {activity.activityAction} {activity.activityType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current User Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-xl">👤</span>
          <span className="text-blue-800 font-medium">
            Currently logged in as: {currentUser}
          </span>
          <span className="text-blue-600 text-sm">
            | Session active since: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;