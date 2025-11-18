const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    relatedGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    categories: {
      sportsmanship: Number,
      skillLevel: Number,
      teamwork: Number,
      punctuality: Number
    },
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
