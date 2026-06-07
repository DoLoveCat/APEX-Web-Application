const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const router = express.Router();

const passport = require("passport");

router.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            message: 'An account with this email already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.json({
        message: 'Account registered',
        user
    });
});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: 'Invalid email'
        });
    }

    // IF THEY SIGN IN WITH GOOGLE
    if (user.googleId && !user.password) {
        return res.status(401).json({ message: 'Please login with Google' });
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }

    //  COULD BE PROBLEM
    req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    res.json({
        message: 'Login successful',
        user: req.session.user
    });
});

router.post('/logout', (req, res) => {

    req.session.destroy(() => {

        res.clearCookie('connect.sid');

        res.json({
            message: 'Logged out'
        });

    });
});

router.get('/me', (req, res) => {
    const user = req.session.user || req.user;

    if (!user) {
        return res.status(401).json({
            authenticated: false
        });
    }

    res.json({
        authenticated: true,
        user: user
    });
});

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

module.exports = router;
