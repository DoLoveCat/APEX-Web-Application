const Room = require('../models/Room');
const Message = require('../models/Message');

function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// GET /api/chat/rooms  -> public group rooms only (direct/1-on-1 rooms hidden)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isDirect: { $ne: true } }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Server error fetching rooms' });
  }
};

// GET /api/chat/rooms/:roomId  -> single room (used to resolve titles, incl. DMs)
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('participants', 'name');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Server error fetching room' });
  }
};

// POST /api/chat/direct { friendId }  -> find-or-create a 1-on-1 room with a friend
exports.getOrCreateDirectRoom = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId) return res.status(400).json({ error: 'friendId is required' });
    if (friendId === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't message yourself" });
    }

    // must actually be friends to open a direct chat
    const isFriend = req.user.friends.some((id) => id.toString() === friendId);
    if (!isFriend) {
      return res.status(403).json({ error: 'You can only message your friends' });
    }

    // existing direct room with exactly these two participants?
    let room = await Room.findOne({
      isDirect: true,
      participants: { $all: [req.user._id, friendId], $size: 2 }
    });

    if (!room) {
      room = await Room.create({
        roomId: generateRoomId(),
        isDirect: true,
        participants: [req.user._id, friendId],
        createdBy: req.user._id
      });
    }

    res.json(room);
  } catch (error) {
    console.error('Get/create direct room error:', error);
    res.status(500).json({ error: 'Server error opening direct chat' });
  }
};

// POST /api/chat/rooms
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      roomId: generateRoomId(),
      name: (req.body.name || '').trim(),
      createdBy: req.user._id
    });
    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error creating room' });
  }
};

// PUT /api/chat/rooms/:roomId  -> rename a room
exports.renameRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      { name: (req.body.name || '').trim() },
      { new: true }
    );
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    console.error('Rename room error:', error);
    res.status(500).json({ error: 'Server error renaming room' });
  }
};

// GET /api/chat/rooms/:roomId/messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

// POST /api/chat/rooms/:roomId/messages
exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      roomId: req.params.roomId,
      username: req.user.name,
      userId: req.user._id,
      text: req.body.text,
      replies: [],
      thumbsUp: [],
      thumbsDown: []
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

// PUT /api/chat/messages/:messageId
exports.editMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }
    message.text = req.body.text;
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Server error editing message' });
  }
};

// DELETE /api/chat/messages/:messageId
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }
    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error deleting message' });
  }
};

// POST /api/chat/messages/:messageId/reply
exports.replyToMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    message.replies.push({
      username: req.user.name,
      userId: req.user._id,
      text: req.body.text
    });
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Server error replying' });
  }
};

// POST /api/chat/messages/:messageId/thumbsup
exports.thumbsUp = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    const username = req.user.name;
    if (message.thumbsUp.includes(username)) {
      message.thumbsUp.pull(username);
    } else {
      message.thumbsDown.pull(username);
      message.thumbsUp.push(username);
    }
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Thumbs up error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/chat/messages/:messageId/thumbsdown
exports.thumbsDown = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    const username = req.user.name;
    if (message.thumbsDown.includes(username)) {
      message.thumbsDown.pull(username);
    } else {
      message.thumbsUp.pull(username);
      message.thumbsDown.push(username);
    }
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Thumbs down error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};