const express = require('express');
const {
  createGame,
  getAllGames,
  getGameById,
  registerPlayerForGame,
  cancelRegistration,
  getUserGames,
  updateGameStatus
} = require('../controllers/gameController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/', getAllGames);
router.get('/:gameId', getGameById);

// Protected routes
router.post('/', authenticate, createGame);
router.post('/:gameId/register', authenticate, registerPlayerForGame);
router.delete('/:gameId/cancel-registration', authenticate, cancelRegistration);
router.get('/user/games', authenticate, getUserGames);
router.put('/:gameId/status', authenticate, updateGameStatus);

module.exports = router;
