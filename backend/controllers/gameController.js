const Game = require('../models/Game');
const Venue = require('../models/Venue');
const GameTicket = require('../models/GameTicket');

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
    const { name, email, phone } = req.body;

    console.log('Registration request:', { gameId: req.params.gameId, userId: req.userId, name, email, phone });

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if user already has a ticket for this game
    const existingTicket = await GameTicket.findOne({
      game: req.params.gameId,
      user: req.userId
    }).populate({
      path: 'game',
      select: 'title sportType date startTime endTime cost skillLevel status',
      populate: {
        path: 'venue',
        select: 'name location'
      }
    });

    if (existingTicket) {
      console.log('User already has ticket:', existingTicket.ticketId);
      // Return the existing ticket so frontend can show it
      return res.status(200).json({ 
        message: 'You already have a ticket for this game',
        ticket: existingTicket,
        alreadyRegistered: true
      });
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

    // Create ticket
    const ticket = new GameTicket({
      game: req.params.gameId,
      user: req.userId,
      playerInfo: {
        name,
        email,
        phone
      }
    });

    await ticket.save();
    console.log('Ticket created:', ticket._id);

    // Register player
    game.registeredPlayers.push({
      userId: req.userId,
      joinedAt: new Date()
    });

    await game.save();
    
    // Populate ticket with game details for PDF generation
    const populatedTicket = await GameTicket.findById(ticket._id)
      .populate({
        path: 'game',
        select: 'title sportType date startTime endTime cost skillLevel status',
        populate: {
          path: 'venue',
          select: 'name location'
        }
      })
      .populate('user', 'firstName lastName email');

    console.log('Ticket populated:', populatedTicket);

    res.status(200).json({
      message: 'Registered for game successfully',
      game,
      ticket: populatedTicket
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

// Get user's game tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await GameTicket.find({ user: req.userId })
      .populate({
        path: 'game',
        populate: {
          path: 'venue',
          select: 'name location'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Tickets retrieved',
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await GameTicket.findById(req.params.ticketId)
      .populate({
        path: 'game',
        populate: {
          path: 'venue organizer',
          select: 'name location firstName lastName'
        }
      })
      .populate('user', 'firstName lastName');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns this ticket
    if (ticket.user._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      message: 'Ticket retrieved',
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
