const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

const {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../validation/authSchemas');

// ================= AUTH ROUTES =================

// Register (OTP verified + set password)
router.post('/register', validate(registerSchema), authController.register);

// Login (email + password)
router.post('/login', validate(loginSchema), authController.login);

// Send OTP (for signup / forgot password)
router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);


// Forgot password (send OTP)
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// Reset password (email + otp + new password)
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;