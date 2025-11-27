import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService } from '../services/api';
import { useAuthStore } from '../store/store';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaRupeeSign, FaTrophy, FaUsers, FaCalendar, FaTimes, FaTicketAlt, FaDownload } from 'react-icons/fa';
import { generateGameTicketPDF } from '../utils/pdfGenerator';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await gameService.getGameById(id);
        setGame(response.data.game || response.data);
        
        // Check if user already has a ticket for this game
        if (user) {
          try {
            const ticketsResponse = await gameService.getUserTickets();
            const existingTicket = ticketsResponse.data.tickets?.find(
              t => {
                const ticketGameId = typeof t.game === 'object' ? t.game._id : t.game;
                return ticketGameId === id;
              }
            );
            if (existingTicket) {
              console.log('User already has ticket for this game:', existingTicket);
              setGeneratedTicket(existingTicket);
            }
          } catch (err) {
            console.log('Error fetching tickets:', err);
          }
        }
      } catch (error) {
        console.error('Failed to load game details:', error);
        toast.error('Failed to load game details');
        navigate('/games');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, navigate, user]);

  useEffect(() => {
    // Pre-fill user info if logged in
    if (user) {
      setPlayerInfo({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleJoinClick = () => {
    if (!user) {
      toast.error('Please login to join the game');
      navigate('/login');
      return;
    }
    setShowJoinModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    
    if (!playerInfo.name || !playerInfo.email || !playerInfo.phone) {
      toast.error('Please fill all fields');
      return;
    }

    setJoining(true);
    try {
      const response = await gameService.registerForGame(id, playerInfo);
      console.log('Registration response:', response.data);
      
      // Store the ticket whether it's new or existing
      if (response.data.ticket) {
        console.log('Ticket received:', response.data.ticket);
        setGeneratedTicket(response.data.ticket);
        
        if (response.data.alreadyRegistered) {
          toast.info('You already have a ticket for this game!');
        } else {
          // Show success modal for new ticket
          setShowSuccessModal(true);
        }
      } else {
        console.error('No ticket in response');
        toast.error('Registration successful but no ticket received');
      }
      
      // Refresh game data
      const gameResponse = await gameService.getGameById(id);
      setGame(gameResponse.data.game || gameResponse.data);
      
      setShowJoinModal(false);
    } catch (error) {
      console.error('Registration error:', error);
      // Check if error response contains a ticket (edge case)
      if (error.response?.data?.ticket) {
        setGeneratedTicket(error.response.data.ticket);
        toast.info(error.response?.data?.message || 'You already have a ticket');
        setShowJoinModal(false);
      } else {
        toast.error(error.response?.data?.message || 'Failed to join game');
      }
    } finally {
      setJoining(false);
    }
  };

  const handleDownloadTicket = () => {
    if (generatedTicket && (generatedTicket.game || game)) {
      // Use the game data from ticket if available, otherwise use current game
      const gameData = generatedTicket.game || game;
      console.log('Downloading ticket with game data:', gameData);
      generateGameTicketPDF(generatedTicket, gameData);
      toast.success('Ticket downloaded successfully!');
    } else {
      toast.error('Unable to download ticket. Missing game data.');
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
  const hasUserJoined = user && game.registeredPlayers?.some(
    (player) => player.userId?._id === user._id || player.userId === user._id
  );

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
            {generatedTicket ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <FaTicketAlt className="text-green-600 text-5xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Ticket Generated!</h3>
                  <p className="text-green-700 mb-4">Your ticket ID: <span className="font-mono font-bold">{generatedTicket.ticketId}</span></p>
                  <button
                    onClick={handleDownloadTicket}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2 mx-auto"
                  >
                    <FaDownload /> Download Ticket PDF
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleJoinClick}
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
            )}
          </div>
        </div>

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>

              <h2 className="text-2xl font-bold mb-4">Join Game</h2>
              <p className="text-gray-600 mb-6">Please provide your details to generate your ticket</p>

              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={playerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={playerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={playerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Entry Fee:</strong> ₹{game.cost}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    A unique ticket will be generated upon successful registration
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                      joining
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {joining ? 'Processing...' : 'Confirm & Join'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && generatedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-8 relative animate-bounce-in">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <FaTicketAlt className="h-8 w-8 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ticket Generated Successfully! 🎉
                </h3>
                
                <p className="text-gray-600 mb-4">
                  Your game registration is confirmed
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Ticket ID</p>
                  <p className="text-xl font-mono font-bold text-blue-600">
                    {generatedTicket.ticketId}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleDownloadTicket();
                      setShowSuccessModal(false);
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Download Ticket PDF
                  </button>
                  
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  You can also view and download your ticket from your profile
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
