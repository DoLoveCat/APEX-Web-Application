const jwt = require('jsonwebtoken');

// Helper to generate a JWT for a given user ID.
// Shared by password login/signup and Google OAuth so every
// token in the app is signed and shaped the same way.
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };