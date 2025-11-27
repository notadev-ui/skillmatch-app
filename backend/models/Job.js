const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    jobType: {
      type: String,
      enum: ['Coach', 'Umpire', 'Helper', 'Staff', 'Other'],
      required: true
    },
    requiredSkills: [
      {
        skillName: String,
        proficiencyLevel: String
      }
    ],
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: String,
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: '₹'
      }
    },
    startDate: Date,
    endDate: Date,
    duration: String,
    applicants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        appliedAt: Date,
        status: {
          type: String,
          enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
          default: 'Applied'
        }
      }
    ],
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Filled'],
      default: 'Open'
    },
    experienceRequired: String,
    workSchedule: String,
    benefits: [String],
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

module.exports = mongoose.model('Job', jobSchema);
