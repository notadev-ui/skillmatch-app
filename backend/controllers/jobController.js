const Job = require('../models/Job');

// Create job posting
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      jobType,
      requiredSkills,
      venueId,
      location,
      salary,
      startDate,
      endDate,
      duration,
      experienceRequired,
      workSchedule,
      benefits
    } = req.body;

    const job = new Job({
      title,
      description,
      jobType,
      requiredSkills,
      venue: venueId,
      postedBy: req.userId,
      location,
      salary,
      startDate,
      endDate,
      duration,
      experienceRequired,
      workSchedule,
      benefits
    });

    await job.save();
    await job.populate('postedBy', 'firstName lastName');
    await job.populate('venue', 'name');

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const { jobType, status = 'Open', location } = req.query;

    const query = {};
    if (jobType) query.jobType = jobType;
    if (status) query.status = status;
    if (location) query.location = new RegExp(location, 'i');

    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName')
      .populate('venue', 'name location')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      message: 'Jobs retrieved',
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate('postedBy', 'firstName lastName profilePhoto')
      .populate('venue', 'name location contactEmail')
      .populate('applicants.userId', 'firstName lastName profilePhoto skills ratings');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job retrieved',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apply for job
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      (app) => app.userId.toString() === req.userId.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applicants.push({
      userId: req.userId,
      appliedAt: new Date()
    });

    await job.save();
    await job.populate('applicants.userId', 'firstName lastName');

    res.status(200).json({
      message: 'Applied for job successfully',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicantId, status } = req.body;

    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      {
        $set: {
          'applicants.$[elem].status': status
        }
      },
      {
        arrayFilters: [{ 'elem.userId': applicantId }],
        new: true
      }
    );

    res.status(200).json({
      message: 'Application status updated',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get jobs posted by user
exports.getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId })
      .populate('venue', 'name')
      .populate('applicants.userId', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'User jobs retrieved',
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applied jobs
exports.getAppliedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      'applicants.userId': req.userId
    })
      .populate('postedBy', 'firstName lastName')
      .populate('venue', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Applied jobs retrieved',
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Close job
exports.closeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status: 'Closed' },
      { new: true }
    );

    res.status(200).json({
      message: 'Job closed successfully',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
