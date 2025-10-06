import bcrypt from 'bcryptjs';
import db from '../config/database.js';
import passport from 'passport';

// Local login
export const login = (req, res, next) => {
	// Implement local login logic here (use passport.authenticate('local'))
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(401).json({ message: info.message });
		req.logIn(user, (err) => {
			if (err) return next(err);
			return res.json({ message: 'Login successful', user });
		});
	})(req, res, next);
};

// Local register
export const register = (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}
	db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
		if (err) return res.status(500).json({ message: 'Database error' });
		if (results.length > 0) return res.status(409).json({ message: 'User already exists' });
		const hashedPassword = await bcrypt.hash(password, 10);
		db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
			if (err) return res.status(500).json({ message: 'Database error' });
			res.status(201).json({ message: 'User registered successfully' });
		});
	});
};

// Logout
export const logout = (req, res) => {
	req.logout(() => {
		res.json({ message: 'Logged out' });
	});
};

// Google OAuth start
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth callback
export const googleCallback = (req, res) => {
	// Successful authentication, redirect or respond
	res.json({ message: 'Google OAuth successful', user: req.user });
};
