const Game = require('../models/Game');
const Venue = require('../models/Venue');

// Create game/event
exports.createGame = async (req, res) => {
  try {
    const {
      title,
      description,
      sportType,
      skillLevel,
      venueId,
      date,
      startTime,
      endTime,
      maxPlayers,
      eventType,
      cost
    } = req.body;

    const game = new Game({
      title,
      description,
      sportType,
      skillLevel,
      venue: venueId,
      date,
      startTime,
      endTime,
      maxPlayers,
      eventType,
      cost,
      organizer: req.userId
    });

    await game.save();
    await game.populate('venue', 'name location').populate('organizer', 'firstName lastName');

    res.status(201).json({
      message: 'Game/Event created successfully',
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all games/events
exports.getAllGames = async (req, res) => {
  try {
    const { sportType, skillLevel, city, status = 'Upcoming' } = req.query;

    const query = {};

    if (sportType) query.sportType = sportType;
    if (skillLevel) query.skillLevel = skillLevel;
    if (status) query.status = status;

    const games = await Game.find(query)
      .populate('venue', 'name location')
      .populate('organizer', 'firstName lastName profilePhoto')
      .populate('registeredPlayers.userId', 'firstName lastName profilePhoto')
      .sort({ date: 1 })
      .limit(50);

    res.status(200).json({
      message: 'Games retrieved',
      count: games.length,
      games
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId)
      .populate('venue', 'name location description')
      .populate('organizer', 'firstName lastName profilePhoto')
      .populate('registeredPlayers.userId', 'firstName lastName profilePhoto skills');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({
      message: 'Game retrieved',
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register player for game
exports.registerPlayerForGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if already registered
    const alreadyRegistered = game.registeredPlayers.some(
      (player) => player.userId.toString() === req.userId.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this game' });
    }

    // Check capacity
    if (game.registeredPlayers.length >= game.maxPlayers) {
      return res.status(400).json({ message: 'Game is full' });
    }

    game.registeredPlayers.push({
      userId: req.userId,
      joinedAt: new Date()
    });

    await game.save();
    await game.populate('registeredPlayers.userId', 'firstName lastName');

    res.status(200).json({
      message: 'Registered for game successfully',
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.gameId,
      {
        $pull: {
          registeredPlayers: { userId: req.userId }
        }
      },
      { new: true }
    ).populate('registeredPlayers.userId', 'firstName lastName');

    res.status(200).json({
      message: 'Registration cancelled',
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get games organized by user
exports.getUserGames = async (req, res) => {
  try {
    const games = await Game.find({ organizer: req.userId })
      .populate('venue', 'name location')
      .populate('registeredPlayers.userId', 'firstName lastName')
      .sort({ date: -1 });

    res.status(200).json({
      message: 'User games retrieved',
      count: games.length,
      games
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update game status
exports.updateGameStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const game = await Game.findByIdAndUpdate(
      req.params.gameId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      message: 'Game status updated',
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
