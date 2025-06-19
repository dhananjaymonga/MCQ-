const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Authenticate');
const nodemailer = require('nodemailer');

const router = express.Router();
// const authMiddleware = require('../midlware/auth');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Send OTP for signup or password reset
// Send OTP for Signup
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Agar user already registered hai aur verified bhi hai (optional check)
      return res.status(400).json({ message: 'User already registered' });
    }

    // Naya OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Naya user create karo ya existing with OTP (for unverified flow)
    await User.create({
      email,
      otp,
      otpExpiry,
    });

    // Email bhejo
    await transporter.sendMail({
      to: email,
      subject: 'Signup OTP',
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: 'OTP sent for signup' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});



// Signup - verify OTP and set password
// Signup - verify OTP and set password
router.post('/verify-otp', async (req, res) => {
  const { email, otp: enteredOtp, name, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== enteredOtp) return res.status(400).json({ message: 'Invalid OTP' });

    if (Date.now() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.name = name;
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set cookie on successful signup
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'User registered successfully!', name: user.name });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});


// Login
// Login
// Login
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // ✅ Set HttpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    name: user.name,
    message: 'Login successful',
  });
});



// // 1. Send OTP for forgot password
router.post('/forgot-password/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: 'Reset Password OTP',
    text: `Your OTP to reset your password is ${otp}`,
  });

  res.json({ message: 'OTP sent to your email' });
});
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // 'token' ko cookie name ke roop mein use karen
  return res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
    console.log(user); // 👈 this is what res.data.user becomes in frontend
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
})

// 2. Verify OTP and reset password
router.post('/forgot-password/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: 'Password reset successfully' });
});


module.exports = router;
