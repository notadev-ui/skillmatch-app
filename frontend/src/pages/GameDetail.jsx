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
        setGame(response.data);
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
            <p className="mb-2"><strong>Description:</strong> {game.description}</p>
            <p className="mb-2"><strong>Date:</strong> {new Date(game.date).toLocaleString()}</p>
            <p className="mb-2"><strong>Location:</strong> {game.location}</p>
            <p className="mb-2"><strong>Status:</strong> {game.status}</p>
            {/* Add more game details here as needed */}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GameDetail;
