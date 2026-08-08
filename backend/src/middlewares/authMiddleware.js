const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { errorResponse } = require('../helpers/responseHelper');

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_broker_compare_jwt_key_2026');
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return errorResponse(res, 401, 'Admin account no longer exists');
    }

    req.admin = admin;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Token is invalid or expired');
  }
};

module.exports = { protectAdmin };
