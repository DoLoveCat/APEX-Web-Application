const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// All friend routes require authentication
router.use(requireAuth);

// Find users to add
router.get('/search', friendController.searchUsers);

// Suggested friends (similar career goals)
router.get('/recommendations', friendController.getRecommendations);

// Requests
router.post('/request', friendController.sendRequest);
router.get('/requests', friendController.getIncomingRequests);
router.post('/accept', friendController.acceptRequest);
router.post('/decline', friendController.declineRequest);

// My friends
router.get('/', friendController.getFriends);

module.exports = router;
