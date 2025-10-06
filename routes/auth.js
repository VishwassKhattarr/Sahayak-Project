import express from 'express';
import { login, register, logout, googleAuth, googleCallback } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

// Local login
router.post('/login', login);

// Local register
router.post('/register', register);

// Logout
router.get('/logout', logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallback);

export default router;
