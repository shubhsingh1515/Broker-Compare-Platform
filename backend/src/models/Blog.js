const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    category: { type: String, required: true, default: 'Trading Guides' },
    tags: [{ type: String }],
    author: { type: String, default: 'Broker Compare Team' },
    image: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
