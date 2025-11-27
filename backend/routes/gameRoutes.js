const express = require('express');
const {
  createGame,
  getAllGames,
  getGameById,
  registerPlayerForGame,
  cancelRegistration,
  getUserGames,
  updateGameStatus,
  getUserTickets,
  getTicketById
} = require('../controllers/gameController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/', getAllGames);

// Protected routes - specific paths first before dynamic params
router.post('/', authenticate, createGame);
router.get('/user/games', authenticate, getUserGames);
router.get('/user/tickets', authenticate, getUserTickets);
router.get('/tickets/:ticketId', authenticate, getTicketById);

// Dynamic param routes
router.get('/:gameId', getGameById);
router.post('/:gameId/register', authenticate, registerPlayerForGame);
router.delete('/:gameId/cancel-registration', authenticate, cancelRegistration);
router.put('/:gameId/status', authenticate, updateGameStatus);

module.exports = router;
