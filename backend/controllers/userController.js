const User = require('../models/User');

// Get user profile by ID (for public/admin view)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('teams', 'name logo sportType')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile retrieved',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update logged-in user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      address,
      state,
      userType,
      skills,
      profilePhoto,
      bio,
      preferredSports,
      availableHours
    } = req.body;

    const updateData = {
      updatedAt: Date.now()
    };

    // Only update fields that are provided (avoid overwriting with undefined)
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (userType !== undefined) updateData.userType = userType;
    if (skills !== undefined) updateData.skills = skills;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
    if (bio !== undefined) updateData.bio = bio;
    if (preferredSports !== undefined) updateData.preferredSports = preferredSports;

    // Nested location fields from model
    if (city !== undefined) updateData['location.city'] = city;
    if (address !== undefined) updateData['location.address'] = address;
    if (state !== undefined) updateData['location.state'] = state;

    // availableHours is defined in the model as:
    // availableHours: { type: { type: String, enum: [...] } }
    if (availableHours !== undefined) {
      updateData['availableHours.type'] = availableHours;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,       // set by your auth middleware
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search users by skills and location (city)
exports.searchUsers = async (req, res) => {
  try {
    const { skill, city } = req.query;

    const query = {};

    if (skill) {
      query['skills.skillName'] = new RegExp(skill, 'i');
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const users = await User.find(query)
      .select(
        'firstName lastName profilePhoto location skills ratings userType preferredSports availableHours'
      )
      .limit(20);

    res.status(200).json({
      message: 'Users found',
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users near location (Geospatial query - uses location.coordinates from model)
exports.getUsersNearLocation = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({ message: 'longitude and latitude are required' });
    }

    const users = await User.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance, 10)
        }
      }
    })
      .select(
        'firstName lastName profilePhoto location skills ratings userType preferredSports availableHours'
      )
      .limit(20);

    res.status(200).json({
      message: 'Nearby users found',
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add skill to user (matches skills[] structure in model)
exports.addSkill = async (req, res) => {
  try {
    const { skillName, proficiencyLevel, yearsExperience, certification } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          skills: {
            skillName,
            proficiencyLevel,
            yearsExperience,
            certification
          }
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Skill added successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (for admin purposes)
exports.getAllUsers = async (req, res) => {
  try {
    const { userType } = req.query;
    const query = {};

    if (userType) {
      query.userType = userType;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(100);

    res.status(200).json({
      message: 'Users retrieved',
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
