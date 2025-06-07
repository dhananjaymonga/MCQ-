const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true }, // Short description/summary
  imageUrl: { type: String }, // Optional image
  author: { type: String, required: true }, // Author name
  category: { 
    type: String, 
    required: true,
    enum: ['physics', 'chemistry', 'biology', 'study-tips', 'exam-preparation']
  }, // Category selection
  tags: [{ type: String }], // Array of tags
  readingTime: { type: Number }, // Reading time in minutes (auto-calculated)
  isPublished: { type: Boolean, default: false }, // Published status
  publishedDate: { type: Date }, // Published date
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
}, { timestamps: true });

// Calculate reading time before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    // Calculate reading time (average 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  // Set published date when publishing
  if (this.isPublished && !this.publishedDate) {
    this.publishedDate = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
