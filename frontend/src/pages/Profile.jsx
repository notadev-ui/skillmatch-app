import React, { useState, useEffect } from 'react';
import { userService, bookingService, jobService } from '../services/api';
import { useAuthStore } from '../store/store';
import { FaCalendar, FaMapPin, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUser, FaCog, FaBriefcase, FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [profileData, setProfileData] = useState({
    profilePhoto: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    state: '',
    userType: '',
    skills: [],
    bio: '',
    preferredSports: '', // comma separated string in UI
    availableHours: 'Flexible' // matches enum values
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'bookings', or 'applications'
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        profilePhoto: user.profilePhoto || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        // location fields from model
        city: user.location?.city || '',
        address: user.location?.address || '',
        state: user.location?.state || '',
        userType: user.userType || 'Player',
        skills: user.skills || [],
        bio: user.bio || '',
        preferredSports: Array.isArray(user.preferredSports)
          ? user.preferredSports.join(', ')
          : '',
        availableHours: user.availableHours?.type || 'Flexible'
      });
    }
    
    // Check if we should open specific tab from URL
    const tabParam = searchParams.get('tab');
    if (tabParam === 'bookings') {
      setActiveTab('bookings');
    } else if (tabParam === 'applications') {
      setActiveTab('applications');
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (activeTab === 'bookings' && user) {
      fetchBookings();
    } else if (activeTab === 'applications' && user) {
      fetchApplications();
    }
  }, [activeTab, user]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await bookingService.getUserBookings();
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const response = await jobService.getAppliedJobs();
      setApplications(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setProfileData((prev) => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const addSkill = () => {
    setProfileData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { skillName: '', proficiencyLevel: 'Beginner' }
      ]
    }));
  };

  const removeSkill = (index) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData((prev) => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert preferredSports string -> array for backend
      const payload = {
        ...profileData,
        preferredSports: profileData.preferredSports
          ? profileData.preferredSports
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : []
      };

      const response = await userService.updateProfile(payload);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12">Please log in to view your profile.</div>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <FaCheckCircle className="text-green-600" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-red-600" />;
      case 'Completed':
        return <FaCheckCircle className="text-blue-600" />;
      default:
        return <FaHourglassHalf className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              {profileData.profilePhoto ? (
                <img
                  src={profileData.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-600 shadow-lg">
                  <FaUser className="text-white text-5xl" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-lg text-gray-600 mb-2">{profileData.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold text-sm">
                  {profileData.userType}
                </span>
                {profileData.city && (
                  <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaMapPin /> {profileData.city}, {profileData.state}
                  </span>
                )}
              </div>
              {profileData.bio && (
                <p className="text-gray-700 italic max-w-2xl">{profileData.bio}</p>
              )}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md transition transform hover:scale-105"
            >
              <FaCog /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'info'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Applications
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'info' ? (
              /* Profile Form */
              <div>
                {isEditing && (
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Profile Photo URL</label>
                    <input
                      type="text"
                      name="profilePhoto"
                      value={profileData.profilePhoto}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, profilePhoto: e.target.value }))
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info + location */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">User Type</label>
                <select
                  name="userType"
                  value={profileData.userType}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="Player">Player</option>
                  <option value="Coach">Coach</option>
                  <option value="Umpire">Umpire</option>
                  <option value="Staff">Staff</option>
                  <option value="Venue Manager">Venue Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Available Hours</label>
                <select
                  name="availableHours"
                  value={profileData.availableHours}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Evenings">Evenings</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Tell others a bit about yourself..."
              />
            </div>

            {/* Preferred sports */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Preferred Sports (comma separated)
              </label>
              <input
                type="text"
                name="preferredSports"
                value={profileData.preferredSports}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="e.g. Cricket, Football, Tennis"
              />
            </div>

            {/* Skills */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Skills</label>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add Skill
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Skill Name"
                      value={skill.skillName || ''}
                      onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <select
                      value={skill.proficiencyLevel || 'Beginner'}
                      onChange={(e) =>
                        handleSkillChange(index, 'proficiencyLevel', e.target.value)
                      }
                      disabled={!isEditing}
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Professional">Professional</option>
                    </select>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      ) : activeTab === 'bookings' ? (
        /* Bookings Tab */
        <div>
          <h2 className="text-2xl font-bold mb-6">My Venue Bookings</h2>
          
          {loadingBookings ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaCalendar className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No bookings yet</p>
              <button
                onClick={() => navigate('/venues')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Browse Venues
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white border rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {booking.venue?.photos && booking.venue.photos[0] && (
                          <img
                            src={booking.venue.photos[0]}
                            alt={booking.venue.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {booking.venue?.name || 'Venue'}
                          </h3>
                          
                          <div className="space-y-1 text-gray-600">
                            <p className="flex items-center gap-2">
                              <FaCalendar className="text-blue-600" />
                              {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="flex items-center gap-2">
                              <FaClock className="text-green-600" />
                              {booking.startTime} - {booking.endTime} ({booking.duration} hour{booking.duration > 1 ? 's' : ''})
                            </p>
                            <p className="flex items-center gap-2">
                              <FaMapPin className="text-red-600" />
                              {booking.venue?.location?.address || booking.venue?.location?.city || 'Location'}
                            </p>
                          </div>

                          {booking.notes && (
                            <p className="mt-2 text-sm text-gray-500 italic">
                              Note: {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-green-600">₹{booking.totalCost}</p>
                      </div>

                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/venues/${booking.venue._id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        View Venue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Applications Tab */
        <div>
          <h2 className="text-2xl font-bold mb-6">My Job Applications</h2>
          
          {loadingApplications ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaBriefcase className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No applications yet</p>
              <button
                onClick={() => navigate('/jobs')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((job) => {
                const application = job.applicants?.find(app => app.applicant?._id === user._id || app.applicant === user._id);
                const applicationStatus = application?.status || 'Pending';
                const appliedDate = application?.appliedAt;

                return (
                  <div
                    key={job._id}
                    className="bg-white border rounded-lg shadow-md hover:shadow-lg transition p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {job.title}
                        </h3>
                        
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center gap-2">
                            <FaBriefcase className="text-blue-600" />
                            {job.venueId?.name || 'Venue'}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaMapPin className="text-red-600" />
                            {job.venueId?.location?.city || job.location?.city || 'Location'}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaRupeeSign className="text-green-600" />
                            {job.salary?.min && job.salary?.max 
                              ? `₹${job.salary.min} - ₹${job.salary.max}`
                              : 'Salary not specified'
                            } {job.salary?.period && `/ ${job.salary.period}`}
                          </p>
                          {appliedDate && (
                            <p className="flex items-center gap-2 text-sm">
                              <FaCalendar className="text-purple-600" />
                              Applied on: {new Date(appliedDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>

                        {job.description && (
                          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                          applicationStatus === 'Accepted' ? 'bg-green-100 text-green-800' :
                          applicationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {applicationStatus === 'Accepted' && <FaCheckCircle />}
                          {applicationStatus === 'Rejected' && <FaTimesCircle />}
                          {applicationStatus === 'Pending' && <FaHourglassHalf />}
                          {applicationStatus}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Job Type</p>
                          <p className="text-lg font-semibold text-gray-800">{job.employmentType || 'N/A'}</p>
                        </div>

                        <button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          View Job
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
