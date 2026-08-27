const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message to another user
// @route   POST /api/messages/:userId
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't message yourself" });
    }

    const recipient = await User.findById(req.params.userId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: req.params.userId,
      text: text.trim(),
    });

    const populated = await message.populate('sender', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get full conversation with a specific user
// @route   GET /api/messages/:userId
const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id },
      ],
    })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });

    // Mark incoming messages from this user as read
    await Message.updateMany(
      { sender: req.params.userId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of all conversations (one entry per chat partner, most recent first)
// @route   GET /api/messages
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    })
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar')
      .sort({ createdAt: -1 });

    const seen = new Map();
    for (const msg of messages) {
      const other =
        msg.sender._id.toString() === req.user._id.toString() ? msg.recipient : msg.sender;
      const key = other._id.toString();
      if (!seen.has(key)) {
        seen.set(key, {
          user: other,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt,
          unread:
            msg.recipient._id.toString() === req.user._id.toString() && !msg.isRead,
        });
      }
    }

    res.status(200).json(Array.from(seen.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation, getConversations };