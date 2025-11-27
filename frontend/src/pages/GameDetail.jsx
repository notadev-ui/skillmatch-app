import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService } from '../services/api';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaRupeeSign, FaTrophy, FaUsers, FaCalendar } from 'react-icons/fa';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await gameService.getGameById(id);
        setGame(response.data.game || response.data);
      } catch (error) {
        console.error('Failed to load game details:', error);
        toast.error('Failed to load game details');
        navigate('/games');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, navigate]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await gameService.joinGame(id);
      toast.success('Successfully joined the game!');
      // Refresh game data
      const response = await gameService.getGameById(id);
      setGame(response.data.game || response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join game');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl">Game not found</p>
          <button
            onClick={() => navigate('/games')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  const isGameFull = game.registeredPlayers?.length >= game.maxPlayers;
  const hasUserJoined = false; // TODO: Check if current user has joined

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/games')}
          className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Games
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              game.status === 'Upcoming' ? 'bg-green-100 text-green-800' :
              game.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {game.status}
            </span>
          </div>

          {game.description && (
            <p className="text-gray-700 mb-6">{game.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <FaCalendar className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">
                  {new Date(game.date).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaClock className="text-orange-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold">{game.startTime} - {game.endTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaMapMarkerAlt className="text-red-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-semibold">{game.venue?.name || 'TBD'}</p>
                {game.venue?.location && (
                  <p className="text-sm text-gray-600">
                    {game.venue.location.address || game.venue.location.city}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaRupeeSign className="text-green-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Cost</p>
                <p className="font-semibold">₹{game.cost}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaTrophy className="text-yellow-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Sport Type</p>
                <p className="font-semibold">{game.sportType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaUsers className="text-purple-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Players</p>
                <p className="font-semibold">
                  {game.registeredPlayers?.length || 0}/{game.maxPlayers}
                  {isGameFull && <span className="text-red-600 ml-2">(Full)</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Skill Level</p>
              <p className="font-semibold">{game.skillLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Event Type</p>
              <p className="font-semibold">{game.eventType}</p>
            </div>
          </div>

          {game.organizer && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Organized by</p>
              <p className="font-semibold text-lg">
                {game.organizer.firstName} {game.organizer.lastName}
              </p>
            </div>
          )}

          {game.ratings && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-semibold">
                {game.ratings.average?.toFixed(1) || '0.0'} ⭐ ({game.ratings.count} reviews)
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleJoin}
              disabled={joining || isGameFull || hasUserJoined || game.status !== 'Upcoming'}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                game.status !== 'Upcoming'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : isGameFull
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : hasUserJoined
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : joining
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {game.status !== 'Upcoming'
                ? 'Game Not Available'
                : isGameFull
                ? 'Game Full'
                : hasUserJoined
                ? 'Already Joined'
                : joining
                ? 'Joining...'
                : 'Join Game'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
