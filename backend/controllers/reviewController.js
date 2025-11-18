const Review = require('../models/Review');
const User = require('../models/User');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { revieweeId, rating, comment, relatedGame, relatedJob, categories } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      reviewer: req.userId,
      reviewee: revieweeId,
      rating,
      comment,
      relatedGame,
      relatedJob,
      categories
    });

    await review.save();
    await review.populate('reviewer', 'firstName lastName profilePhoto');
    await review.populate('reviewee', 'firstName lastName profilePhoto');

    // Update user rating
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      'ratings.average': avgRating,
      'ratings.count': allReviews.length
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for user
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Reviews retrieved',
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews given by user
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.userId })
      .populate('reviewee', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Reviews retrieved',
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { minRating, maxRating } = req.query;

    const query = {};
    if (minRating) query.rating = { $gte: parseInt(minRating) };
    if (maxRating) {
      query.rating = query.rating || {};
      query.rating.$lte = parseInt(maxRating);
    }

    const reviews = await Review.find(query)
      .populate('reviewer', 'firstName lastName profilePhoto')
      .populate('reviewee', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      message: 'Reviews retrieved',
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment, categories } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      {
        rating,
        comment,
        categories
      },
      { new: true }
    )
      .populate('reviewer', 'firstName lastName')
      .populate('reviewee', 'firstName lastName');

    // Recalculate user rating
    const allReviews = await Review.find({ reviewee: review.reviewee._id });
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(review.reviewee._id, {
      'ratings.average': avgRating,
      'ratings.count': allReviews.length
    });

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate user rating
    const allReviews = await Review.find({ reviewee: review.reviewee });
    const avgRating = allReviews.length > 0 ? allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length : 0;

    await User.findByIdAndUpdate(review.reviewee, {
      'ratings.average': avgRating,
      'ratings.count': allReviews.length
    });

    res.status(200).json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
