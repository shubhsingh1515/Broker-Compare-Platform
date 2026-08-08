const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const generateTokens = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_broker_compare_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'super_secret_broker_compare_refresh_key_2026', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
  return { token, refreshToken };
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const { token, refreshToken } = generateTokens(admin._id);
    admin.refreshToken = refreshToken;
    await admin.save();

    return successResponse(res, 200, 'Login successful', {
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.admin) {
      req.admin.refreshToken = null;
      await req.admin.save();
    }
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, 400, 'Refresh token is required');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'super_secret_broker_compare_refresh_key_2026');
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.refreshToken !== refreshToken) {
      return errorResponse(res, 401, 'Invalid refresh token');
    }

    const tokens = generateTokens(admin._id);
    admin.refreshToken = tokens.refreshToken;
    await admin.save();

    return successResponse(res, 200, 'Token refreshed', tokens);
  } catch (error) {
    return errorResponse(res, 401, 'Invalid refresh token');
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    return successResponse(res, 200, 'Profile retrieved', admin);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();
    return successResponse(res, 200, 'Profile updated', admin);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 400, 'Current password is incorrect');
    }

    admin.password = newPassword;
    await admin.save();
    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return errorResponse(res, 404, 'No account found with this email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await admin.save();

    return successResponse(res, 200, 'Password reset token generated', { resetToken });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return errorResponse(res, 400, 'Invalid or expired reset token');
    }

    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    return successResponse(res, 200, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};
