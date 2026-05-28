// backend/routes/users.routes.js

// match controllers/users.controller.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');

router.get('/me', requireAuth, usersController.getMe);
router.put('/me', requireAuth, usersController.updateMe);

module.exports = router;