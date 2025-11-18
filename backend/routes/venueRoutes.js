const express = require('express');
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  getVenuesNearLocation,
  deleteVenue
} = require('../controllers/venueController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/', getAllVenues);
router.get('/nearby', getVenuesNearLocation);
router.get('/:venueId', getVenueById);

// Protected routes
router.post('/', authenticate, createVenue);
router.put('/:venueId', authenticate, updateVenue);
router.delete('/:venueId', authenticate, deleteVenue);

module.exports = router;
