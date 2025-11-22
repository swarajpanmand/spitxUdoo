import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

const ALLOWED_ROLES = ["admin", "manager", "warehouse"];

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // "123456"
};

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, assignedWarehouseIds } = req.body;
    // console.log(name , email, password, role, assignedWarehouseIds);

    // normal validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "name, email, password, and role are required",
      });
    }

    if(!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role",
      });
    }

    // Check unique mail
    const exists = await User.findOne({ email });
    if(exists) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    const payload = {
      name,
      email,
      password,
      role,
      assignedWarehouseIds
    };
    
    if(role === "manager" || role === "warehouse") {
      payload.assignedWarehouseIds = assignedWarehouseIds || [];
    }

    // 1. Create user
    const user = await User.create(payload);

    // 2. Generate OTP for email verification
    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // 3. Send Email
    await sendEmail({
      to: email,
      subject: "Verify your StockMaster email",
      html: `<h3>Your verification OTP:</h3>
            <h2>${otp}</h2>
            <p>Expires in 10 minutes.</p>`
    });

    // 4. Response (no login yet)
    return res.json({
      success: true,
      message: "Signup successful. Please verify your email.",
      userId: user._id
    });

  }
  catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "email and password are required",
      });
    }

    // 2. Does user exist?
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // 4. Update login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email first.",
      });
    }


    // 5. Issue token
    const token = signToken(user);

    // 6. Final response
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "email is required",
      });
    }

    // 1. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // For security, NEVER reveal which emails exist
      return res.json({
        success: true,
        message: "If this email is registered, an OTP has been sent.",
      });
    }

    // 2. Generate OTP
    const otp = generateOTP();

    // 3. Hash OTP before saving
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // 4. Save OTP + expiry (10 minutes)
    user.resetOTP = hashedOTP;
    user.resetOTPExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h3>Your password reset OTP:</h3>
            <h2>${otp}</h2>
            <p>Expires in 10 minutes.</p>`
    });

    return res.json({
      success: true,
      message: "OTP sent to your email."
    });
  } catch (err) {
    next(err);
  }
};

export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "email and otp are required",
      });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP or expired",
      });
    }

    // 2. Hash provided OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // 3. Check OTP + expiry
    if (
      user.resetOTP !== hashedOTP ||
      !user.resetOTPExpiresAt ||
      user.resetOTPExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP or expired",
      });
    }

    // 4. OTP verified → clear OTP
    user.resetOTP = undefined;
    user.resetOTPExpiresAt = undefined;

    // 5. Create a short-lived reset token (15 min)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // 6. Return the reset token (client must send this during reset password)
    return res.json({
      success: true,
      message: "OTP verified successfully.",
      resetToken, // send to frontend; never store raw OTP again
    });

  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "resetToken and newPassword are required",
      });
    }

    // 1. Hash the received token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 2. Find user with this token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // token still valid
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    // 3. Update password
    user.password = newPassword;

    // 4. Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 5. Auto-login user after reset
    const token = signToken(user);

    return res.json({
      success: true,
      message: "Password has been reset successfully.",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "email and otp are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      user.emailVerificationOTP !== hashedOTP ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully." });

  } catch (err) {
    next(err);
  }
};

// Resend email verification OTP
export const resendVerificationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Do not leak which emails exist
      return res.json({ success: true, message: 'If this email is registered, a verification OTP has been sent.' });
    }

    if (user.isEmailVerified) {
      return res.json({ success: true, message: 'Email is already verified.' });
    }

    const otp = generateOTP();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Verify your StockMaster email',
      html: `<h3>Your verification OTP:</h3>
             <h2>${otp}</h2>
             <p>Expires in 10 minutes.</p>`,
    });

    res.json({ success: true, message: 'Verification OTP sent.' });
  } catch (err) {
    next(err);
  }
};

// Stateless logout helper for JWT-based auth
export const logout = async (req, res, next) => {
  try {
    // With JWT, logout is usually handled on the client by removing the token.
    // This endpoint exists mainly so the frontend can call it and clear its own state.
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};