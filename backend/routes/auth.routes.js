const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('../config/passport');
const { generateToken } = require('../utils/jwt');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// POST /api/auth/signup
//  map a URL + HTTP method to a controller function.
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/google - kick off the Google OAuth flow.
// session: false because we issue a JWT instead of a login session.
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// GET /api/auth/google/callback - Google redirects here after consent.
// On success, mint a JWT and hand it to the frontend via the URL so the
// SPA can store it in localStorage exactly like password login does.
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login?error=google` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${CLIENT_URL}/login?token=${token}`);
  }
);




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