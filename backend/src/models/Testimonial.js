const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: 'Investor / Trader' },
    company: { type: String },
    avatar: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
