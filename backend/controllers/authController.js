const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign JWT
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lasthope_production_grade_jwt_secret_token_984716382',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Helper to set HTTP-only cookie
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };

  res.cookie('token', token, cookieOptions);
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Create session token and cookie
    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user and explicitly select password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Create session token and cookie
    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.',
    });
  }
};

// @desc    Log user out / clear cookie
// @route   POST /auth/logout
// @access  Public
const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current authenticated user profile
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toJSON(),
  });
};

// @desc    Initiate password reset
// @route   POST /auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always respond with a generic message to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, password reset instructions have been prepared.',
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration: 1 hour
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, password reset instructions have been prepared.',
      // In local development, return token so developer/user can test directly
      devResetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while initiating password reset.',
    });
  }
};

// @desc    Reset password using reset token
// @route   POST /auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the reset token and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Hash provided token to match stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired',
      });
    }

    // Update password and clear reset fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Auto-login user
    const sessionToken = signToken(user._id);
    setAuthCookie(res, sessionToken);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      user: user.toJSON(),
      token: sessionToken,
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while resetting password.',
    });
  }
};

// @desc    Authenticate or register user via Google OAuth
// @route   POST /auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { email, name, avatar, firebaseUid } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google profile does not contain a valid email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (!user.avatar && avatar) user.avatar = avatar;
      if (!user.firebaseUid && firebaseUid) user.firebaseUid = firebaseUid;
      await user.save();
    } else {
      user = await User.create({
        name: name || 'Google User',
        email: normalizedEmail,
        avatar: avatar || undefined,
        authProvider: 'google',
        firebaseUid: firebaseUid || undefined,
      });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in with Google successfully',
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error('Google OAuth backend error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during Google authentication.',
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
