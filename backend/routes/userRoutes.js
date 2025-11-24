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

/* -------------------------
   📌 PUBLIC ROUTES
-------------------------- */

// Search users by skill/city
router.get('/search', searchUsers);

// Find users near a location (geo-query)
router.get('/nearby', getUsersNearLocation);

// Get user profile by userId (public) - must be after specific routes
router.get('/:userId', getUserProfile);


/* -------------------------
   🔐 PROTECTED ROUTES
-------------------------- */

// Get current user profile (must be before /:userId to avoid conflicts)
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

// Update logged-in user's profile
router.put('/profile', authenticate, updateUserProfile);

// Add a skill to logged-in user's profile
router.post('/skill', authenticate, addSkill);

// Admin/manager can get all users
router.get('/', authenticate, getAllUsers);

module.exports = router;
