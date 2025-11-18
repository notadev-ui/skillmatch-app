const express = require('express');
const {
  createJob,
  getAllJobs,
  getJobById,
  applyForJob,
  updateApplicationStatus,
  getUserJobs,
  getAppliedJobs,
  closeJob
} = require('../controllers/jobController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:jobId', getJobById);

// Protected routes
router.post('/', authenticate, createJob);
router.post('/:jobId/apply', authenticate, applyForJob);
router.put('/:jobId/application-status', authenticate, updateApplicationStatus);
router.get('/user/posted', authenticate, getUserJobs);
router.get('/user/applied', authenticate, getAppliedJobs);
router.put('/:jobId/close', authenticate, closeJob);

module.exports = router;
