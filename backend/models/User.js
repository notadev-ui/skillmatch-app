const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      required: true
    },
    profilePhoto: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: ''
    },
    location: {
      address: String,
      city: String,
      state: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      }
    },
    skills: [
      {
        skillName: String,
        proficiencyLevel: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
          default: 'Beginner'
        },
        verified: {
          type: Boolean,
          default: false
        },
        certification: String,
        yearsExperience: Number
      }
    ],
    preferredSports: [String],
    availableHours: {
      type: {
        type: String,
        enum: ['Flexible', 'Weekdays', 'Weekends', 'Evenings'],
        default: 'Flexible'
      }
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    badges: [
      {
        badgeName: String,
        badgeIcon: String,
        earnedDate: Date
      }
    ],
    userType: {
      type: String,
      enum: ['Player', 'Coach', 'Umpire', 'Staff', 'Venue Manager'],
      default: 'Player'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
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

// Index for geospatial queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
