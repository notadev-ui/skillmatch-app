import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { FaStar, FaMapPin } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState({
    skill: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      [name]: value
    }));
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div key={player._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  {player.profilePhoto && (
                    <img
                      src={player.profilePhoto}
                      alt={player.firstName}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}

                  <h3 className="text-xl font-bold text-center mb-2">
                    {player.firstName} {player.lastName}
                  </h3>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">
                      {player.ratings.average.toFixed(1)} ({player.ratings.count} reviews)
                    </span>
                  </div>

                  {player.location?.city && (
                    <p className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                      <FaMapPin className="text-blue-600" />
                      {player.location.city}
                    </p>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {player.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.skillName} ({skill.proficiencyLevel})
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    View Profile
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

export default PlayerSearch;
