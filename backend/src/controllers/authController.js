const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's own profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password - reset directly (simple version, no email service)
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Please provide email and new password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged-in user's own profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { bio, website, gender, location, fullName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (gender !== undefined) user.gender = gender;
    if (location !== undefined) user.location = location;
    if (fullName !== undefined) user.fullName = fullName;
    if (req.file) user.avatar = `/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, updateProfile };