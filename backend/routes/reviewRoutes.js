const express = require('express');
const {
  createReview,
  getUserReviews,
  getReviewsByUser,
  getAllReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/user/:userId', getUserReviews);
router.get('/', getAllReviews);

// Protected routes
router.post('/', authenticate, createReview);
router.get('/my-reviews', authenticate, getReviewsByUser);
router.put('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router;
