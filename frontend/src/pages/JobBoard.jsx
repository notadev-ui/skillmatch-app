import React, { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import { FaBriefcase, FaMapPin, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await jobService.getAllJobs(filters);
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = async (jobId) => {
    try {
      await jobService.applyForJob(jobId);
      toast.success('Applied successfully!');
    } catch (error) {
      toast.error('Failed to apply');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Job Opportunities</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Coach">Coach</option>
                <option value="Umpire">Umpire</option>
                <option value="Helper">Helper</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Location"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">No jobs found</div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                    {job.jobType}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <FaMapPin className="text-blue-600" />
                      {job.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaDollarSign className="text-green-600" />
                      ${job.salary?.min} - ${job.salary?.max} {job.salary?.currency}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm"
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApply(job._id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Apply Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
