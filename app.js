
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import db from './config/database.js';
import authRoutes from './routes/auth.js';
import classRoutes from './routes/classes.js';
import contentRoutes from './routes/content.js';
import reportRoutes from './routes/reports.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Passport config (strategies will be set up in a separate file)
import './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Test MySQL connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
  console.log('MySQL connected');
  connection.release();
});

// --- DATABASE REQUIREMENTS ---
// You need a 'users' table with at least these columns:
// id (INT, PRIMARY KEY, AUTO_INCREMENT)
// username (VARCHAR)
// email (VARCHAR, UNIQUE)
// password (VARCHAR, nullable for OAuth users)
// google_id (VARCHAR, nullable, for Google OAuth)
// created_at (DATETIME)
//
// --- SQL TO CREATE DATABASE AND TABLE ---
// CREATE DATABASE sahayak;
// USE sahayak;
// CREATE TABLE users (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   username VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE,
//   password VARCHAR(255),
//   google_id VARCHAR(255),
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRoutes);
app.use('/classes', classRoutes);
app.use('/content', contentRoutes);
app.use('/reports', reportRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('partials/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
