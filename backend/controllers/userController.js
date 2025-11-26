const User = require('../models/User');

// Get user profile by ID (for public/admin view)
const mongoose = require('mongoose');

exports.getUserProfile = async (req, res) => {
  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Use lean() to get plain JavaScript object and avoid serialization issues
    const user = await User.findById(req.params.userId)
      .select('-password')
      .lean();

    console.log("User found in DB:", user); // Added debug log

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure ratings object exists with defaults
    if (!user.ratings) {
      user.ratings = {
        average: 0,
        count: 0
      };
    }

    // Ensure ratings.average and ratings.count are numbers
    if (typeof user.ratings.average !== 'number') {
      user.ratings.average = 0;
    }
    if (typeof user.ratings.count !== 'number') {
      user.ratings.count = 0;
    }

    // Convert _id to string to ensure proper serialization
    if (user._id) {
      user._id = user._id.toString();
    }

    // Ensure skills array exists
    if (!Array.isArray(user.skills)) {
      user.skills = [];
    }

    // Convert Date objects to ISO strings for proper JSON serialization
    if (user.createdAt && user.createdAt instanceof Date) {
      user.createdAt = user.createdAt.toISOString();
    }
    if (user.updatedAt && user.updatedAt instanceof Date) {
      user.updatedAt = user.updatedAt.toISOString();
    }

    // Handle badges array with Date fields
    if (Array.isArray(user.badges)) {
      user.badges = user.badges.map(badge => {
        if (badge.earnedDate && badge.earnedDate instanceof Date) {
          return { ...badge, earnedDate: badge.earnedDate.toISOString() };
        }
        return badge;
      });
    }

    // Ensure location coordinates are properly formatted
    if (user.location && user.location.coordinates) {
      if (user.location.coordinates.type && typeof user.location.coordinates.type === 'object') {
        // If type is an object (Mongoose schema type), convert to string
        user.location.coordinates.type = 'Point';
      }
      // Ensure coordinates array is properly formatted
      if (Array.isArray(user.location.coordinates.coordinates)) {
        user.location.coordinates.coordinates = user.location.coordinates.coordinates.map(coord => 
          typeof coord === 'object' && coord !== null ? coord.toString() : coord
        );
      }
    }

    // Convert teams ObjectId references to strings
    if (Array.isArray(user.teams)) {
      user.teams = user.teams.map(team => {
        if (team && typeof team === 'object' && team._id) {
          return team._id.toString();
        }
        return team ? team.toString() : team;
      });
    }

    // Convert any remaining ObjectId fields to strings
    const convertObjectIds = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (obj instanceof mongoose.Types.ObjectId) {
        return obj.toString();
      }
      if (Array.isArray(obj)) {
        return obj.map(item => convertObjectIds(item));
      }
      if (typeof obj === 'object') {
        const converted = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            converted[key] = convertObjectIds(obj[key]);
          }
        }
        return converted;
      }
      return obj;
    };

    // Final conversion pass
    const cleanedUser = convertObjectIds(user);

    // Ensure profilePhoto is always a string (not an object or null)
    if (cleanedUser.profilePhoto !== null && cleanedUser.profilePhoto !== undefined) {
      if (typeof cleanedUser.profilePhoto !== 'string') {
        // If it's an object, try to extract URL or convert to string
        if (typeof cleanedUser.profilePhoto === 'object') {
          cleanedUser.profilePhoto = cleanedUser.profilePhoto.url || cleanedUser.profilePhoto.toString() || '';
        } else {
          cleanedUser.profilePhoto = String(cleanedUser.profilePhoto);
        }
      }
      // Trim whitespace
      cleanedUser.profilePhoto = cleanedUser.profilePhoto.trim();
      // If empty string after trim, set to null
      if (cleanedUser.profilePhoto === '') {
        cleanedUser.profilePhoto = null;
      }
    } else {
      cleanedUser.profilePhoto = null;
    }

    res.status(200).json({
      message: 'User profile retrieved',
      user: cleanedUser
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    console.error(error.stack);
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
    // Ensure profilePhoto is always a string
    if (profilePhoto !== undefined) {
      if (typeof profilePhoto === 'string') {
        updateData.profilePhoto = profilePhoto.trim() || null;
      } else if (profilePhoto === null) {
        updateData.profilePhoto = null;
      } else {
        // If it's an object, try to extract URL or convert to string
        updateData.profilePhoto = profilePhoto.url || String(profilePhoto) || null;
      }
    }
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
    )
      .select('-password')
      .lean(); // Use lean() to get plain object

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure ratings object exists with defaults
    if (!user.ratings) {
      user.ratings = {
        average: 0,
        count: 0
      };
    }

    // Ensure ratings.average and ratings.count are numbers
    if (typeof user.ratings.average !== 'number') {
      user.ratings.average = 0;
    }
    if (typeof user.ratings.count !== 'number') {
      user.ratings.count = 0;
    }

    // Convert _id to string
    if (user._id) {
      user._id = user._id.toString();
    }

    // Ensure profilePhoto is always a string
    if (user.profilePhoto !== null && user.profilePhoto !== undefined) {
      if (typeof user.profilePhoto !== 'string') {
        if (typeof user.profilePhoto === 'object') {
          user.profilePhoto = user.profilePhoto.url || user.profilePhoto.toString() || null;
        } else {
          user.profilePhoto = String(user.profilePhoto);
        }
      }
      user.profilePhoto = user.profilePhoto.trim() || null;
    } else {
      user.profilePhoto = null;
    }

    // Convert Date objects to ISO strings
    if (user.createdAt && user.createdAt instanceof Date) {
      user.createdAt = user.createdAt.toISOString();
    }
    if (user.updatedAt && user.updatedAt instanceof Date) {
      user.updatedAt = user.updatedAt.toISOString();
    }

    // Ensure skills array exists
    if (!Array.isArray(user.skills)) {
      user.skills = [];
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
