
const User = require('../models/User');

// Get user profile
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

exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, userType, skills, profilePhoto } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      userType,
      skills,
      profilePhoto,
      updatedAt: Date.now()
    };

    if (city) {
      updateData['location.city'] = city;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, userType, skills } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      userType,
      skills,
      updatedAt: Date.now()
    };

    if (city) {
      updateData['location.city'] = city;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search users by skills and location
exports.searchUsers = async (req, res) => {
  try {
    const { skill, city, maxDistance = 50 } = req.query;

    const query = {};

    if (skill) {
      query['skills.skillName'] = new RegExp(skill, 'i');
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const users = await User.find(query)
      .select('firstName lastName profilePhoto location skills ratings userType')
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

// Get users near location (Geospatial query)
exports.getUsersNearLocation = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    const users = await User.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
      .select('firstName lastName profilePhoto location skills ratings')
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

// Add skill to user
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
