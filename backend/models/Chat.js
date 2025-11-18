const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    roomType: {
      type: String,
      enum: ['Private', 'Group', 'Team'],
      default: 'Group'
    },
    roomName: String,
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

module.exports = mongoose.model('Chat', chatSchema);
