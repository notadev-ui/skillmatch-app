import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuthStore } from '../store/store';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

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
  }, [user]);

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
      navigate('/players'); // Redirect to players section after update
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {profileData.profilePhoto && (
            <div className="mb-6 flex justify-center">
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
              />
            </div>
          )}

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
              {profileData.profilePhoto && (
                <img
                  src={profileData.profilePhoto}
                  alt="Profile Preview"
                  className="mt-4 w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                />
              )}
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
      </div>
    </div>
  );
};

export default Profile;
