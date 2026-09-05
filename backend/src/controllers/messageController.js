const Message = require('../models/Message');
const User = require('../models/User');

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

    const sender = await User.findById(req.user._id).select('blockedUsers');

    if (recipient.blockedUsers?.some((id) => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You cannot message this user' });
    }
    if (sender.blockedUsers?.some((id) => id.toString() === recipient._id.toString())) {
      return res.status(403).json({ message: 'Unblock this user to send a message' });
    }

    if (recipient.whoCanMessage === 'followers') {
      const isFollower = recipient.followers.some((id) => id.toString() === req.user._id.toString());
      if (!isFollower) {
        return res.status(403).json({ message: 'This user only accepts messages from followers' });
      }
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

    await Message.updateMany(
      { sender: req.params.userId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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