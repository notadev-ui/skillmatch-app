const Venue = require('../models/Venue');

// Create venue
exports.createVenue = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      location,
      contactEmail,
      contactPhone,
      facilities,
      amenities,
      capacity,
      pricePerHour,
      operatingHours
    } = req.body;

    const venue = new Venue({
      name,
      description,
      type,
      location: {
        ...location,
        coordinates: {
          type: 'Point',
          coordinates: [location.coordinates[0], location.coordinates[1]]
        }
      },
      contactEmail,
      contactPhone,
      facilities,
      amenities,
      capacity,
      pricePerHour,
      operatingHours,
      manager: req.userId
    });

    await venue.save();

    res.status(201).json({
      message: 'Venue created successfully',
      venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const { type, city, maxDistance = 50000 } = req.query;

    const query = { isActive: true };

    if (type) {
      query.type = type;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const venues = await Venue.find(query)
      .populate('manager', 'firstName lastName')
      .limit(50);

    res.status(200).json({
      message: 'Venues retrieved',
      count: venues.length,
      venues
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueId)
      .populate('manager', 'firstName lastName contactEmail');

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.status(200).json({
      message: 'Venue retrieved',
      venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update venue
exports.updateVenue = async (req, res) => {
  try {
    const { name, description, facilities, amenities, operatingHours, pricePerHour } = req.body;

    const venue = await Venue.findByIdAndUpdate(
      req.params.venueId,
      {
        name,
        description,
        facilities,
        amenities,
        operatingHours,
        pricePerHour,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Venue updated successfully',
      venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get venues near location
exports.getVenuesNearLocation = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000 } = req.query;

    const venues = await Venue.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isActive: true
    })
      .populate('manager', 'firstName lastName')
      .limit(30);

    res.status(200).json({
      message: 'Nearby venues found',
      count: venues.length,
      venues
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete venue
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.venueId,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      message: 'Venue deleted successfully',
      venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
