const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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

const adminLogin = async (req, res) => {
  try {
    const { emailOrUsername, password, accessCode } = req.body;

    if (!emailOrUsername || !password || !accessCode) {
      return res.status(400).json({ message: 'Email, password aur access code teeno zaroori hain' });
    }

    if (accessCode !== process.env.ADMIN_ACCESS_CODE) {
      return res.status(401).json({ message: 'Invalid access code' });
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

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Ye login sirf admins ke liye hai' });
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

const updateProfile = async (req, res) => {
  try {
    const {
      bio, website, gender, location, fullName,
      isPrivate, showOnLeaderboard, whoCanMessage, whoCanComment,
      dataSaver, language, defaultWard, notificationPrefs,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (gender !== undefined) user.gender = gender;
    if (location !== undefined) user.location = location;
    if (fullName !== undefined) user.fullName = fullName;
    if (isPrivate !== undefined) user.isPrivate = isPrivate === 'true' || isPrivate === true;
    if (showOnLeaderboard !== undefined) user.showOnLeaderboard = showOnLeaderboard === 'true' || showOnLeaderboard === true;
    if (whoCanMessage !== undefined) user.whoCanMessage = whoCanMessage;
    if (whoCanComment !== undefined) user.whoCanComment = whoCanComment;
    if (dataSaver !== undefined) user.dataSaver = dataSaver === 'true' || dataSaver === true;
    if (language !== undefined) user.language = language;
    if (defaultWard !== undefined) user.defaultWard = defaultWard;
    if (notificationPrefs !== undefined) {
      try {
        const parsed = typeof notificationPrefs === 'string' ? JSON.parse(notificationPrefs) : notificationPrefs;
        user.notificationPrefs = { ...user.notificationPrefs.toObject(), ...parsed };
      } catch {
      }
    }
    if (req.file) user.avatar = `/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't block yourself" });
    }

    const user = await User.findById(req.user._id);
    const targetExists = await User.exists({ _id: req.params.userId });
    if (!targetExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyBlocked = user.blockedUsers.some((id) => id.toString() === req.params.userId);

    if (alreadyBlocked) {
      user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== req.params.userId);
    } else {
      user.blockedUsers.push(req.params.userId);
      user.following = user.following.filter((id) => id.toString() !== req.params.userId);
      await User.findByIdAndUpdate(req.params.userId, {
        $pull: { followers: req.user._id, following: req.user._id },
      });
    }

    await user.save();
    res.status(200).json({ blocked: !alreadyBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('blockedUsers', 'username avatar fullName');
    res.status(200).json(user.blockedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportMyData = async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const user = await User.findById(req.user._id).select('-password');
    const complaints = await Complaint.find({ user: req.user._id });

    res.status(200).json({
      exportedAt: new Date().toISOString(),
      profile: user,
      complaints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      username: { $regex: q.trim(), $options: 'i' },
    })
      .select('username fullName avatar location bio')
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('username fullName avatar bio website location followers following points badges createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFollowersList = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      'followers',
      'username avatar fullName'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFollowingList = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      'following',
      'username avatar fullName'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  forgotPassword,
  updateProfile,
  changePassword,
  toggleBlockUser,
  getBlockedUsers,
  deleteAccount,
  exportMyData,
  searchUsers,
  getUserByUsername,
  getFollowersList,
  getFollowingList,
};