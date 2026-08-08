const Blog = require('../models/Blog');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getBlogs = async (req, res, next) => {
  try {
    const { category, tag, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit));

    return successResponse(res, 200, 'Blogs retrieved', blogs, {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return errorResponse(res, 404, 'Blog post not found');
    return successResponse(res, 200, 'Blog post details', blog);
  } catch (error) {
    next(error);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const blogData = req.body;
    if (req.file) {
      blogData.image = `/uploads/${req.file.filename}`;
    }
    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const blog = await Blog.create(blogData);
    return successResponse(res, 201, 'Blog post created', blog);
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!blog) return errorResponse(res, 404, 'Blog post not found');
    return successResponse(res, 200, 'Blog post updated', blog);
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return errorResponse(res, 404, 'Blog post not found');
    return successResponse(res, 200, 'Blog post deleted');
  } catch (error) {
    next(error);
  }
};
