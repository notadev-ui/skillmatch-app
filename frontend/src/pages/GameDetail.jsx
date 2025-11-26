import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const GameDetail = ({ id, onClose }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await gameService.getGameById(id);
        // Backend returns { message, game }
        setGame(response.data.game);
      } catch (error) {
        toast.error('Failed to load game details.');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (!id) return null;

  return (
    <Modal onClose={onClose}>
      {loading ? (
        <div>Loading game details...</div>
      ) : !game ? (
        <div>Game not found.</div>
      ) : (
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-gray-700">{game.description}</p>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <p><strong>Date & Time:</strong> {new Date(game.date).toLocaleDateString()} {game.startTime} - {game.endTime}</p>
                <p><strong>Sport:</strong> {game.sportType}</p>
                <p><strong>Skill Level:</strong> {game.skillLevel}</p>
                <p><strong>Event Type:</strong> {game.eventType}</p>
                <p><strong>Status:</strong> {game.status}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Cost:</strong> ₹{game.cost}</p>
                <p><strong>Players:</strong> {game.registeredPlayers?.length || 0}/{game.maxPlayers}</p>
                <p><strong>Venue:</strong> {game.venue?.name || 'TBD'}</p>
                {game.venue?.location && (
                  <p><strong>Venue Location:</strong> {game.venue.location.address || game.venue.location.city}</p>
                )}
                {game.organizer && (
                  <p><strong>Organizer:</strong> {game.organizer.firstName} {game.organizer.lastName}</p>
                )}
              </div>
            </div>
            {game.ratings && (
              <p><strong>Ratings:</strong> {game.ratings.average} ({game.ratings.count} reviews)</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GameDetail;
