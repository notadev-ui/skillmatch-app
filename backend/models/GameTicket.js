const mongoose = require('mongoose');

const gameTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    playerInfo: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Used', 'Cancelled'],
      default: 'Active'
    },
    qrCode: String
  },
  { timestamps: true }
);

// Generate unique ticket ID before validation
gameTicketSchema.pre('validate', function (next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.ticketId = `GT-${timestamp}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('GameTicket', gameTicketSchema);
