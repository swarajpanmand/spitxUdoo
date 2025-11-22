import express from 'express';
import * as authController from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/request-reset', authController.requestPasswordReset);
router.post('/verify-reset-otp', authController.verifyResetOTP);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification-otp', authController.resendVerificationOtp);
router.post('/logout', authController.logout);

export default router;
