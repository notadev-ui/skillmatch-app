const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
