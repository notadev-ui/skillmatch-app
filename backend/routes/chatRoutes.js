const express = require('express');
const {
  getOrCreateChatRoom,
  getChatMessages,
  saveMessage,
  getUserChatRooms,
  createGroupChat
} = require('../controllers/chatController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Protected routes
router.post('/room', authenticate, getOrCreateChatRoom);
router.get('/room/:roomId', authenticate, getChatMessages);
router.post('/message', authenticate, saveMessage);
router.get('/user/rooms', authenticate, getUserChatRooms);
router.post('/group', authenticate, createGroupChat);

module.exports = router;
