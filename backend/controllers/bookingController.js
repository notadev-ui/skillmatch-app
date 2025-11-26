const Booking = require('../models/Booking');
const Venue = require('../models/Venue');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      venueId,
      bookingDate,
      startTime,
      endTime,
      duration,
      contactPhone,
      notes
    } = req.body;

    console.log('Creating booking:', { venueId, bookingDate, startTime, endTime, duration, userId: req.userId });

    // Fetch venue to calculate cost
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const totalCost = venue.pricePerHour * duration;

    const booking = new Booking({
      venue: venueId,
      user: req.userId,
      bookingDate,
      startTime,
      endTime,
      duration,
      totalCost,
      contactPhone,
      notes
    });

    await booking.save();
    await booking.populate('venue', 'name location pricePerHour');
    await booking.populate('user', 'firstName lastName email phone');

    console.log('Booking created successfully:', booking._id);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.userId);
    
    const bookings = await Booking.find({ user: req.userId })
      .populate('venue', 'name location pricePerHour photos')
      .sort({ bookingDate: -1 });

    console.log(`Found ${bookings.length} bookings for user ${req.userId}`);

    res.status(200).json({
      message: 'User bookings retrieved',
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get bookings for a specific venue (for venue managers)
exports.getVenueBookings = async (req, res) => {
  try {
    const { venueId } = req.params;

    const bookings = await Booking.find({ venue: venueId })
      .populate('user', 'firstName lastName email phone')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      message: 'Venue bookings retrieved',
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('venue', 'name location pricePerHour photos')
      .populate('user', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking retrieved',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only booking owner can cancel
    if (booking.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    booking.updatedAt = Date.now();

    await booking.save();

    res.status(200).json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'Cancelled';
    booking.updatedAt = Date.now();
    await booking.save();

    res.status(200).json({
      message: 'Booking cancelled',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
