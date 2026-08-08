const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const brokerRoutes = require('./brokerRoutes');
const compareRoutes = require('./compareRoutes');
const categoryRoutes = require('./categoryRoutes');
const featureRoutes = require('./featureRoutes');
const blogRoutes = require('./blogRoutes');
const faqRoutes = require('./faqRoutes');
const bannerRoutes = require('./bannerRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const contactRoutes = require('./contactRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const popularComparisonRoutes = require('./popularComparisonRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/auth', authRoutes);
router.use('/brokers', brokerRoutes);
router.use('/compare', compareRoutes);
router.use('/categories', categoryRoutes);
router.use('/features', featureRoutes);
router.use('/blogs', blogRoutes);
router.use('/faqs', faqRoutes);
router.use('/banners', bannerRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contacts', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/popular-comparisons', popularComparisonRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
