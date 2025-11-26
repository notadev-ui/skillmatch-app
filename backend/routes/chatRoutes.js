const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate'); // FIXED

// Get all users except logged-in user
router.get('/users', authenticate, async (req, res) => {
  try {
    console.log("REQ USER:", req.userId); // debug

    const currentUserId = req.userId;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('-password -resetToken -resetTokenExpiry');

    return res.json({ users });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).json({ message: 'Server error while loading users' });
  }
});

// Get messages
router.get('/messages/:otherUserId', authenticate, async (req, res) => {
  try {
    const current = req.userId;
    const other = req.params.otherUserId;

    const messages = await Message.find({
      $or: [
        { sender: current, receiver: other },
        { sender: other, receiver: current }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName name email')
      .populate('receiver', 'firstName lastName name email');

    return res.json({ messages });
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).json({ message: 'Server error while loading messages' });
  }
});

// Send message
router.post('/messages', authenticate, async (req, res) => {
  try {
    const current = req.userId;
    const { receiverId, text } = req.body;

    if (!receiverId || !text?.trim()) {
      return res.status(400).json({ message: 'receiverId and text are required' });
    }

    const newMsg = await Message.create({
      sender: current,
      receiver: receiverId,
      text: text.trim(),
    });

    const populated = await newMsg.populate([
      { path: 'sender', select: 'firstName lastName name email' },
      { path: 'receiver', select: 'firstName lastName name email' }
    ]);

    return res.status(201).json({ message: populated });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// Delete message
router.delete('/messages/:messageId', authenticate, async (req, res) => {
  try {
    const current = req.userId;
    const { messageId } = req.params;

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (msg.sender.toString() !== current) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await msg.deleteOne();
    return res.json({ message: 'Message deleted successfully', messageId });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error while deleting message' });
  }
});

// Get conversations (users with recent chats)
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const current = req.userId;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: current }, { receiver: current }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName name email profilePhoto')
      .populate('receiver', 'firstName lastName name email profilePhoto');

    const conversationsMap = new Map();

    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === current
        ? msg.receiver
        : msg.sender;

      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            isMine: msg.sender._id.toString() === current
          }
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return res.json({ conversations });
  } catch (error) {
    console.error('Error loading conversations:', error);
    res.status(500).json({ message: 'Server error while loading conversations' });
  }
});

module.exports = router;


// const express = require('express');
// const {
//   getOrCreateChatRoom,
//   getChatMessages,
//   saveMessage,
//   getUserChatRooms,
//   createGroupChat
// } = require('../controllers/chatController');
// const authenticate = require('../middleware/authenticate');

// const router = express.Router();

// // Protected routes
// router.post('/room', authenticate, getOrCreateChatRoom);
// router.get('/room/:roomId', authenticate, getChatMessages);
// router.post('/message', authenticate, saveMessage);
// router.get('/user/rooms', authenticate, getUserChatRooms);
// router.post('/group', authenticate, createGroupChat);

// module.exports = router;
