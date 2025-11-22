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

// Get user profile by userId (public)
router.get('/:userId', getUserProfile);


/* -------------------------
   🔐 PROTECTED ROUTES
-------------------------- */

// Update logged-in user's profile
router.put('/profile', authenticate, updateUserProfile);

// Add a skill to logged-in user's profile
router.post('/skill', authenticate, addSkill);

// Admin/manager can get all users
router.get('/', authenticate, getAllUsers);

router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

module.exports = router;
