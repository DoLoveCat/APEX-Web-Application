const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');

// Stateless Google OAuth strategy.
// We DON'T use passport sessions (no serialize/deserialize) — the rest of
// the app is JWT-based, so the route handler turns the Google profile into
// a JWT instead. `done(null, user)` just hands the user to that handler.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5001'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();

        // 1. Already linked to this Google account?
        let user = await User.findOne({ googleId: profile.id });

        // 2. Otherwise, link Google to an existing email account if one exists.
        if (!user) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        // 3. Brand-new user — create one (no password; Google-only login).
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            role: 'student',
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;