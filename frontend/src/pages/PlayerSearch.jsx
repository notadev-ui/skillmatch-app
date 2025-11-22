import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { FaStar, FaMapPin } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProfileDetail from './ProfileDetail';

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState({
    skill: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  const fetchAllPlayers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.searchUsers({});
      setPlayers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch players');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userService.searchUsers(filters);
      setPlayers(response.data.users);
      toast.success(`Found ${response.data.count} players`);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openProfileModal = (id) => {
    setSelectedProfileId(id);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setSelectedProfileId(null);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Find Players</h1>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Skill Type</label>
                <input
                  type="text"
                  name="skill"
                  value={filters.skill}
                  onChange={handleFilterChange}
                  placeholder="e.g., Cricket, Football"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="City name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Players Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">No players found</div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {players.map((player) => (
              <div key={player._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                <div className="flex p-6 gap-6 items-center">
                  {player.profilePhoto && (
                    <img
                      src={player.profilePhoto}
                      alt={player.firstName}
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      {player.firstName} {player.lastName}
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        <span className="font-semibold">{player.ratings.average.toFixed(1)}</span>
                        <span className="text-gray-500">({player.ratings.count} reviews)</span>
                      </div>
                      {player.location?.city && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaMapPin className="text-blue-600" />
                          <span>{player.location.city}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-3">
                        {player.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold shadow"
                          >
                            {skill.skillName} ({skill.proficiencyLevel})
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => openProfileModal(player._id)}
                      className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isProfileModalOpen && (
          <ProfileDetail id={selectedProfileId} onClose={closeProfileModal} />
        )}
      </div>
    </div>
  );
};

export default PlayerSearch;
