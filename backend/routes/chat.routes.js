const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// All chat routes require authentication
router.use(requireAuth);

// Direct (1-on-1) chat with a friend
router.post('/direct', chatController.getOrCreateDirectRoom);

// Rooms
router.get('/rooms', chatController.getRooms);
router.post('/rooms', chatController.createRoom);
router.get('/rooms/:roomId', chatController.getRoom);
router.put('/rooms/:roomId', chatController.renameRoom);

// Messages
router.get('/rooms/:roomId/messages', chatController.getMessages);
router.post('/rooms/:roomId/messages', chatController.sendMessage);

// Edit & Delete
router.put('/messages/:messageId', chatController.editMessage);
router.delete('/messages/:messageId', chatController.deleteMessage);

// Reply
router.post('/messages/:messageId/reply', chatController.replyToMessage);

// Thumbs
router.post('/messages/:messageId/thumbsup', chatController.thumbsUp);
router.post('/messages/:messageId/thumbsdown', chatController.thumbsDown);

module.exports = router;