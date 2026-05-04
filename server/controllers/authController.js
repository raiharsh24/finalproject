const authService = require('../services/authService');

// Controllers now delegate to the service layer and rely on error‑handling middleware.

// Register after OTP verification – expects email, otp, password
const register = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    // registerUserAfterOtp internally verifies OTP
    const result = await authService.registerUserAfterOtp({ email, otp, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Login with email + password
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Send OTP (for registration or forgot password)
const sendOtp = async (req, res, next) => {
  try {
    const result = await authService.sendOtp(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Verify OTP (used separately if needed)
const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyOtp(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Forgot password – send OTP
const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Reset password after OTP verification
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const result = await authService.resetPassword({ email, otp, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
};
