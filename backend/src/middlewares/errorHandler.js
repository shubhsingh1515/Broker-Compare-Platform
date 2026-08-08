const { errorResponse } = require('../helpers/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]:', err);

  let statusCode = err.statusCode || res.statusCode || 500;
  if (statusCode === 200) statusCode = 500;

  let message = err.message || 'Server Error';

  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field}. Please use another value!`;
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }

  return errorResponse(res, statusCode, message, err.errors || null);
};

module.exports = errorHandler;
