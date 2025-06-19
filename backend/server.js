
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const blogRoutes = require("./routes/blog");

require('dotenv').config();

const pdfRoutes = require('./routes/notespdf');
const { testImageKitConnection } = require('./utiliss/imagekit');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test ImageKit on startup
testImageKitConnection();

// Routes
app.use('/api', pdfRoutes);
app.use("/api/blogs", blogRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    imagekit: 'configured',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
