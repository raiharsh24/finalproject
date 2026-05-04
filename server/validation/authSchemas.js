// Joi schemas for authentication routes
const Joi = require('joi');

// Registration schema
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'teacher', 'admin').optional(),
});

// Login schema (email + password)
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ✅ UPDATED: Send OTP schema (CRITICAL FIX)
const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  mode: Joi.string().valid('signup', 'forgot').required(),
});

// Verify OTP schema
const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// Forgot password schema (just email)
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Reset password schema (email, otp, new password)
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};