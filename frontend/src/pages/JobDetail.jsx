import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/api';
import { toast } from 'react-toastify';
import { FaMapPin, FaRupeeSign, FaBriefcase, FaClock, FaBuilding } from 'react-icons/fa';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await jobService.getJobById(id);
        setJob(response.data.job || response.data);
        
        // Check if already applied
        const appliedResponse = await jobService.getAppliedJobs();
        const appliedJobIds = appliedResponse.data.jobs.map(j => j._id);
        setHasApplied(appliedJobIds.includes(id));
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetail();
    }
  }, [id, navigate]);

  const handleApply = async () => {
    if (hasApplied) {
      toast.info('You have already applied for this job');
      return;
    }

    setApplying(true);
    try {
      await jobService.applyForJob(id);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl">Job not found</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    if (typeof salary === 'object') {
      const min = salary.min ?? salary?.range?.min;
      const max = salary.max ?? salary?.range?.max;
      const currency = salary.currency || '₹';
      
      if (min != null && max != null) {
        return `${currency}${min} - ${currency}${max}`;
      }
      if (min != null) {
        return `${currency}${min}`;
      }
      if (max != null) {
        return `${currency}${max}`;
      }
      return `${currency}${salary.amount ?? ''}`;
    }
    return `₹${salary}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Jobs
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{job.title || job.role}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <FaBuilding className="text-blue-600" />
              <span className="text-xl">{job.company || job.organization || 'Company'}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <FaMapPin className="text-red-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{job.location?.city || job.city || 'Remote'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaRupeeSign className="text-green-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-semibold">{formatSalary(job.salary)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaBriefcase className="text-purple-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-semibold">{job.jobType || job.type || 'Full-time'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaClock className="text-orange-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-semibold">
                  {job.createdAt 
                    ? new Date(job.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'Recently'}
                </p>
              </div>
            </div>
          </div>

          {job.description && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleApply}
              disabled={applying || hasApplied}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                hasApplied
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : applying
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {hasApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
