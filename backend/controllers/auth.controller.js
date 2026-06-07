const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to generate a JWT for a given user ID
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Block admin signups — admins can only be created manually
    if (role === 'admin') {
      return res.status(403).json({
        error: 'Admin accounts cannot be created through signup'
      });
    }

    // 2. Make sure role is one of the allowed values
    if (!['student'].includes(role)) {
      return res.status(400).json({
        error: 'Role must be student'
      });
    }

    // 2.5. Validate password length BEFORE hashing
    if (!password || password.length < 8) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters'
        });
    }

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists'
      });
    }

    // 4. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Create the user in MongoDB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 6. Generate a JWT token for this user
    const token = generateToken(newUser._id);

    // 7. Send back the token + safe user info (never the password!)
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Handle Mongoose validation errors (bad email format, short password, etc.)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    // Catch-all for unexpected errors
    res.status(500).json({ error: 'Server error during signup' });
  }
};


/*
What login needs to do:
Take email + password from the request
Look up the user by email
Compare submitted password against the stored hash
If match → generate JWT token, return it
If no match → return 401 Unauthorized
*/

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // 2. Find user by email (lowercase to match how we store it)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Generic message — don't reveal whether email exists
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // 3. Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Same generic message
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // 4. Generate fresh JWT token
    const token = generateToken(user._id);

    // 5. Send back token + user info (never the password!)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};