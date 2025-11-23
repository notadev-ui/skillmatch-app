import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const ProfileDetail = ({ id, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userService.getUserProfile(id);
        setProfile(response.data.user); // Fixed here
      } catch (error) {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (!id) return null;

  return (
    <Modal onClose={onClose}>
      {loading ? (
        <div>Loading profile...</div>
      ) : !profile ? (
        <div>Profile not found.</div>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {profile.profilePhoto && (
              <div className="flex justify-center mb-6">
                <img
                  src={profile.profilePhoto}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-4">{profile.firstName} {profile.lastName}</h1>
            <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
            <p className="mb-2"><strong>Phone:</strong> {profile.phone}</p>
            <p className="mb-2"><strong>City:</strong> {profile.city}</p>
            <p className="mb-2"><strong>User Type:</strong> {profile.userType}</p>
            <div>
              <h2 className="text-xl font-semibold mb-2">Skills:</h2>
              <ul className="list-disc list-inside">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <li key={index}>{skill.skillName} ({skill.proficiencyLevel})</li>
                  ))
                ) : (
                  <li>No skills listed.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProfileDetail;
