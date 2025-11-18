const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    logo: String,
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        joinedAt: Date,
        role: {
          type: String,
          enum: ['Captain', 'Co-Captain', 'Member'],
          default: 'Member'
        }
      }
    ],
    sportType: String,
    location: String,
    stats: {
      totalGames: {
        type: Number,
        default: 0
      },
      wins: {
        type: Number,
        default: 0
      },
      losses: {
        type: Number,
        default: 0
      },
      draws: {
        type: Number,
        default: 0
      }
    },
    isPublic: {
      type: Boolean,
      default: true
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

module.exports = mongoose.model('Team', teamSchema);
