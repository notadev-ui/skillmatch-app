const Chat = require('../models/Chat');

// Get or create chat room
exports.getOrCreateChatRoom = async (req, res) => {
  try {
    const { participantIds, roomType = 'Group', roomName } = req.body;

    let roomId;

    if (roomType === 'Private') {
      const sortedIds = [req.userId, ...participantIds].sort().join('_');
      roomId = `private_${sortedIds}`;
    } else {
      roomId = `${roomType}_${Date.now()}`;
    }

    let chatRoom = await Chat.findOne({ roomId });

    if (!chatRoom) {
      chatRoom = new Chat({
        roomId,
        participants: [req.userId, ...participantIds],
        roomType,
        roomName: roomName || `Room ${Date.now()}`
      });
      await chatRoom.save();
    }

    await chatRoom.populate('participants', 'firstName lastName profilePhoto');

    res.status(200).json({
      message: 'Chat room retrieved',
      chatRoom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get chat messages
exports.getChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const chatRoom = await Chat.findOne({ roomId }).populate('messages.sender', 'firstName lastName profilePhoto');

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.status(200).json({
      message: 'Messages retrieved',
      messages: chatRoom.messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save message
exports.saveMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;

    const chatRoom = await Chat.findOneAndUpdate(
      { roomId },
      {
        $push: {
          messages: {
            sender: req.userId,
            message,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate('messages.sender', 'firstName lastName profilePhoto');

    res.status(200).json({
      message: 'Message saved',
      chatRoom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user chat rooms
exports.getUserChatRooms = async (req, res) => {
  try {
    const chatRooms = await Chat.find({
      participants: req.userId
    })
      .populate('participants', 'firstName lastName profilePhoto')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: 'Chat rooms retrieved',
      count: chatRooms.length,
      chatRooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create group chat
exports.createGroupChat = async (req, res) => {
  try {
    const { participantIds, roomName } = req.body;

    const roomId = `group_${Date.now()}`;

    const chatRoom = new Chat({
      roomId,
      participants: [req.userId, ...participantIds],
      roomType: 'Group',
      roomName
    });

    await chatRoom.save();
    await chatRoom.populate('participants', 'firstName lastName profilePhoto');

    res.status(201).json({
      message: 'Group chat created',
      chatRoom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
