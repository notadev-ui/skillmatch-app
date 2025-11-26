const express = require('express');
const {
  createBooking,
  getUserBookings,
  getVenueBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// All booking routes require authentication
router.post('/', authenticate, createBooking);
router.get('/user', authenticate, getUserBookings);
router.get('/venue/:venueId', authenticate, getVenueBookings);
router.get('/:bookingId', authenticate, getBookingById);
router.put('/:bookingId/status', authenticate, updateBookingStatus);
router.delete('/:bookingId', authenticate, cancelBooking);

module.exports = router;
