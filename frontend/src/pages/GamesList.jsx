import React, { useState, useEffect, useCallback } from 'react';
import { gameService } from '../services/api';
import { FaCalendar, FaMapPin, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    sportType: '',
    skillLevel: '',
    status: 'Upcoming'
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await gameService.getAllGames(filters);
      setGames(response.data.games);
    } catch (error) {
      toast.error('Failed to fetch games');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

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
        <h1 className="text-4xl font-bold mb-8">Games & Events</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sport Type</label>
              <input
                type="text"
                name="sportType"
                value={filters.sportType}
                onChange={handleFilterChange}
                placeholder="e.g., Cricket, Football"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skill Level</label>
              <select
                name="skillLevel"
                value={filters.skillLevel}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">No games found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>

                  <div className="space-y-2 mb-4">
                    <p className="flex items-center gap-2">
                      <FaCalendar className="text-blue-600" />
                      {new Date(game.date).toLocaleDateString()} at {game.startTime}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMapPin className="text-blue-600" />
                      {game.venue?.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUsers className="text-blue-600" />
                      {game.registeredPlayers.length}/{game.maxPlayers} Players
                    </p>
                  </div>

                  <div className="flex gap-2 justify-between">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                      {game.skillLevel}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                      ${game.cost}
                    </span>
                  </div>

                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
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

export default GamesList;
