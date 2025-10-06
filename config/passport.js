// Passport strategies for local and Google OAuth
// This file is imported in app.js
//
// --- DATABASE REQUIREMENTS ---
// Table: users
// Columns: id, username, email, password, google_id, created_at

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import db from './database.js';

// Local strategy for username/email + password
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return done(err);
    if (!results.length) return done(null, false, { message: 'Incorrect email.' });
    const user = results[0];
    if (!user.password) return done(null, false, { message: 'Use Google login for this account.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  });
}));

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
    if (err) return done(err);
    if (results.length) return done(null, results[0]);
    // If user not found, create new user
    db.query('INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)',
      [profile.displayName, profile.emails[0].value, profile.id],
      (err) => {
        if (err) return done(err);
        db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
          if (err) return done(err);
          return done(null, results[0]);
        });
      }
    );
  });
}));

// Serialize/deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});
