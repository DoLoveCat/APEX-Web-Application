const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/signup
//  map a URL + HTTP method to a controller function.
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);




/// test =====================
const { requireAuth } = require('../middleware/auth.middleware');

// GET /api/auth/me - get current user info (requires login)
router.get('/me', requireAuth, (req, res) => {
  res.json({
    message: 'You are authenticated!',
    user: req.user
  });
});

/// keep ths line below
module.exports = router;
