// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');

// const app = express();

// // ==================== CONFIGURATION ====================
// const PORT = 3000;
// const MONGODB_URI = 'mongodb+srv://dhananjaymonga10:7yBvJsZUlD0eC0CL@cluster0.6iufh6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const JWT_SECRET = 'your-super-secret-jwt-key-12345';
// const MAIL_USER = 'dhananjay.monga.10@gmail.com';
// const MAIL_PASS = 'qwxfcoldhzpmkpgq';

// // ==================== MIDDLEWARE ====================
// // CORS must be before other middleware
// app.use(cors({
//   origin: 'http://localhost:5173', // Your React app URL (adjust port if needed)
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// // ==================== DATABASE CONNECTION ====================
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error('❌ MongoDB Error:', err));

// // ==================== USER MODEL ====================
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     default: null,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     default: null,
//   },
//   otp: {
//     type: String,
//     default: null,
//   },
//   otpExpiry: {
//     type: Date,
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// const User = mongoose.model('User', userSchema);

// // ==================== EMAIL TRANSPORTER ====================
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: MAIL_USER,
//     pass: MAIL_PASS,
//   },
// });

// // ==================== AUTH MIDDLEWARE ====================
// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // ==================== ROUTES ====================

// // Send OTP for Signup
// app.post('/api/auth/send-otp', async (req, res) => {
//   const { email } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user && user.password) {
//       return res.status(400).json({ message: 'User already registered' });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = Date.now() + 10 * 60 * 1000;

//     if (user) {
//       user.otp = otp;
//       user.otpExpiry = otpExpiry;
//       await user.save();
//     } else {
//       user = await User.create({
//         email,
//         otp,
//         otpExpiry,
//       });
//     }

//     await transporter.sendMail({
//       to: email,
//       subject: 'Signup OTP',
//       text: `Your OTP is ${otp}. Valid for 10 minutes.`,
//     });

//     res.json({ message: 'OTP sent for signup' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ message: 'Error sending OTP' });
//   }
// });

// // Verify OTP and complete signup
// app.post('/api/auth/verify-otp', async (req, res) => {
//   const { email, otp: enteredOtp, name, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.otp !== enteredOtp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     if (Date.now() > user.otpExpiry) {
//       return res.status(400).json({ message: 'OTP expired' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.name = name;
//     user.password = hashedPassword;
//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'Lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ 
//       message: 'User registered successfully!', 
//       name: user.name 
//     });
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ message: 'Error verifying OTP' });
//   }
// });

// // Login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.password) {
//       return res.status(400).json({ message: 'Please complete signup first' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid password' });
//     }

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'Lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       name: user.name,
//       message: 'Login successful',
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// // Send OTP for forgot password
// app.post('/api/auth/forgot-password/send-otp', async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.password) {
//       return res.status(400).json({ message: 'Please complete signup first' });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = Date.now() + 10 * 60 * 1000;

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     await transporter.sendMail({
//       to: email,
//       subject: 'Reset Password OTP',
//       text: `Your OTP to reset your password is ${otp}. Valid for 10 minutes.`,
//     });

//     res.json({ message: 'OTP sent to your email' });
//   } catch (error) {
//     console.error('Error sending forgot password OTP:', error);
//     res.status(500).json({ message: 'Error sending OTP' });
//   }
// });

// // Verify OTP and reset password
// app.post('/api/auth/forgot-password/verify-otp', async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     if (Date.now() > user.otpExpiry) {
//       return res.status(400).json({ message: 'OTP expired' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     res.json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error resetting password:', error);
//     res.status(500).json({ message: 'Error resetting password' });
//   }
// });

// // Get current user
// app.get('/api/auth/me', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ user });
//   } catch (err) {
//     console.error('Error fetching user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Logout
// app.post('/api/auth/logout', (req, res) => {
//   res.clearCookie('token');
//   return res.status(200).json({ message: 'Logged out successfully' });
// });

// // ==================== START SERVER ====================
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// ==================== CONFIGURATION ====================
const PORT = 3000;
const MONGODB_URI = 'mongodb+srv://dhananjaymonga10:7yBvJsZUlD0eC0CL@cluster0.6iufh6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = 'your-super-secret-jwt-key-12345';
const MAIL_USER = 'dhananjay.monga.10@gmail.com';
const MAIL_PASS = 'qwxfcoldhzpmkpgq';

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ==================== DATABASE CONNECTION ====================
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ==================== USER MODEL ====================
const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  // 👉 New Profile fields
  mobile: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },
  studentClass: { type: String, default: null },
  city: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ==================== EMAIL TRANSPORTER ====================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ==================== ROUTES ====================

// 📨 Send OTP for Signup
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user && user.password) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({ email, otp, otpExpiry });
    }

    await transporter.sendMail({
      to: email,
      subject: 'Signup OTP',
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    res.json({ message: 'OTP sent for signup' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// ✅ Verify OTP and complete signup
app.post('/api/auth/verify-otp', async (req, res) => {
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'User registered successfully!', name: user.name });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// 🔑 Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// 🔒 Forgot Password - send OTP
app.post('/api/auth/forgot-password/send-otp', async (req, res) => {
  try {
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
      text: `Your OTP to reset password is ${otp}. Valid for 10 minutes.`,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending forgot password OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// ✅ Reset Password
app.post('/api/auth/forgot-password/verify-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (Date.now() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// 👤 Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🚪 Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

// ==================== PROFILE ROUTES ====================

// 🧾 Get Profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -otpExpiry');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// ✏️ Update Profile
app.put('/api/profile/update', authMiddleware, async (req, res) => {
  try {
    const { name, mobile, dateOfBirth, studentClass, city } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, mobile, dateOfBirth, studentClass, city },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
