const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  getUsersNearLocation,
  addSkill,
  getAllUsers
} = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/search', searchUsers);
router.get('/nearby', getUsersNearLocation);
router.get('/:userId', getUserProfile);

// Protected routes
router.put('/profile', authenticate, updateUserProfile);
router.post('/skill', authenticate, addSkill);
router.get('/', authenticate, getAllUsers);

module.exports = router;
